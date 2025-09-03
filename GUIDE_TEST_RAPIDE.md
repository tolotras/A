# 🎵 Guide de Test Rapide - Lecteur Audio Amélioré

## ✅ Installation Express

1. **Copier ces 3 fichiers** dans `.obsidian/plugins/audio-player-plugin/` :
   - ✅ `manifest.json`
   - ✅ `main.js` 
   - ✅ `package.json`

2. **Redémarrer Obsidian** et **activer le plugin** dans les paramètres

## 🎯 Test du Remplacement du Lecteur Natif

### Étape 1: Ajouter un fichier audio à votre vault
- Glissez un fichier `.mp3`, `.wav`, ou `.ogg` dans votre vault Obsidian

### Étape 2: Intégrer l'audio dans une note
1. **Créer ou ouvrir une note**
2. **Taper** : `![[nom-de-votre-fichier.mp3]]`
3. **Appuyer sur Entrée**

### Étape 3: Vérifier le remplacement
🎉 **Au lieu du lecteur natif d'Obsidian**, vous devriez voir :
- Un lecteur avec **design amélioré**
- **Bouton de vitesse** (1x, 1.5x, 2x, etc.)
- **Barre de progression cliquable**
- **Affichage du temps** amélioré

### Étape 4: Tester la lecture en arrière-plan
1. **Cliquer sur Play** ▶
2. **Faire défiler la note** vers le bas
3. **L'audio continue de jouer** ! 🎶

### Étape 5: Tester les contrôles globaux
1. **Appuyer sur `Ctrl+P`**
2. **Taper "glob"** → choisir "Basculer les contrôles globaux"
3. **Une barre de contrôle apparaît** en bas de l'écran

## 🔧 Fonctionnalités à Tester

### Dans le lecteur intégré :
- ✅ **Play/Pause** ▶/⏸
- ✅ **Vitesse de lecture** (cliquer sur "1x")
- ✅ **Navigation** (cliquer sur la barre de progression)
- ✅ **Affichage du temps** en temps réel

### Dans la barre de contrôle globale :
- ✅ **Contrôle de l'audio actuel** 
- ✅ **Volume global** 🔊
- ✅ **Navigation dans la piste**
- ✅ **Fermeture** ×

## 🎮 Scénarios de Test

### Test 1: Multiple Audio Files
1. **Ajouter plusieurs fichiers audio** dans la même note :
   ```
   ![[audio1.mp3]]
   
   Du texte entre les deux...
   
   ![[audio2.mp3]]
   ```
2. **Tous les lecteurs** devraient être remplacés
3. **Un seul peut jouer** à la fois

### Test 2: Navigation Entre Notes
1. **Démarrer l'audio** dans une note
2. **Changer de note**
3. **L'audio continue** en arrière-plan
4. **Les contrôles globaux** restent accessibles

### Test 3: Compatibilité Mobile
- **Ouvrir sur mobile** Obsidian
- **Les contrôles s'adaptent** à l'écran tactile
- **Interface responsive** fonctionne correctement

## ❌ Résolution des Problèmes

### "Le lecteur natif apparaît encore"
- Vérifiez que le plugin est **bien activé**
- **Redémarrez Obsidian** complètement
- Vérifiez les **erreurs** dans la console (Ctrl+Shift+I)

### "Aucun contrôle global"
- Utilisez `Ctrl+P` → "Basculer les contrôles globaux"
- Vérifiez que **l'audio est en cours** de lecture

### "Audio ne se charge pas"
- Vérifiez que le **format est supporté** (MP3, WAV, OGG, M4A, FLAC, AAC)
- Vérifiez le **nom du fichier** dans l'intégration

## 🎯 Résultat Attendu

Après installation, **tous vos fichiers audio intégrés** (`![[audio.mp3]]`) devraient automatiquement utiliser le **lecteur amélioré** au lieu du lecteur HTML5 natif d'Obsidian.

🎉 **Pas de configuration nécessaire - tout est automatique !**
