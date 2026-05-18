# 🌟 AuraTab - Extension Chromium

> Une extension moderne pour personnaliser votre navigateur avec des fonds d'écran dynamiques et des effets sonores immersifs.

![Version](https://img.shields.io/badge/Version-1.0.0-00d9ff)
![Manifest](https://img.shields.io/badge/Manifest-V3-success)
![License](https://img.shields.io/badge/License-MIT-blue)

## 📋 Table des matières

1. [Caractéristiques](#-caractéristiques)
2. [Prérequis](#-prérequis)
3. [Installation](#-installation)
4. [Utilisation](#-utilisation)
5. [Configuration](#-configuration)
6. [Architecture du projet](#-architecture-du-projet)
7. [Développement](#-développement)
8. [Troubleshooting](#-troubleshooting)

---

## ✨ Caractéristiques

### 🎨 Personnalisation du Nouvel Onglet
- Remplacement complet de la page "New Tab" par défaut
- Upload de fonds d'écran (PNG, JPG, GIF animé)
- Sauvegarde automatique avec `chrome.storage.local`
- Interface moderne sombre et fluide
- Boutons pour changer/supprimer le fond

### 🔊 Effets Sonores du Navigateur
- Son d'ouverture d'onglet
- Son de fermeture d'onglet
- Son de rechargement de page
- Système anti-spam intégré (cooldown 500ms)
- Contrôle du volume individualisé
- Activation/Désactivation de chaque son
- **🆕 Sons personnalisés** : Téléchargez vos propres sons (MP3, WAV, OGG, M4A)
- **🆕 Test des sons** : Écoutez tous vos sons d'un clic

### 🎛️ Contrôles Avancés
- Interface de configuration rapide (popup)
- Paramètres complets dans le nouvel onglet
- Synchronisation entre tous les onglets
- Horloge et affichage de la date
- Raccourcis rapides personnalisables
- Thème cyberpunk/gaming moderne

---

## 🛠️ Prérequis

- **Navigateur**: Google Chrome 88+ ou Brave (compatible Manifest V3)
- **Système d'exploitation**: Windows 10+, macOS 10.15+, Linux
- **Droits administrateur**: Non requis

---

## 📥 Installation

### Méthode 1 : Installation en Mode Développement (Recommandée)

1. **Télécharger le projet**
   ```bash
   git clone <repository-url>
   cd AuraTab
   ```

2. **Ouvrir le gestionnaire d'extensions**
   - **Chrome**: `chrome://extensions`
   - **Brave**: `brave://extensions`

3. **Activer le Mode Développeur**
   - Cliquez sur le bouton **"Mode développeur"** en haut à droite

4. **Charger l'extension**
   - Cliquez sur **"Charger l'extension non empaquetée"**
   - Sélectionnez le dossier `AuraTab`

5. **Vérification**
   - L'extension devrait apparaître dans la liste
   - Cliquez sur l'icône AuraTab dans la barre d'outils

### Méthode 2 : Installation depuis le fichier .crx (Distribution)

```bash
# Générer le fichier .crx
chrome --pack-extension=./AuraTab --pack-extension-key=AuraTab.pem
```

---

## 🎯 Utilisation

### Accéder au Nouvel Onglet Personnalisé

1. Ouvrir un nouvel onglet (Ctrl+T ou Cmd+T)
2. La page AuraTab s'affiche automatiquement
3. Rechercher avec la barre de recherche intégrée

### Gérer les Paramètres

#### Depuis le Nouvel Onglet
1. Cliquez sur le bouton **⚙️ (Paramètres)** en bas à droite
2. Configurez:
   - 🎨 Fond d'écran
   - 🔊 Effets sonores
   - 📊 Affichage

#### Depuis la Popup
1. Cliquez sur l'icône AuraTab dans la barre d'outils
2. Accès rapide aux paramètres et contrôles

### Charger un Fond d'Écran

1. Ouvrez les paramètres (⚙️)
2. Section **🎨 Fond d'écran**
3. Cliquez **📤 Charger un fond**
4. Sélectionnez: PNG, JPG, ou GIF animé (max 5MB)
5. Le fond est sauvegardé automatiquement

### Gérer les Sons

#### Activation/Désactivation
- Bouton 🔊 dans la popup: activer/désactiver tous les sons
- Chaque son peut être géré individuellement

#### Ajuster le Volume
- Curseur de volume dans les paramètres
- Plage: 0-100%
- Paramètre mémorisé

---

## ⚙️ Configuration

### Fichier: `manifest.json`

```json
{
  "manifest_version": 3,
  "name": "AuraTab",
  "version": "1.0.0",
  "permissions": ["storage", "tabs", "webNavigation"],
  "chrome_url_overrides": {
    "newtab": "newtab.html"
  }
}
```

### Variables Environnement

Les paramètres sont stockés dans `chrome.storage.local`:

```javascript
{
  "volume": 70,              // 0-100
  "soundEnabled": true,      // bool
  "soundTabOpen": true,      // bool
  "soundTabClose": true,     // bool
  "soundPageReload": true,   // bool
  "showShortcuts": true,     // bool
  "showWeather": true,       // bool
  "showTime": true,          // bool
  "wallpaper": null          // Data URL ou null
}
```

---

## 📁 Architecture du Projet

```
AuraTab/
├── manifest.json              # Configuration Manifest V3
├── background.js              # Service Worker
├── newtab.html               # Interface nouvel onglet
├── newtab.js                 # Logic nouvel onglet
├── newtab-style.css          # Styles nouvel onglet
├── popup.html                # Interface popup
├── popup.js                  # Logic popup
├── popup-style.css           # Styles popup
├── sounds/
│   ├── tab-open.mp3         # Son ouverture onglet
│   ├── tab-close.mp3        # Son fermeture onglet
│   └── page-reload.mp3      # Son rechargement
├── images/
│   ├── icon-16.png          # Icône 16x16
│   ├── icon-48.png          # Icône 48x48
│   └── icon-128.png         # Icône 128x128
├── wallpapers/
│   └── default-wallpaper.svg # Fond par défaut
└── README.md                 # Cette documentation
```

---

## 👨‍💻 Développement

### Environnement Local

```bash
# Installation des dépendances (optionnel)
npm install

# Lancer un serveur de développement
npm start

# Générer le fichier .crx
npm run build
```

### Modification du Code

1. **Éditer les fichiers** (JS, CSS, HTML)
2. **Recharger l'extension**:
   - Chrome: Appuyez sur F5 dans `chrome://extensions`
   - Ou cliquez l'icône de rechargement

3. **Ouvrir les outils de développement**:
   - Clic droit → Inspecter
   - Ou F12

### Créer des Fichiers Sons

Utilisez **Audacity** (gratuit) pour générer les sons:

1. **Nouvelle piste** → Audio
2. **Générer**:
   - Ton/Bruit (1000-2000Hz pour les aigus)
   - Durée: 0.3-0.5s
3. **Exporter** → MP3

Fichiers placeholder à remplacer:
- `sounds/tab-open.mp3`
- `sounds/tab-close.mp3`
- `sounds/page-reload.mp3`

### Ajouter des Fonds d'Écran

1. Placez vos images dans `wallpapers/`
2. Formats supportés: PNG, JPG, GIF
3. Taille recommandée: 1920x1080 ou 2560x1440

---

## 🔍 Vérification Manifest V3

### Points de Vérification

✅ **Service Worker** (pas de DOM)
- `background.js` ne contient pas d'appels DOM
- Utilise `chrome.runtime.sendMessage()` pour communiquer

✅ **Permissions Minimales**
- `storage`: Stockage local
- `tabs`: Gestion des onglets
- `webNavigation`: Détection de navigation

✅ **Content Security Policy**
- Pas de script inline
- Tous les scripts sont des fichiers externes

✅ **Web Accessible Resources**
- Sons et images accessibles
- Pattern spécifique dans manifest

### Débogage Manifest V3

```javascript
// Dans Chrome DevTools - Console
chrome.runtime.sendMessage({ action: 'getSettings' }, (response) => {
    console.log('Paramètres:', response.settings);
});
```

---

## 🚀 Optimisations Performance

### Gestion des GIF Animés
- Images chargées une seule fois en Data URL
- Stockage limité à 5MB par image
- Pas de rechargement inutile

### Anti-Spam Sons
```javascript
// Cooldown de 500ms entre deux sons identiques
const cooldown = 500;
const lastPlayTime = soundSpamProtection[soundType];
if (now - lastPlayTime < cooldown) return;
```

### Économie de Mémoire
- Nettoyage des références audio
- Suppression des éléments DOM inutilisés
- Cache optimisé du storage

---

## 🐛 Troubleshooting

### Les sons ne se jouent pas

**Problème**: Erreur d'autoplay

**Solution**:
1. Vérifier les paramètres son (popup)
2. Vérifier le volume (0% = muet)
3. Recharger l'extension
4. Vérifier la console pour les erreurs

### Le fond d'écran ne s'affiche pas

**Problème**: Format non supporté ou fichier trop volumineux

**Solution**:
1. Utiliser PNG, JPG, ou GIF
2. Vérifier la taille (< 5MB)
3. Supprimer et recharger
4. Voir la console pour les messages d'erreur

### L'extension ne se charge pas

**Problème**: Erreur Manifest V3

**Solution**:
1. Vérifier `manifest.json` (version 3)
2. Vérifier les fichiers manquants
3. Voir `chrome://extensions` → Détails → Erreurs
4. Recharger l'extension

### Popup ne s'ouvre pas

**Problème**: Fichier `popup.html` manquant

**Solution**:
1. Vérifier l'arborescence des fichiers
2. Vérifier les chemins relatifs
3. Recharger l'extension

---

## 📝 Licence

MIT License - Libre d'utilisation et de modification

---

## 🤝 Support & Contributions

Pour toute question ou contribution:
- 📧 Email: [contact@auratab.dev]
- 🐛 Issues: [GitHub Issues]
- 💬 Discussions: [GitHub Discussions]

---

## 📚 Ressources Utiles

- [Chrome Extensions Documentation](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Migration Guide](https://developer.chrome.com/docs/extensions/mv3/migration/)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)
- [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API)

---

**Dernière mise à jour**: 18/05/2026
**Version**: 1.0.0
**État**: ✅ Production-Ready

---

*AuraTab - Personnalisez votre expérience de navigation* ✨
