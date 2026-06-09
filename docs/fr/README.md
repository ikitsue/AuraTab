# ✨ AuraTab - Extension Moderne pour Nouvel Onglet

Transformez votre page de nouvel onglet avec une interface moderne et riche en fonctionnalités. Suivez la météo, les fuseaux horaires et personnalisez votre expérience de navigation.

## 📋 Fichiers du Projet

### 1. **manifest.json**
Configuration de l'extension (requise par Chrome).

**Ce qu'il fait:**
- Déclare le nom, la version et la description de l'extension
- Liste les permissions requises (`storage`, `tabs`, `webNavigation`)
- Pointe vers le service worker (`background.js`)
- Configure la page de nouvel onglet (`newtab.html`)

**Point clé:** `manifest_version: 3` = Manifest V3 (standard moderne)

---

### 2. **background.js**
Service Worker qui s'exécute en arrière-plan et gère la logique.

**Ce qu'il fait:**
- 🎵 **Gestionnaire d'événements audio** → Joue les sons d'ouverture/fermeture/rechargement d'onglet
- 💾 **Stockage des paramètres** → Utilise `chrome.storage.local` (jamais envoyé nulle part)
- 📨 **Communication avec les pages** → Répond aux messages de la popup/newtab

**Événements clés:**
- `chrome.tabs.onCreated` → Se déclenche quand un onglet s'ouvre
- `chrome.tabs.onRemoved` → Se déclenche quand un onglet se ferme
- `chrome.webNavigation.onBeforeNavigate` → Se déclenche lors d'un rechargement
- `chrome.runtime.onMessage` → Reçoit les demandes de popup/newtab

---

### 3. **newtab.html**
Interface utilisateur pour la page de nouvel onglet (remplace le nouvel onglet par défaut de Chrome).

**Ce qu'il affiche:**
- ⏰ Heure actuelle avec support des fuseaux horaires
- 🌡️ Widget météo basé sur la localisation sélectionnée
- 🔍 Barre de recherche avec plusieurs moteurs
- 📍 Sélecteur de localisation (pays/ville)
- ⚙️ Panneau de paramètres

---

### 4. **newtab.js**
Logique principale pour la page de nouvel onglet.

**Ce qu'il fait:**
- 🕐 **Met à jour l'horloge** → Affiche l'heure dans le fuseau horaire sélectionné
- 🌦️ **Récupère la météo** → Appelle l'API Open-Meteo selon la localisation
- 🗺️ **Gère la localisation** → Mappe 45+ villes aux fuseaux horaires
- 🎨 **Charge les fonds d'écran** → Affiche les fonds personnalisés ou par défaut
- 🔗 **Gère les raccourcis** → Liens rapides personnalisables
- 📋 **Surveille les paramètres** → Met à jour quand l'utilisateur change les préférences

---

### 5. **newtab-style.css**
Styles pour la page de nouvel onglet.

**Caractéristiques clés:**
- 🎨 Thème cyberpunk/gaming moderne
- 🌈 Variables CSS pour personnalisation facile
- 📱 Design réactif (mobile, tablette, desktop)
- ✨ Animations et transitions fluides

---

### 6. **popup.html**
Interface utilisateur pour la popup de l'extension (visible quand on clique sur l'icône).

**Ce qu'elle affiche:**
- 📊 Statistiques rapides
- 🔊 Bouton de contrôle du son
- 🎨 Aperçu du fond d'écran
- ⚙️ Accès rapide aux paramètres

---

### 7. **popup.js**
Logique pour l'interface de la popup.

**Ce qu'elle fait:**
- 📡 **Récupère les paramètres** → Obtient la configuration actuelle
- 🔊 **Contrôle l'audio** → Basculer les sons on/off
- 📋 **Affiche le statut** → Montre l'état des paramètres

---

### 8. **popup-style.css**
Styles pour l'interface de la popup.

---

### 9. **settings.html**
Page de paramètres pour la configuration avancée.

**Ce qu'elle affiche:**
- 🌐 Sélecteur de langue
- 📍 Sélection du pays/ville
- 🎨 Téléchargement de fond d'écran
- 🔊 Contrôles sonores
- 🔍 Sélection du moteur de recherche
- 📱 Basculements d'interface

---

### 10. **settings.js**
Logique pour la page de paramètres.

**Ce qu'elle fait:**
- 💾 **Sauvegarde les paramètres** → Persiste les préférences utilisateur
- 🗺️ **Sélection dynamique des villes** → Met à jour les villes selon le pays sélectionné
- 🌐 **Gestion des langues** → Gère le changement de langue
- 🔄 **Synchronise avec le stockage** → Met à jour tous les onglets

---

### 11. **settings-style.css**
Styles pour la page de paramètres.

---

### 12. **i18n.js**
Système d'internationalisation pour gérer les traductions.

**Langues supportées:**
- 🇬🇧 English (en)
- 🇫🇷 Français (fr)
- 🇷🇺 Русский (ru)
- 🇪🇸 Español (es)
- 🇨🇳 中文 (zh)

---

### 13. **translations.json**
Dictionnaire contenant tous les textes d'interface en 5 langues.

---

## 🚀 Comment charger l'extension

1. Ouvrez `chrome://extensions/` ou `brave://extensions/`
2. Activez le "Mode de développeur"
3. Cliquez sur "Charger l'extension non empaquetée"
4. Sélectionnez le dossier AuraTab
5. C'est fait! ✅

---

## ✨ Fonctionnalités clés

- 🎨 Fonds d'écran dynamiques personnalisés
- 🌍 Support multi-localisation (45+ villes)
- 🌡️ Météo en temps réel
- 🔍 Recherche multi-moteur
- 🌐 5 langues intégrées
- 🔗 Raccourcis personnalisables
- ⚙️ Paramètres avancés
- 🔊 Contrôle sonore complet

---

**Version**: 1.0.0  
**Dernière mise à jour**: 2026-06-09
