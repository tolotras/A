# Guide d'Installation - Plugin Lecteur Audio Obsidian

## Prérequis
- Obsidian version 0.15.0 ou supérieure
- Node.js (pour le développement uniquement)

## Option 1: Installation pour Utilisation (Recommandée)

### Étapes :
1. **Créer le dossier du plugin** dans votre vault Obsidian :
   ```
   VotreVault/.obsidian/plugins/audio-player-plugin/
   ```

2. **Copier les fichiers** suivants dans ce dossier :
   - `manifest.json`
   - `main.js` (généré après le build)
   - Tous les autres fichiers du plugin

3. **Activer le plugin** :
   - Ouvrir Obsidian
   - Aller dans Paramètres → Plugins communautaires
   - Activer "Audio Player Plugin"

## Option 2: Installation pour Développement

### Étapes :
1. **Cloner ou télécharger** ce repository dans :
   ```
   VotreVault/.obsidian/plugins/audio-player-plugin/
   ```

2. **Installer les dépendances** :
   ```bash
   cd VotreVault/.obsidian/plugins/audio-player-plugin/
   npm install
   ```

3. **Builder le plugin** :
   ```bash
   # Pour le développement (rechargement automatique)
   npm run dev
   
   # OU pour la production
   npm run build
   ```

4. **Activer le plugin** dans Obsidian (Paramètres → Plugins communautaires)

## Vérification de l'installation

Après activation, vous devriez voir :
- Une nouvelle option "Audio Player Plugin" dans les paramètres des plugins
- Des nouvelles commandes dans la palette de commandes (Ctrl/Cmd + P) :
  - "Basculer le lecteur audio"
  - "Lecture/Pause"
  - "Charger un fichier audio"

## Utilisation rapide

1. **Ouvrir le lecteur** : Utilisez la commande "Basculer le lecteur audio"
2. **Charger un fichier** : Cliquez sur l'icône 📁 dans le lecteur
3. **Sélectionner un fichier audio** depuis votre vault
4. **Profiter** de la lecture en arrière-plan !

## Formats supportés
- MP3, WAV, OGG, M4A, FLAC, AAC

## Résolution des problèmes

### Le plugin n'apparaît pas
- Vérifiez que tous les fichiers sont dans le bon dossier
- Redémarrez Obsidian
- Vérifiez que la version d'Obsidian est >= 0.15.0

### Erreur de chargement
- Assurez-vous que `main.js` est présent (lancez `npm run build` si nécessaire)
- Vérifiez la console développeur (Ctrl+Shift+I) pour les erreurs

### Aucun fichier audio trouvé
- Assurez-vous d'avoir des fichiers audio (.mp3, .wav, etc.) dans votre vault
- Rafraîchissez le plugin en le désactivant/réactivant

## Support

Pour toute question ou problème, consultez le README.md ou créez une issue.
