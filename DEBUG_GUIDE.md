# 🔧 Guide de Debug - Plugin Lecteur Audio Amélioré

## 🎯 Problème: Le lecteur natif apparaît toujours

Si tu vois encore le lecteur natif d'Obsidian comme dans ton image, voici comment débugger :

## 🚀 Étapes de Test Détaillées

### Étape 1: Vérifier l'Installation
1. **Fichiers copiés :**
   - ✅ `manifest.json`
   - ✅ `main.js` 
   - ✅ `package.json`
   
2. **Plugin activé** dans les paramètres Obsidian

### Étape 2: Ouvrir la Console de Debug
1. **Appuyer sur `Ctrl+Shift+I`** (DevTools)
2. **Aller dans l'onglet Console**
3. **Garder ouvert pendant les tests**

### Étape 3: Test avec Log Debug
1. **Créer une nouvelle note**
2. **Ajouter un fichier audio** : `![[nom-du-fichier.mp3]]`
3. **Regarder la console** - tu devrais voir :
   ```
   Enhanced Audio Player Plugin chargé
   Remplacement du lecteur audio: [URL]
   Lecteur audio remplacé avec succès
   ```

### Étape 4: Utiliser la Commande de Force
1. **Appuyer sur `Ctrl+P`**
2. **Taper "force"** → choisir "Forcer le remplacement des lecteurs audio"
3. **Vérifier si ça marche**

### Étape 5: Vérifier les Éléments Audio
Dans la console, tape :
```javascript
// Voir tous les éléments audio
document.querySelectorAll('audio')

// Voir ceux qui sont marqués comme améliorés
document.querySelectorAll('audio[data-enhanced]')

// Voir les lecteurs personnalisés
document.querySelectorAll('.enhanced-audio-player')
```

## 🔍 Messages d'Erreur Possibles

### "Fichier audio non trouvé"
- **Cause :** Le fichier n'existe pas dans le vault
- **Solution :** Vérifier que le fichier est bien présent

### "Erreur lors du remplacement"
- **Cause :** Problème DOM ou timing
- **Solution :** Utiliser la commande "Forcer le remplacement"

### Aucun message dans la console
- **Cause :** Plugin pas chargé ou pas activé
- **Solution :** Redémarrer Obsidian et vérifier l'activation

## 🛠️ Solutions Possibles

### Solution 1: Redémarrage Complet
1. **Fermer Obsidian** complètement
2. **Rouvrir** et tester

### Solution 2: Forcer le Remplacement
1. **`Ctrl+P`** → "Forcer le remplacement des lecteurs audio"
2. **Attendre** la notification "Lecteurs audio forcés à se remplacer"

### Solution 3: Réinstallation Clean
1. **Désactiver** le plugin
2. **Supprimer** le dossier `audio-player-plugin`
3. **Recréer** et copier les fichiers
4. **Réactiver** le plugin

### Solution 4: Test avec un Nouveau Fichier
1. **Glisser un nouveau fichier .mp3** dans le vault
2. **Créer une nouvelle note**
3. **Intégrer** : `![[nouveau-fichier.mp3]]`

## 🎯 Test Spécifique pour ton Cas

Vu que tu as un fichier `NWn_B1_KB_Audio_1-001.mp3`, teste ceci :

1. **Créer une nouvelle note**
2. **Écrire exactement** : `![[NWn_B1_KB_Audio_1-001.mp3]]`
3. **Regarder la console** pour les messages de debug
4. **Si ça ne marche pas**, utiliser `Ctrl+P` → "Forcer le remplacement"

## 📋 Checklist de Vérification

- [ ] Plugin activé dans les paramètres
- [ ] Console DevTools ouverte
- [ ] Message "Enhanced Audio Player Plugin chargé" visible
- [ ] Fichier audio existe dans le vault
- [ ] Test avec nouvelle note créée
- [ ] Commande "Forcer le remplacement" testée

## 🎮 Si Tout Échoue

Si rien ne fonctionne, le problème pourrait être :

1. **Version d'Obsidian** incompatible (il faut >= 0.15.0)
2. **Conflit avec autre plugin** audio
3. **Fichier `main.js`** corrompu lors de la copie

**Solution ultime :** Recopier un nouveau `main.js` fraîchement compilé.

---

**💡 Astuce :** Garde la console DevTools ouverte pendant tous les tests pour voir exactement ce qui se passe !
