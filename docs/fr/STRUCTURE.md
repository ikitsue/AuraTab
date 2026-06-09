# Structure du Projet - AuraTab

Voir la [structure détaillée en anglais](../en/STRUCTURE.md) pour une description complète de l'organisation du projet.

## Vue d'ensemble

```
AuraTab/
├── manifest.json              # Configuration Manifest V3
├── background.js              # Service Worker
├── newtab.html                # Interface nouvel onglet
├── newtab.js                  # Logique nouvel onglet
├── newtab-style.css           # Styles nouvel onglet
├── popup.html                 # Interface popup
├── popup.js                   # Logique popup
├── popup-style.css            # Styles popup
├── settings.html              # Page de paramètres
├── settings.js                # Logique paramètres
├── settings-style.css         # Styles paramètres
├── i18n.js                    # Système de traduction
├── translations.json          # Dictionnaire (5 langues)
├── README.md                  # Documentation principale
├── .gitignore
├── LICENSE
│
├── docs/                      # Documentation par langue
│   ├── en/, fr/, ru/, es/, zh/
│
├── images/                    # Icônes de l'extension
│   ├── icon16.png
│   ├── icon48.png
│   └── icon128.png
│
└── wallpapers/                # Dossier de fonds d'écran utilisateur
```

## Composants principaux

- **background.js** → Gestion des événements audio et du stockage
- **newtab.js** → Logique principale (AuraTabManager)
- **settings.js** → Gestion des préférences utilisateur
- **i18n.js** → Système de traduction
- **translations.json** → Dictionnaire multilingue

## Fichiers CSS

- **newtab-style.css** → Thème cyberpunk/gaming moderne
- **popup-style.css** → Interface popup
- **settings-style.css** → Page de paramètres

## Fichiers HTML

- **newtab.html** → Page de nouvel onglet
- **popup.html** → Popup de l'extension
- **settings.html** → Page de paramètres

---

Pour plus de détails, consultez le [README détaillé](README.md) ou la [structure complète en anglais](../en/STRUCTURE.md).

**Version**: 1.0.0
