import { App, Plugin, PluginSettingTab, Setting, TFile, Notice } from 'obsidian';

interface EnhancedAudioSettings {
	volume: number;
	autoplay: boolean;
	persistPosition: boolean;
	showWaveform: boolean;
	playbackSpeed: number;
	currentTrack: string | null;
	currentPosition: number;
	isPlaying: boolean;
}

const DEFAULT_SETTINGS: EnhancedAudioSettings = {
	volume: 0.7,
	autoplay: false,
	persistPosition: true,
	showWaveform: true,
	playbackSpeed: 1.0,
	currentTrack: null,
	currentPosition: 0,
	isPlaying: false
}

export default class EnhancedAudioPlayerPlugin extends Plugin {
	settings: EnhancedAudioSettings;
	private observer: MutationObserver;
	private audioInstances: Map<string, CustomAudioPlayer> = new Map();
	public currentPlayer: CustomAudioPlayer | null = null;
	private globalControls: HTMLElement | null = null;

	async onload() {
		await this.loadSettings();

		// Créer les contrôles globaux
		this.createGlobalControls();

		// IMPORTANT: Enregistrer le post-processor markdown AVANT tout autre chose
		this.registerMarkdownPostProcessor((element, context) => {
			this.processAudioLinks(element, context);
		});

		// Observer les changements DOM pour intercepter les nouveaux éléments audio
		this.initializeDOMObserver();

		// Remplacer tous les éléments audio existants avec retry
		this.scheduleAudioReplacement();

		// Ajouter les commandes
		this.addCommand({
			id: 'toggle-global-player',
			name: 'Basculer les contrôles globaux',
			callback: () => this.toggleGlobalControls()
		});

		this.addCommand({
			id: 'play-pause-current',
			name: 'Lecture/Pause audio actuel',
			callback: () => this.toggleCurrentAudio()
		});

		this.addCommand({
			id: 'force-replace-audio',
			name: 'Forcer le remplacement des lecteurs audio',
			callback: () => this.forceReplaceAllAudio()
		});

		// Ajouter l'onglet de paramètres
		this.addSettingTab(new EnhancedAudioSettingTab(this.app, this));

		// Sauvegarde périodique
		this.registerInterval(
			window.setInterval(() => this.saveCurrentState(), 5000)
		);

		// Recherche périodique de nouveaux lecteurs audio
		this.registerInterval(
			window.setInterval(() => this.scanAndReplaceAudio(), 2000)
		);

		// Restaurer l'état précédent
		this.restoreState();

		console.log('Enhanced Audio Player Plugin chargé');
	}

	onunload() {
		// Nettoyer l'observateur
		if (this.observer) {
			this.observer.disconnect();
		}

		// Nettoyer les instances audio
		this.audioInstances.forEach(instance => instance.destroy());
		this.audioInstances.clear();

		// Supprimer les contrôles globaux
		if (this.globalControls) {
			this.globalControls.remove();
		}

		console.log('Enhanced Audio Player Plugin déchargé');
	}

	initializeDOMObserver() {
		this.observer = new MutationObserver((mutations) => {
			mutations.forEach((mutation) => {
				mutation.addedNodes.forEach((node) => {
					if (node.nodeType === Node.ELEMENT_NODE) {
						const element = node as Element;
						
						// Chercher les éléments audio dans le nouveau contenu
						const audioElements = element.querySelectorAll('audio');
						audioElements.forEach(audio => this.replaceAudioElement(audio as HTMLAudioElement));
						
						// Vérifier si le nœud lui-même est un audio
						if (element.tagName === 'AUDIO') {
							this.replaceAudioElement(element as HTMLAudioElement);
						}
					}
				});
			});
		});

		// Observer tout le document
		this.observer.observe(document.body, {
			childList: true,
			subtree: true
		});
	}

	replaceExistingAudioElements() {
		const audioElements = document.querySelectorAll('audio');
		audioElements.forEach(audio => this.replaceAudioElement(audio as HTMLAudioElement));
	}

	processAudioLinks(element: HTMLElement, context: any) {
		// Chercher tous les liens vers des fichiers audio
		const audioLinks = element.querySelectorAll('a.internal-link[href*=".mp3"], a.internal-link[href*=".wav"], a.internal-link[href*=".ogg"], a.internal-link[href*=".m4a"], a.internal-link[href*=".flac"], a.internal-link[href*=".aac"]');
		
		audioLinks.forEach((link: Element) => {
			const href = (link as HTMLAnchorElement).getAttribute('href');
			if (href) {
				this.replaceAudioLink(link as HTMLAnchorElement, href);
			}
		});

		// Aussi intercepter les éléments audio déjà créés
		setTimeout(() => {
			const audioElements = element.querySelectorAll('audio');
			audioElements.forEach(audio => this.replaceAudioElement(audio as HTMLAudioElement));
		}, 100);
	}

	async replaceAudioLink(linkElement: HTMLAnchorElement, href: string) {
		try {
			// Nettoyer le href pour obtenir le nom du fichier
			const filename = href.replace(/^.*\//, '').replace(/^.*\\/, '');
			
			// Trouver le fichier dans le vault
			const file = this.app.vault.getAbstractFileByPath(filename);
			if (!file || !(file instanceof TFile)) {
				console.log('Fichier audio non trouvé:', filename);
				return;
			}

			// Créer une URL blob pour le fichier
			const arrayBuffer = await this.app.vault.readBinary(file);
			const blob = new Blob([arrayBuffer]);
			const url = URL.createObjectURL(blob);

			// Créer un lecteur personnalisé avec l'URL blob
			const customPlayer = new CustomAudioPlayer(url, this, filename);
			const playerId = `audio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
			
			// Stocker l'instance
			this.audioInstances.set(playerId, customPlayer);

			// Remplacer le lien par le lecteur
			const container = customPlayer.getElement();
			container.dataset.playerId = playerId;
			
			linkElement.parentNode?.replaceChild(container, linkElement);
			console.log('Lien audio remplacé:', filename);
		} catch (error) {
			console.error('Erreur lors du remplacement du lien audio:', error);
		}
	}

	scheduleAudioReplacement() {
		// Remplacer immédiatement
		this.replaceExistingAudioElements();
		
		// Retry après délais pour gérer le chargement asynchrone
		setTimeout(() => this.replaceExistingAudioElements(), 500);
		setTimeout(() => this.replaceExistingAudioElements(), 1000);
		setTimeout(() => this.replaceExistingAudioElements(), 2000);
	}

	forceReplaceAllAudio() {
		// Nettoyer les instances existantes
		this.audioInstances.forEach(instance => instance.destroy());
		this.audioInstances.clear();
		
		// Remplacer tous les éléments audio
		this.replaceExistingAudioElements();
		new Notice('Lecteurs audio forcés à se remplacer');
	}

	scanAndReplaceAudio() {
		// Scan périodique pour les nouveaux éléments audio
		const audioElements = document.querySelectorAll('audio:not([data-enhanced])');
		if (audioElements.length > 0) {
			console.log(`Trouvé ${audioElements.length} nouveaux éléments audio à remplacer`);
			audioElements.forEach(audio => this.replaceAudioElement(audio as HTMLAudioElement));
		}
	}

	replaceAudioElement(audioElement: HTMLAudioElement) {
		// Éviter de remplacer plusieurs fois le même élément
		if (audioElement.dataset.enhanced) return;

		const src = audioElement.src || audioElement.currentSrc;
		if (!src) return;

		console.log('Remplacement du lecteur audio:', src);

		// Marquer comme traité
		audioElement.dataset.enhanced = 'true';

		// Créer le lecteur personnalisé
		const customPlayer = new CustomAudioPlayer(src, this);
		const playerId = `audio-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
		
		// Stocker l'instance
		this.audioInstances.set(playerId, customPlayer);

		// Remplacer l'élément dans le DOM
		const container = customPlayer.getElement();
		container.dataset.playerId = playerId;
		
		try {
			audioElement.parentNode?.replaceChild(container, audioElement);
			console.log('Lecteur audio remplacé avec succès');
		} catch (error) {
			console.error('Erreur lors du remplacement:', error);
		}
	}

	createGlobalControls() {
		this.globalControls = document.createElement('div');
		this.globalControls.className = 'enhanced-audio-global-controls';
		
		this.globalControls.innerHTML = `
			<div class="global-player-main">
				<div class="global-track-info">
					<div class="global-track-title">Aucun audio en cours</div>
					<div class="global-track-time">--:-- / --:--</div>
				</div>
				<div class="global-controls">
					<button class="global-btn prev-btn" title="Précédent">⏮</button>
					<button class="global-btn play-pause-btn" title="Lecture/Pause">▶</button>
					<button class="global-btn next-btn" title="Suivant">⏭</button>
					<div class="global-volume">
						<span class="volume-icon">🔊</span>
						<input type="range" class="volume-slider" min="0" max="1" step="0.1" value="${this.settings.volume}">
					</div>
					<button class="global-btn close-btn" title="Fermer">×</button>
				</div>
			</div>
			<div class="global-progress">
				<div class="progress-bar">
					<div class="progress-fill"></div>
				</div>
			</div>
		`;

		// Ajouter les événements
		this.setupGlobalControlEvents();

		// Ajouter les styles
		this.addGlobalStyles();

		// Ajouter au DOM
		document.body.appendChild(this.globalControls);
		
		// Initialement caché
		this.globalControls.style.display = 'none';
	}

	setupGlobalControlEvents() {
		const playPauseBtn = this.globalControls?.querySelector('.play-pause-btn') as HTMLElement;
		const volumeSlider = this.globalControls?.querySelector('.volume-slider') as HTMLInputElement;
		const progressBar = this.globalControls?.querySelector('.progress-bar') as HTMLElement;
		const closeBtn = this.globalControls?.querySelector('.close-btn') as HTMLElement;

		playPauseBtn?.addEventListener('click', () => this.toggleCurrentAudio());
		
		volumeSlider?.addEventListener('input', (e) => {
			const volume = parseFloat((e.target as HTMLInputElement).value);
			this.setGlobalVolume(volume);
		});

		progressBar?.addEventListener('click', (e) => {
			if (this.currentPlayer) {
				const rect = progressBar.getBoundingClientRect();
				const clickX = e.clientX - rect.left;
				const percentage = clickX / rect.width;
				this.currentPlayer.seekTo(percentage);
			}
		});

		closeBtn?.addEventListener('click', () => this.hideGlobalControls());
	}

	setCurrentPlayer(player: CustomAudioPlayer) {
		// Pause le lecteur précédent
		if (this.currentPlayer && this.currentPlayer !== player) {
			this.currentPlayer.pause();
		}

		this.currentPlayer = player;
		this.updateGlobalControls();
		this.showGlobalControls();
	}

	updateGlobalControls() {
		if (!this.currentPlayer || !this.globalControls) return;

		const titleEl = this.globalControls.querySelector('.global-track-title');
		const timeEl = this.globalControls.querySelector('.global-track-time');
		const playPauseBtn = this.globalControls.querySelector('.play-pause-btn');
		const progressFill = this.globalControls.querySelector('.progress-fill') as HTMLElement;

		if (titleEl) titleEl.textContent = this.currentPlayer.getTitle();
		if (timeEl) timeEl.textContent = this.currentPlayer.getTimeDisplay();
		if (playPauseBtn) playPauseBtn.textContent = this.currentPlayer.isPlaying() ? '⏸' : '▶';
		
		if (progressFill) {
			const progress = this.currentPlayer.getProgress();
			progressFill.style.width = `${progress * 100}%`;
		}
	}

	toggleCurrentAudio() {
		if (this.currentPlayer) {
			this.currentPlayer.toggle();
			this.updateGlobalControls();
		}
	}

	setGlobalVolume(volume: number) {
		this.settings.volume = volume;
		this.audioInstances.forEach(player => player.setVolume(volume));
		this.saveSettings();
	}

	showGlobalControls() {
		if (this.globalControls) {
			this.globalControls.style.display = 'block';
		}
	}

	hideGlobalControls() {
		if (this.globalControls) {
			this.globalControls.style.display = 'none';
		}
		if (this.currentPlayer) {
			this.currentPlayer.pause();
		}
	}

	toggleGlobalControls() {
		if (this.globalControls) {
			const isVisible = this.globalControls.style.display !== 'none';
			if (isVisible) {
				this.hideGlobalControls();
			} else {
				this.showGlobalControls();
			}
		}
	}

	addGlobalStyles() {
		const style = document.createElement('style');
		style.textContent = `
			.enhanced-audio-global-controls {
				position: fixed;
				bottom: 20px;
				left: 50%;
				transform: translateX(-50%);
				width: 400px;
				max-width: calc(100vw - 40px);
				background: var(--background-secondary);
				border: 1px solid var(--background-modifier-border);
				border-radius: 12px;
				box-shadow: 0 8px 24px rgba(0,0,0,0.15);
				z-index: 1000;
				font-family: var(--font-ui);
				overflow: hidden;
			}

			.global-player-main {
				padding: 16px;
				display: flex;
				align-items: center;
				gap: 12px;
			}

			.global-track-info {
				flex: 1;
				min-width: 0;
			}

			.global-track-title {
				font-weight: 600;
				color: var(--text-normal);
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
				font-size: 14px;
				margin-bottom: 2px;
			}

			.global-track-time {
				color: var(--text-muted);
				font-size: 12px;
			}

			.global-controls {
				display: flex;
				align-items: center;
				gap: 8px;
			}

			.global-btn {
				background: none;
				border: none;
				color: var(--text-muted);
				cursor: pointer;
				padding: 8px;
				border-radius: 6px;
				font-size: 16px;
				transition: all 0.2s ease;
				min-width: 36px;
				height: 36px;
				display: flex;
				align-items: center;
				justify-content: center;
			}

			.global-btn:hover {
				background: var(--background-modifier-hover);
				color: var(--text-normal);
			}

			.global-btn.play-pause-btn {
				background: var(--interactive-accent);
				color: white;
				font-size: 18px;
			}

			.global-btn.play-pause-btn:hover {
				background: var(--interactive-accent-hover);
			}

			.global-volume {
				display: flex;
				align-items: center;
				gap: 6px;
				margin-left: 8px;
			}

			.volume-icon {
				font-size: 14px;
			}

			.volume-slider {
				width: 60px;
				height: 4px;
				background: var(--background-modifier-border);
				outline: none;
				border-radius: 2px;
			}

			.global-progress {
				height: 4px;
				background: var(--background-modifier-border);
				cursor: pointer;
			}

			.progress-fill {
				height: 100%;
				background: var(--interactive-accent);
				width: 0%;
				transition: width 0.1s ease;
			}

			.enhanced-audio-player {
				background: var(--background-primary);
				border: 1px solid var(--background-modifier-border);
				border-radius: 8px;
				padding: 16px;
				margin: 8px 0;
				font-family: var(--font-ui);
			}

			.enhanced-audio-header {
				display: flex;
				justify-content: space-between;
				align-items: center;
				margin-bottom: 12px;
			}

			.enhanced-audio-title {
				font-weight: 600;
				color: var(--text-normal);
				font-size: 14px;
			}

			.enhanced-audio-controls {
				display: flex;
				align-items: center;
				justify-content: center;
				gap: 12px;
				margin-bottom: 12px;
			}

			.enhanced-audio-btn {
				background: none;
				border: none;
				color: var(--text-muted);
				cursor: pointer;
				padding: 8px 12px;
				border-radius: 6px;
				font-size: 16px;
				transition: all 0.2s ease;
			}

			.enhanced-audio-btn:hover {
				background: var(--background-modifier-hover);
				color: var(--text-normal);
			}

			.enhanced-audio-btn.play-btn {
				background: var(--interactive-accent);
				color: white;
				font-size: 18px;
			}

			.enhanced-audio-progress {
				height: 6px;
				background: var(--background-modifier-border);
				border-radius: 3px;
				cursor: pointer;
				margin-bottom: 8px;
			}

			.enhanced-audio-progress-fill {
				height: 100%;
				background: var(--interactive-accent);
				border-radius: 3px;
				width: 0%;
				transition: width 0.1s ease;
			}

			.enhanced-audio-time {
				display: flex;
				justify-content: space-between;
				font-size: 12px;
				color: var(--text-muted);
			}

			/* Mobile responsive */
			@media (max-width: 768px) {
				.enhanced-audio-global-controls {
					width: calc(100vw - 20px);
					bottom: 10px;
				}
				
				.global-player-main {
					padding: 12px;
					gap: 8px;
				}
				
				.global-controls {
					gap: 4px;
				}
				
				.global-btn {
					min-width: 32px;
					height: 32px;
					font-size: 14px;
				}
				
				.volume-slider {
					width: 50px;
				}
			}
		`;
		document.head.appendChild(style);
	}

	saveCurrentState() {
		if (this.currentPlayer) {
			this.settings.currentTrack = this.currentPlayer.getSrc();
			this.settings.currentPosition = this.currentPlayer.getCurrentTime();
			this.settings.isPlaying = this.currentPlayer.isPlaying();
			this.saveSettings();
		}
	}

	restoreState() {
		// La restauration se fera automatiquement quand les éléments audio seront créés
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}

class CustomAudioPlayer {
	private audio: HTMLAudioElement;
	private container: HTMLElement;
	private plugin: EnhancedAudioPlayerPlugin;
	private src: string;
	private title: string;

	constructor(src: string, plugin: EnhancedAudioPlayerPlugin, filename?: string) {
		this.src = src;
		this.plugin = plugin;
		this.title = filename || this.extractTitle(src);
		
		this.createAudioElement();
		this.createUI();
		this.setupEvents();
	}

	private extractTitle(src: string): string {
		const url = new URL(src, window.location.href);
		const path = url.pathname;
		const filename = path.substring(path.lastIndexOf('/') + 1);
		return decodeURIComponent(filename) || 'Audio';
	}

	private createAudioElement() {
		this.audio = document.createElement('audio');
		this.audio.src = this.src;
		this.audio.preload = 'metadata';
		this.audio.volume = this.plugin.settings.volume;
	}

	private createUI() {
		this.container = document.createElement('div');
		this.container.className = 'enhanced-audio-player';
		
		this.container.innerHTML = `
			<div class="enhanced-audio-header">
				<div class="enhanced-audio-title">${this.title}</div>
				<div class="enhanced-audio-time-display">--:-- / --:--</div>
			</div>
			<div class="enhanced-audio-controls">
				<button class="enhanced-audio-btn play-btn" title="Lecture/Pause">▶</button>
				<button class="enhanced-audio-btn speed-btn" title="Vitesse">1x</button>
			</div>
			<div class="enhanced-audio-progress">
				<div class="enhanced-audio-progress-fill"></div>
			</div>
			<div class="enhanced-audio-time">
				<span class="current-time">0:00</span>
				<span class="total-time">0:00</span>
			</div>
		`;
	}

	private setupEvents() {
		const playBtn = this.container.querySelector('.play-btn') as HTMLElement;
		const speedBtn = this.container.querySelector('.speed-btn') as HTMLElement;
		const progress = this.container.querySelector('.enhanced-audio-progress') as HTMLElement;

		playBtn?.addEventListener('click', () => {
			this.toggle();
			this.plugin.setCurrentPlayer(this);
		});

		speedBtn?.addEventListener('click', () => this.cycleSpeed());
		progress?.addEventListener('click', (e) => this.handleProgressClick(e));

		// Événements audio
		this.audio.addEventListener('loadedmetadata', () => this.updateDisplay());
		this.audio.addEventListener('timeupdate', () => this.updateProgress());
		this.audio.addEventListener('ended', () => this.onEnded());
		this.audio.addEventListener('play', () => this.onPlay());
		this.audio.addEventListener('pause', () => this.onPause());
	}

	private handleProgressClick(e: MouseEvent) {
		const rect = (e.target as HTMLElement).getBoundingClientRect();
		const clickX = e.clientX - rect.left;
		const percentage = clickX / rect.width;
		this.seekTo(percentage);
	}

	private cycleSpeed() {
		const speeds = [0.5, 0.75, 1.0, 1.25, 1.5, 2.0];
		const currentIndex = speeds.indexOf(this.audio.playbackRate);
		const nextIndex = (currentIndex + 1) % speeds.length;
		this.audio.playbackRate = speeds[nextIndex];
		
		const speedBtn = this.container.querySelector('.speed-btn');
		if (speedBtn) speedBtn.textContent = `${speeds[nextIndex]}x`;
	}

	private updateDisplay() {
		const totalTime = this.formatTime(this.audio.duration || 0);
		const totalTimeEl = this.container.querySelector('.total-time');
		if (totalTimeEl) totalTimeEl.textContent = totalTime;
	}

	private updateProgress() {
		const currentTime = this.audio.currentTime || 0;
		const duration = this.audio.duration || 0;
		const percentage = duration > 0 ? (currentTime / duration) * 100 : 0;

		const progressFill = this.container.querySelector('.enhanced-audio-progress-fill') as HTMLElement;
		const currentTimeEl = this.container.querySelector('.current-time');
		const timeDisplay = this.container.querySelector('.enhanced-audio-time-display');

		if (progressFill) progressFill.style.width = `${percentage}%`;
		if (currentTimeEl) currentTimeEl.textContent = this.formatTime(currentTime);
		if (timeDisplay) {
			timeDisplay.textContent = `${this.formatTime(currentTime)} / ${this.formatTime(duration)}`;
		}

		// Mettre à jour les contrôles globaux si c'est le lecteur actuel
		if (this.plugin.currentPlayer === this) {
			this.plugin.updateGlobalControls();
		}
	}

	private onPlay() {
		const playBtn = this.container.querySelector('.play-btn');
		if (playBtn) playBtn.textContent = '⏸';
	}

	private onPause() {
		const playBtn = this.container.querySelector('.play-btn');
		if (playBtn) playBtn.textContent = '▶';
	}

	private onEnded() {
		this.onPause();
	}

	private formatTime(seconds: number): string {
		const mins = Math.floor(seconds / 60);
		const secs = Math.floor(seconds % 60);
		return `${mins}:${secs.toString().padStart(2, '0')}`;
	}

	// API publique
	public toggle() {
		if (this.audio.paused) {
			this.audio.play();
		} else {
			this.audio.pause();
		}
	}

	public pause() {
		this.audio.pause();
	}

	public seekTo(percentage: number) {
		if (this.audio.duration) {
			this.audio.currentTime = this.audio.duration * percentage;
		}
	}

	public setVolume(volume: number) {
		this.audio.volume = volume;
	}

	public getElement(): HTMLElement {
		return this.container;
	}

	public getSrc(): string {
		return this.src;
	}

	public getTitle(): string {
		return this.title;
	}

	public isPlaying(): boolean {
		return !this.audio.paused;
	}

	public getCurrentTime(): number {
		return this.audio.currentTime;
	}

	public getProgress(): number {
		const duration = this.audio.duration || 0;
		return duration > 0 ? this.audio.currentTime / duration : 0;
	}

	public getTimeDisplay(): string {
		const current = this.formatTime(this.audio.currentTime || 0);
		const total = this.formatTime(this.audio.duration || 0);
		return `${current} / ${total}`;
	}

	public destroy() {
		this.audio.pause();
		this.audio.src = '';
		this.container.remove();
	}
}

class EnhancedAudioSettingTab extends PluginSettingTab {
	plugin: EnhancedAudioPlayerPlugin;

	constructor(app: App, plugin: EnhancedAudioPlayerPlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		containerEl.createEl('h2', { text: 'Paramètres du Lecteur Audio Amélioré' });

		new Setting(containerEl)
			.setName('Volume par défaut')
			.setDesc('Volume de démarrage des lecteurs audio (0.0 - 1.0)')
			.addSlider(slider => slider
				.setLimits(0, 1, 0.1)
				.setValue(this.plugin.settings.volume)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.volume = value;
					this.plugin.setGlobalVolume(value);
				}));

		new Setting(containerEl)
			.setName('Lecture automatique')
			.setDesc('Démarrer automatiquement la lecture des nouveaux fichiers audio')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.autoplay)
				.onChange(async (value) => {
					this.plugin.settings.autoplay = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Persistance de la position')
			.setDesc('Sauvegarder et restaurer la position de lecture')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.persistPosition)
				.onChange(async (value) => {
					this.plugin.settings.persistPosition = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Afficher les formes d\'onde')
			.setDesc('Afficher une visualisation des formes d\'onde (bientôt disponible)')
			.addToggle(toggle => toggle
				.setValue(this.plugin.settings.showWaveform)
				.onChange(async (value) => {
					this.plugin.settings.showWaveform = value;
					await this.plugin.saveSettings();
				}));

		new Setting(containerEl)
			.setName('Vitesse de lecture par défaut')
			.setDesc('Vitesse de lecture par défaut pour les nouveaux fichiers')
			.addSlider(slider => slider
				.setLimits(0.5, 2.0, 0.25)
				.setValue(this.plugin.settings.playbackSpeed)
				.setDynamicTooltip()
				.onChange(async (value) => {
					this.plugin.settings.playbackSpeed = value;
					await this.plugin.saveSettings();
				}));
	}
}