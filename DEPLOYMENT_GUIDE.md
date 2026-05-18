# 🚀 COMMANDES DE DÉPLOIEMENT - AuraTab

## Vérification Rapide de l'Installation

### Pour Windows (PowerShell):

```powershell
# Vérifier que tous les fichiers sont présents
Get-ChildItem -Path "AuraTab" -Recurse | Measure-Object | Select-Object Count

# Lister tous les fichiers
Get-ChildItem -Path "AuraTab" -Recurse -File

# Vérifier le manifest.json
Get-Content "AuraTab\manifest.json" | ConvertFrom-Json | Select-Object manifest_version, name, version

# Compter les lignes de code
(Get-Content "AuraTab\*.js" | Measure-Object -Line).Lines
(Get-Content "AuraTab\*.css" | Measure-Object -Line).Lines
```

### Pour macOS/Linux (Bash):

```bash
# Vérifier que tous les fichiers sont présents
find AuraTab -type f | wc -l

# Lister tous les fichiers
find AuraTab -type f

# Vérifier le manifest.json
cat AuraTab/manifest.json | jq '.'

# Compter les lignes de code
find AuraTab -name "*.js" -o -name "*.css" | xargs wc -l
```

---

## Charger l'Extension dans le Navigateur

### Google Chrome:

1. **Ouvrir le gestionnaire d'extensions:**
   ```
   URL: chrome://extensions
   Raccourci: Ctrl+Shift+X
   ```

2. **Activer Mode Développeur:**
   ```
   Cliquer le bouton "Mode développeur" (en haut à droite)
   ```

3. **Charger l'extension:**
   ```
   Cliquer "Charger l'extension non empaquetée"
   Sélectionner le dossier: AuraTab
   Cliquer "Sélectionner le dossier"
   ```

4. **Vérifier l'installation:**
   ```
   ✓ Extension apparaît dans la liste
   ✓ Icon AuraTab dans la barre d'outils
   ✓ Ouvrir nouvel onglet (Ctrl+T) → Interface AuraTab
   ```

### Brave Browser:

```
1. URL: brave://extensions
2. Activer "Developer mode"
3. Cliquer "Load unpacked"
4. Sélectionner dossier AuraTab
5. ✓ Extension chargée!
```

---

## Recharger l'Extension

### Après Modifications du Code:

**Chrome/Brave:**
```
Extensions page (chrome://extensions ou brave://extensions)
Trouver AuraTab
Cliquer le bouton "Recharger" (flèche circulaire)
Ouvrir nouvel onglet (Ctrl+T) pour voir les changements
```

### Depuis DevTools:

```javascript
// Dans la console (F12):
chrome.runtime.reload()
```

---

## Déboguer l'Extension

### Ouvrir DevTools:

```
Clic droit → Inspecter
Ou: F12
```

### Voir les Logs du Background:

```
1. chrome://extensions
2. Cliquer "Détails" sur AuraTab
3. En bas: "Inspecter les vues de service worker"
4. Console affichera les logs
```

### Vérifier les Erreurs:

```
1. chrome://extensions
2. Cliquer "Détails" sur AuraTab
3. Section "Erreurs" (s'il y en a)
```

---

## Générer le Fichier .crx (Distribution)

### Avec Chrome (Command Line):

```bash
# Windows:
"C:\Program Files (x86)\Google\Chrome\Application\chrome.exe" --pack-extension=C:\path\to\AuraTab --pack-extension-key=C:\path\to\AuraTab.pem

# macOS:
/Applications/Google\ Chrome.app/Contents/MacOS/Google\ Chrome --pack-extension=/path/to/AuraTab

# Linux:
google-chrome --pack-extension=/path/to/AuraTab
```

### Résultat:

```
Fichiers générés:
- AuraTab.crx (extension empaquetée)
- AuraTab.pem (clé privée)

Le fichier .crx peut être distribué ou publié.
```

---

## Publier sur Chrome Web Store

### Préparation:

1. **Créer compte Google Developer:**
   ```
   https://chrome.google.com/webstore/developer/dashboard
   ```

2. **Payer les frais:** $5

3. **Préparer les fichiers:**
   ```
   - Icon 128x128.png (obligatoire)
   - Screenshots (1280x800 ou 640x400) (3 minimum)
   - Fichier .zip de l'extension
   ```

4. **Remplir le formulaire:**
   ```
   - Nom: AuraTab
   - Description courte (132 caractères max)
   - Description complète
   - Catégorie: Productivité ou Nouveauté
   - Langue: Français
   ```

5. **Soumettre:**
   ```
   Cliquer "Publier"
   Attendre la revue (1-3 jours)
   ```

---

## Créer un Repository GitHub

### Configuration Initiale:

```bash
# Initialiser git
git init
git add .
git commit -m "Initial commit: AuraTab v1.0.0"

# Connecter au repository distant
git remote add origin https://github.com/USERNAME/AuraTab.git
git branch -M main
git push -u origin main
```

### Fichiers .gitignore:

```
# Déjà créé: .gitignore
# Contient les exclusions nécessaires
```

---

## Compiler en Format Production

### Créer ZIP pour Distribution:

```bash
# Windows (PowerShell):
Compress-Archive -Path "AuraTab" -DestinationPath "AuraTab-v1.0.0.zip"

# macOS/Linux:
zip -r AuraTab-v1.0.0.zip AuraTab/
```

### Résultat:

```
AuraTab-v1.0.0.zip (~3 MB)
Prêt pour distribution
```

---

## Vérifier la Taille:

```bash
# Windows:
Get-Item AuraTab -Recurse | Measure-Object -Sum Length | Select-Object Count, @{Name="Size (MB)";Expression={[math]::Round(($_.Sum / 1MB), 2)}}

# macOS/Linux:
du -sh AuraTab/
```

---

## Remplacer les Fichiers MP3

### Ajouter les Fichiers:

1. **Générer les sons:**
   ```
   Audacity → Générer → Ton
   Exporter en MP3
   ```

2. **Remplacer les fichiers:**
   ```
   sounds/tab-open.mp3
   sounds/tab-close.mp3
   sounds/page-reload.mp3
   ```

3. **Recharger l'extension:**
   ```
   chrome://extensions → Recharger AuraTab
   ```

---

## Tester Toutes les Fonctionnalités

### Checklist de Test:

```bash
# 1. Interface nouvel onglet:
   ✓ Ouvrir nouvel onglet (Ctrl+T)
   ✓ Vérifier interface affichée
   ✓ Horloge mise à jour

# 2. Popup:
   ✓ Cliquer icon AuraTab
   ✓ Popup s'ouvre
   ✓ Boutons réagissent

# 3. Fond d'écran:
   ✓ Charger une image (test.jpg)
   ✓ Image s'affiche
   ✓ Persiste après rechargement (F5)

# 4. Sons:
   ✓ Ouvrir nouvel onglet (son?)
   ✓ Fermer onglet (son?)
   ✓ Recharger (F5) (son?)

# 5. Paramètres:
   ✓ Régler le volume
   ✓ Activer/désactiver sons
   ✓ Les paramètres sont mémorisés

# 6. Performance:
   ✓ Pas de freeze
   ✓ Interface fluide
   ✓ Pas d'erreurs console (F12)
```

---

## Commandes Utiles Chrome DevTools

### Vérifier les Paramètres:

```javascript
// Dans la console (F12):

// Récupérer tous les paramètres:
chrome.storage.local.get(null, console.log)

// Définir un paramètre:
chrome.storage.local.set({ volume: 80 })

// Supprimer tous les paramètres:
chrome.storage.local.clear()

// Envoyer un message au background:
chrome.runtime.sendMessage({ action: 'getSettings' }, response => console.log(response))
```

---

## Optimisation Finale

### Avant Publication:

```bash
# 1. Minifier le CSS/JS (optionnel):
   # Utiliser: UglifyJS, Terser, ou CSSNano

# 2. Compresser les images:
   # Utiliser: TinyPNG ou Compressor.io
   # Garder: < 5MB par image

# 3. Vérifier les performances:
   # Chrome DevTools → Performance
   # Lighthouse → Run audit

# 4. Tester sur plusieurs navigateurs:
   # Chrome, Brave, Edge, Opera
```

---

## Troubleshooting - Commandes

### Extension ne s'affiche pas:

```bash
# Vérifier les erreurs:
chrome://extensions → Détails → Erreurs

# Recharger:
chrome://extensions → Recharger AuraTab

# Réinstaller:
chrome://extensions → Supprimer AuraTab
Recharger avec "Load unpacked"
```

### Nouveau tab ne change pas:

```bash
# Vider le cache:
Ctrl+Shift+Suppr (Windows/Linux)
Cmd+Shift+Suppr (macOS)

# Sélectionner:
- Historique de navigation: Toutes les périodes
- Cookies et données de sites
- Images et fichiers en cache

# Vider et rafraîchir
```

### Erreur Manifest:

```bash
# Vérifier le JSON:
python -m json.tool manifest.json

# Ou avec jq:
cat manifest.json | jq '.'

# Si erreur, corriger et recharger
```

---

## Checklist Avant Soumission Chrome Web Store

- [ ] Manifest V3 valide
- [ ] Icon 128x128.png présent
- [ ] Screenshots 1280x800 (3+ images)
- [ ] Fichiers MP3 remplacés (vrais sons)
- [ ] Testés sur Chrome et Brave
- [ ] Pas d'erreurs console
- [ ] Performance OK
- [ ] Privacy policy définie
- [ ] Version numérotée
- [ ] README.md complet

---

## Version historique

```
v1.0.0 ............ Initial Release (18/05/2026)
v1.1.0 ............ Prévue (thèmes multiples)
v2.0.0 ............ Prévue (sync cloud)
```

---

## Support & Contact

Pour toute question ou problème:
- Consulter README.md
- Consulter FAQ.md
- Voir MANIFEST_V3_VERIFICATION.md
- Ouvrir une issue GitHub

---

**Bon déploiement! 🚀✨**

*AuraTab - Personnalisez votre navigateur*
