# Plugin Lecteur Audio Amélioré pour Obsidian

Un plugin Obsidian qui **remplace complètement le lecteur audio intégré** par un lecteur amélioré avec lecture en arrière-plan et contrôles avancés.

## 🎯 Fonctionnement

Ce plugin intercepte automatiquement **tous les fichiers audio intégrés** dans vos notes (avec `![[fichier.mp3]]`) et les remplace par un lecteur personnalisé plus puissant.

## Fonctionnalités

### 🎵 Remplacement du Lecteur Natif
- **Interception automatique** : Remplace tous les lecteurs audio d'Obsidian
- **Lecture en arrière-plan** : Continue de jouer même lors du défilement
- **Contrôles globaux** : Barre de contrôle flottante pour gérer l'audio actuel
- **Interface améliorée** : Design moderne intégré dans vos notes
- **Persistance** : Sauvegarde automatique de la position et de l'état de lecture

### 📱 Compatible Mobile et Desktop
- **Design responsive** : S'adapte automatiquement aux écrans mobiles
- **Interface tactile** : Optimisée pour les interactions tactiles
- **Performance** : Optimisé pour fonctionner sur tous les appareils

### 🎛️ Fonctionnalités Avancées
- **Formats supportés** : MP3, WAV, OGG, M4A, FLAC, AAC
- **Contrôle de vitesse** : Lecture à différentes vitesses (0.5x à 2x)
- **Barre de contrôle globale** : Contrôles flottants en bas de l'écran
- **Paramètres personnalisables** : Volume par défaut, lecture automatique, persistance
- **Commandes clavier** : Raccourcis pour toutes les actions principales
- **Interface intégrée** : Se fond parfaitement dans le design d'Obsidian

## Installation

### Installation Manuelle
1. Téléchargez les fichiers du plugin
2. Créez un dossier `audio-player-plugin` dans `.obsidian/plugins/`
3. Copiez tous les fichiers dans ce dossier
4. Activez le plugin dans les paramètres d'Obsidian

### Développement
```bash
# Cloner et installer les dépendances
npm install

# Mode développement (rechargement automatique)
npm run dev

# Build de production
npm run build
```

## Utilisation

### Fonctionnement Automatique
1. **Intégrez un fichier audio** dans une note : `![[mon-audio.mp3]]`
2. **Le lecteur améliorer apparaît** automatiquement à la place du lecteur natif
3. **Profitez des contrôles avancés** et de la lecture en arrière-plan !

### Contrôles dans chaque lecteur
- **▶/⏸** : Lecture/Pause
- **1x** : Contrôle de vitesse (0.5x à 2x)
- **Barre de progression** : Cliquez pour naviguer dans l'audio

### Contrôles globaux (barre flottante)
- **▶/⏸** : Lecture/Pause de l'audio actuel
- **⏮/⏭** : Navigation entre les pistes
- **🔊** : Contrôle du volume global
- **×** : Fermer les contrôles globaux
- **🔊** : Contrôle du volume avec slider
- **Barre de progression** : Cliquez pour naviguer dans la piste
- **−** : Minimiser le lecteur
- **×** : Fermer le lecteur

### Commandes de palette
- `Basculer les contrôles globaux` : Affiche/masque la barre de contrôle
- `Lecture/Pause audio actuel` : Contrôle l'audio en cours de lecture

### Intégration Transparente
Le plugin fonctionne automatiquement. Dès que vous ajoutez `![[fichier.mp3]]` dans une note, le lecteur amélioré remplace instantanément le lecteur natif d'Obsidian.

## Paramètres

Accédez aux paramètres via : Paramètres → Options du plugin → Audio Player Plugin

- **Volume par défaut** : Volume de démarrage (0.0 - 1.0)
- **Lecture automatique** : Démarre automatiquement après chargement
- **Persistance de la position** : Sauvegarde la position de lecture

## Compatibilité

- **Obsidian** : Version 0.15.0 ou supérieure
- **Plateformes** : Desktop (Windows, macOS, Linux) et Mobile (iOS, Android)
- **Formats audio** : MP3, WAV, OGG, M4A, FLAC, AAC

## Fonctionnalités à venir

- [ ] Support des playlists
- [ ] Navigation précédent/suivant dans les dossiers
- [ ] Visualiseur audio
- [ ] Égaliseur
- [ ] Mode répétition et aléatoire
- [ ] Raccourcis clavier globaux

## Support

Pour signaler des bugs ou demander des fonctionnalités, créez une issue sur le repository GitHub.

## Licence

MIT License - voir le fichier LICENSE pour plus de détails.

---

**Note** : Ce plugin est conçu pour offrir une expérience audio fluide dans Obsidian tout en préservant les performances de l'application.
