# 🎵 Installation Simple du Plugin Audio Player

## ✅ Étape 1: Localiser votre dossier Obsidian

1. **Ouvrir Obsidian**
2. **Aller dans Paramètres** (icône engrenage)
3. **Cliquer sur "Fichiers et liens"**
4. **Noter le chemin de votre vault** (ex: `C:\Users\VotreNom\Documents\MonVault`)

## ✅ Étape 2: Créer le dossier du plugin

1. **Naviguer vers votre vault** dans l'explorateur Windows
2. **Aller dans le dossier** `.obsidian\plugins\` 
   - Si le dossier `plugins` n'existe pas, créez-le
3. **Créer un nouveau dossier** nommé `audio-player-plugin`
4. **Le chemin final devrait être :** 
   ```
   VotreVault\.obsidian\plugins\audio-player-plugin\
   ```

## ✅ Étape 3: Copier les fichiers du plugin

**Copier ces 3 fichiers OBLIGATOIRES** dans le dossier `audio-player-plugin` :
- ✅ `manifest.json`
- ✅ `main.js` 
- ✅ `package.json`

## ✅ Étape 4: Activer le plugin dans Obsidian

1. **Redémarrer Obsidian** complètement
2. **Aller dans Paramètres → Plugins communautaires**
3. **Désactiver le mode sécurisé** si nécessaire
4. **Trouver "Audio Player Plugin"** dans la liste
5. **Activer le plugin** (basculer vers ON)

## ✅ Étape 5: Test du plugin

1. **Appuyer sur `Ctrl+P`** (palette de commandes)
2. **Taper "audio"** et choisir "Basculer le lecteur audio"
3. **Le lecteur devrait apparaître** en haut à droite
4. **Cliquer sur l'icône 📁** pour charger un fichier audio

## 🎯 Formats Audio Supportés
- MP3, WAV, OGG, M4A, FLAC, AAC

## 🔧 Résolution des Problèmes

### ❌ "Le plugin ne s'affiche pas"
- Vérifiez que les 3 fichiers sont dans le bon dossier
- Redémarrez Obsidian complètement
- Vérifiez que vous avez bien activé les plugins communautaires

### ❌ "Échec de chargement"
- Vérifiez que le fichier `main.js` est présent
- Vérifiez que tous les fichiers sont au bon endroit
- Regardez la console développeur (Ctrl+Shift+I) pour les erreurs

### ❌ "Aucun fichier audio trouvé"
- Assurez-vous d'avoir des fichiers audio dans votre vault
- Formats supportés : .mp3, .wav, .ogg, .m4a, .flac, .aac

## 🎮 Utilisation

- **📁** : Charger un fichier audio
- **▶/⏸** : Lecture/Pause  
- **🔊** : Contrôle du volume
- **Barre de progression** : Cliquer pour naviguer
- **Déplacer** : Cliquer-glisser sur la barre de titre
- **−** : Minimiser | **×** : Fermer

---

**✨ Le lecteur fonctionne en arrière-plan même quand vous scrollez !**
