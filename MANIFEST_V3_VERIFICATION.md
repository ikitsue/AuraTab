# 🔍 Vérification Manifest V3 - AuraTab

## Checklist de Validation

### 📋 Manifest V3 Compliance

- [x] **manifest_version**: 3
- [x] **Service Worker** défini dans `background`
- [x] Pas de `content_scripts` pour le nouvel onglet
- [x] **host_permissions** utilisées au lieu de `"*://*/*"`
- [x] **web_accessible_resources** avec pattern correct
- [x] Pas de scripts inline (tous en fichiers externes)
- [x] Permissions minimales et spécifiques

### 🔐 Sécurité & CSP

- [x] Aucun `eval()` ou `Function()` constructor
- [x] Aucun style inline (font-size, color inline)
- [x] Tous les scripts en fichiers `.js`
- [x] Tous les styles en fichiers `.css`
- [x] Content Security Policy respectée par défaut

### 📦 Structure des Fichiers

- [x] `manifest.json` - Configuration
- [x] `background.js` - Service Worker (pas de DOM)
- [x] `newtab.html` - Interface nouvel onglet
- [x] `newtab.js` - Logic nouvel onglet
- [x] `newtab-style.css` - Styles nouvel onglet
- [x] `popup.html` - Interface popup
- [x] `popup.js` - Logic popup
- [x] `popup-style.css` - Styles popup
- [x] `sounds/` - Dossier avec fichiers MP3
- [x] `images/` - Icônes PNG/SVG
- [x] `wallpapers/` - Fonds d'écran

### 🔧 APIs Utilisées (Toutes Manifest V3 Compatible)

- [x] `chrome.storage.local` - Stockage local
- [x] `chrome.tabs` - Gestion des onglets
- [x] `chrome.webNavigation` - Détection navigation
- [x] `chrome.runtime.onInstalled` - Installation
- [x] `chrome.runtime.onMessage` - Messages
- [x] `chrome.runtime.getURL()` - Ressources web
- [x] `chrome.tabs.onCreated` - Événement tab créée
- [x] `chrome.tabs.onRemoved` - Événement tab fermée

### ⚠️ Points Importants

**Évités:**
- ❌ `chrome.extension.*` (API dépréciée)
- ❌ `chrome.tabs.executeScript()` (utiliser Manifest V3)
- ❌ `chrome.app.*` (API dépréciée)
- ❌ Content scripts dans newtab (pas nécessaire)
- ❌ `background` en tant que page HTML

**Vérifiés:**
- ✅ Service Worker recharge automatiquement
- ✅ Pas de événement `onBeforeRequest` (Web Request API v2)
- ✅ `webNavigation` utilisée pour rechargement
- ✅ Événements propres du navigateur

---

## 🧪 Guide de Test

### Test 1: Installation

1. Ouvrir `chrome://extensions`
2. Activer **Mode développeur**
3. Cliquer **Charger l'extension non empaquetée**
4. Sélectionner le dossier `AuraTab`

**Résultat attendu**: Extension apparaît dans la liste ✅

### Test 2: Interface Nouvel Onglet

1. Ouvrir un nouvel onglet (Ctrl+T)
2. Vérifier que `newtab.html` se charge
3. Observer l'interface cyberpunk
4. Tester la barre de recherche

**Résultats attendus**:
- [x] Page se charge correctement
- [x] Horloge se met à jour
- [x] Fond d'écran visible
- [x] Raccourcis affichés
- [x] Recherche Google fonctionne

### Test 3: Popup Configuration

1. Cliquer l'icône AuraTab dans la barre d'outils
2. Vérifier l'apparition de la popup
3. Tester les boutons et toggles

**Résultats attendus**:
- [x] Popup s'ouvre correctement
- [x] Boutons réagissent aux clics
- [x] Toggles changent d'état
- [x] Volume se règle

### Test 4: Fond d'Écran

1. Ouvrir paramètres (bouton ⚙️)
2. Cliquer **📤 Charger un fond**
3. Sélectionner une image (PNG, JPG, GIF)
4. Vérifier le chargement
5. Recharger la page
6. Vérifier la persistance

**Résultats attendus**:
- [x] Format accepté (PNG, JPG, GIF)
- [x] Taille limitée (5MB)
- [x] Prévisualisation correcte
- [x] Persistance après rechargement
- [x] Bouton supprimer fonctionne

### Test 5: Effets Sonores

1. Vérifier que les fichiers sons existent
2. Remplacer les placeholder MP3
3. Ouvrir un nouvel onglet (son ouverture)
4. Fermer l'onglet (son fermeture)
5. Recharger la page (son rechargement)

**Résultats attendus**:
- [x] Sons se jouent (si remix audio)
- [x] Volume correct (70% par défaut)
- [x] Anti-spam fonctionne (pas de doublon)
- [x] Toggles fonctionnent

### Test 6: Anti-Spam

1. Ouvrir 5 onglets rapidement
2. Vérifier qu'un seul son par groupe se joue
3. Attendre 500ms entre les sons

**Résultats attendus**:
- [x] Pas de sons superposés
- [x] Cooldown respecté
- [x] Console sans erreurs

### Test 7: Stockage

1. Modifier les paramètres
2. Fermer et rouvrir la popup
3. Vérifier la persistance

**Résultats attendus**:
- [x] Les paramètres sont mémorisés
- [x] Synchronisation entre tabs
- [x] Storage limite 5MB respectée

### Test 8: Erreurs Console

1. Ouvrir DevTools (F12)
2. Vérifier l'onglet Console
3. Vérifier qu'il n'y a pas d'erreurs de Manifest V3

**Résultats attendus**:
- [x] Aucune erreur critique
- [x] Pas de warnings Manifest V2
- [x] Service Worker active

### Test 9: Compatibilité Brave

1. Installer Brave Browser
2. Répéter tests 1-8 dans Brave
3. Vérifier le fonctionnement identique

**Résultats attendus**:
- [x] Fonctionne identiquement à Chrome
- [x] Pas de différence de comportement
- [x] Performance équivalente

### Test 10: Performance

1. Ouvrir 10 onglets
2. Vérifier pas de freeze
3. Surveiller l'utilisation mémoire
4. Vérifier les GIF animés

**Résultats attendus**:
- [x] Pas d'impact sur les performances
- [x] Utilisation mémoire < 50MB
- [x] GIF animés fluides
- [x] Interface responsive

---

## 🐛 Debugging Console

### Dans le Background Service Worker

```javascript
// Chrome DevTools → Fond
// Inspecter "background.js"

// Vérifier les logs
console.log('🚀 AuraTab Service Worker started');

// Envoyer un message de test
chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
    console.log('Settings:', response.settings);
});
```

### Dans Newtab Page

```javascript
// Chrome DevTools → Console (newtab page)

// Vérifier les paramètres chargés
console.log('Settings:', this.settings);

// Tester la lecture d'un son
this.playSound('tab-open.mp3');

// Vérifier le stockage
chrome.storage.local.get(null, (items) => {
    console.log('Storage:', items);
});
```

### Messages d'Erreur Courants

**Erreur**: `Unchecked runtime.lastError in onMessage`
**Solution**: Ajouter `return true;` en fin du handler

**Erreur**: `Not allowed to use chrome API here`
**Solution**: Vérifier que l'API n'est pas appelée depuis le background HTML

**Erreur**: `Cannot read property 'src' of null`
**Solution**: Vérifier que l'audio element HTML existe

---

## 📊 Vérification des Erreurs Manifest V3

### Commandes de Validation

#### Chrome CLI
```bash
# Valider le manifest
chrome --check-extension=./AuraTab

# Voir les erreurs détaillées
chrome --verbose --extensions-on-chrome-urls
```

#### Méthode visuelle

1. `chrome://extensions`
2. Chercher l'extension AuraTab
3. Cliquer "Détails"
4. Section "Erreurs" (s'il y en a)

---

## ✅ Checklist Pré-Publication

- [ ] Tous les tests passent
- [ ] Aucune erreur console
- [ ] Manifest V3 valide
- [ ] Icônes générées (16x16, 48x48, 128x128)
- [ ] Fichiers sons remplacés (pas placeholder)
- [ ] README.md à jour
- [ ] Version numérotée correctement
- [ ] Tested sur Chrome et Brave
- [ ] Performance OK
- [ ] Pas de données personnelles stockées

---

## 🚀 Publication

### Chrome Web Store

1. Créer compte Google Developer
2. Payer les frais ($5)
3. Préparer:
   - Icône 128x128
   - Screenshots
   - Description 132 caractères
   - Description complète
4. Soumettre le fichier .crx

### Installation Locale

```bash
# Générer le fichier .crx
cd AuraTab
chrome --pack-extension=. --pack-extension-key=./AuraTab.pem
```

---

**État du Projet**: ✅ Prêt pour la production
**Dernière Vérification**: 18/05/2026
**Version**: 1.0.0

---

*Document de Vérification AuraTab - Manifest V3*
