# Project Structure - AuraTab

```
AuraTab/
├── manifest.json              # Extension configuration (Manifest V3)
├── background.js              # Service Worker (sound handling, message routing)
├── newtab.html                # New tab page interface
├── newtab.js                  # New tab page logic (main application)
├── newtab-style.css           # New tab page styles
├── popup.html                 # Popup interface
├── popup.js                   # Popup logic
├── popup-style.css            # Popup styles
├── settings.html              # Settings page
├── settings.js                # Settings page logic
├── settings-style.css         # Settings page styles
├── i18n.js                    # Internationalization system
├── translations.json          # Translation dictionary (5 languages)
├── README.md                  # Main documentation (multilingual)
├── LICENSE                    # MIT License
├── .gitignore                 # Git ignore file
│
├── docs/                      # Language-specific documentation
│   ├── en/
│   │   ├── README.md          # English documentation
│   │   └── STRUCTURE.md       # English project structure
│   ├── fr/
│   │   ├── README.md          # French documentation
│   │   └── STRUCTURE.md       # French project structure
│   ├── ru/
│   │   ├── README.md          # Russian documentation
│   │   └── STRUCTURE.md       # Russian project structure
│   ├── es/
│   │   ├── README.md          # Spanish documentation
│   │   └── STRUCTURE.md       # Spanish project structure
│   └── zh/
│       ├── README.md          # Chinese documentation
│       └── STRUCTURE.md       # Chinese project structure
│
├── images/                    # Extension icons
│   ├── icon16.png             # 16x16 icon (toolbar)
│   ├── icon48.png             # 48x48 icon (popup)
│   ├── icon128.png            # 128x128 icon (Chrome store)
│   └── README.md              # Images documentation
│
└── wallpapers/                # Optional wallpaper folder
    └── (user-generated folder)
```

## File Descriptions

### Core Files

| File | Purpose | Type |
|------|---------|------|
| `manifest.json` | Extension configuration and permissions | Configuration |
| `background.js` | Service Worker - background tasks | Logic |
| `newtab.html` | New tab page HTML structure | Interface |
| `newtab.js` | New tab page JavaScript logic | Logic |
| `newtab-style.css` | New tab page styling | Style |

### Settings & Configuration

| File | Purpose | Type |
|------|---------|------|
| `settings.html` | Settings page HTML | Interface |
| `settings.js` | Settings management logic | Logic |
| `settings-style.css` | Settings page styling | Style |
| `i18n.js` | Language/translation system | Logic |
| `translations.json` | Translation strings (EN, FR, RU, ES, ZH) | Data |

### Popup Interface

| File | Purpose | Type |
|------|---------|------|
| `popup.html` | Popup window HTML | Interface |
| `popup.js` | Popup window logic | Logic |
| `popup-style.css` | Popup styling | Style |

### Documentation & Assets

| Folder | Purpose |
|--------|---------|
| `/docs/` | Language-specific documentation (5 languages) |
| `/images/` | Extension icons (multiple sizes) |
| `/wallpapers/` | Optional user wallpapers (auto-created) |

---

## Architecture Overview

### Data Flow

```
User Interaction
    ↓
newtab.html / popup.html
    ↓
newtab.js / popup.js / settings.js
    ↓
i18n.js (translations)
    ↓
background.js (storage & messaging)
    ↓
chrome.storage.local (persistent data)
```

### Component Relationships

```
background.js (Service Worker)
    ├── Listens for: tab events, messages
    ├── Handles: audio playback, storage
    └── Communicates with: newtab.js, popup.js, settings.js

newtab.js (AuraTabManager)
    ├── Manages: wallpaper, clock, weather, shortcuts
    ├── Communicates with: background.js, i18n.js
    └── Updates: newtab.html DOM

popup.js
    ├── Displays: quick settings, status
    ├── Communicates with: background.js
    └── Updates: popup.html DOM

settings.js
    ├── Manages: user preferences, language
    ├── Communicates with: background.js, i18n.js
    └── Updates: settings.html DOM

i18n.js
    ├── Loads: translations.json
    ├── Provides: language functions
    └── Updates: all pages with translations
```

---

## Key Features by Component

### Wallpaper Management
- **File**: `newtab.js` (loadWallpaper, uploadWallpaper functions)
- **Storage**: Chrome local storage
- **Format**: Data URL (PNG, JPG, GIF)
- **Size**: Max 5MB

### Weather System
- **File**: `newtab.js` (loadWeather, getCoordinates, getTemperature)
- **API 1**: Open-Meteo (free weather data)
- **API 2**: Nominatim (free geocoding)
- **Update**: Every 10 minutes + on location change

### Clock & Time
- **File**: `newtab.js` (updateClock function)
- **Method**: `Intl.DateTimeFormat` with timezone support
- **Cities**: 45 cities mapped to IANA timezones
- **Update**: Every 1 second

### Search Integration
- **File**: `newtab.js` (handleSearch function)
- **Engines**: Google, Brave, DuckDuckGo, Ecosia, Bing
- **Storage**: User preference in settings

### Language System
- **File**: `i18n.js` + `translations.json`
- **Languages**: EN, FR, RU, ES, ZH (5 total)
- **Method**: `data-i18n` attribute on HTML elements
- **Storage**: User preference persisted

### Sound System
- **File**: `background.js`
- **Events**: Tab open, tab close, page reload
- **Control**: Volume slider, enable/disable per event
- **Anti-spam**: 500ms cooldown between sounds

---

## Development Workflow

### Adding a New Feature

1. **Create the HTML** in `newtab.html` or `settings.html`
   ```html
   <div id="my-feature" data-i18n="my_feature_label">Feature</div>
   ```

2. **Add the logic** in `newtab.js` or `settings.js`
   ```javascript
   setupMyFeature() {
       // Feature implementation
   }
   ```

3. **Add styling** in the appropriate CSS file
   ```css
   #my-feature {
       /* Styles */
   }
   ```

4. **Add translations** in `translations.json`
   ```json
   {
       "en": { "my_feature_label": "My Feature" },
       "fr": { "my_feature_label": "Ma Fonctionnalité" },
       // ...
   }
   ```

5. **Update documentation** in `/docs/` folder

### Testing Changes

1. Edit files in VS Code
2. Go to `chrome://extensions`
3. Click the refresh icon on AuraTab
4. Open a new tab or reload the popup
5. Check browser console (F12) for errors

### Debugging

- **Console**: F12 → Console tab
- **Storage**: Go to `chrome://extensions` → AuraTab → Inspect → Application → Local Storage
- **Network**: Check API calls in Network tab
- **Background Worker**: Click "Inspect" on background.js in extensions page

---

## File Organization Notes

### Why This Structure?

- **Minimal but Extensible**: Only essential files, easy to add features
- **Language-Separated Docs**: Each language has its own documentation
- **Clear Separation**: Logic, styling, and content are separate
- **Single Responsibility**: Each file has one main purpose
- **Easy Navigation**: Organized by feature (newtab, popup, settings)

### Modification Priorities

If you want to modify the extension:

1. **Visuals**: Edit CSS files (`*-style.css`)
2. **Behavior**: Edit JS files (`*.js`)
3. **Content**: Edit HTML files (`*.html`) + `translations.json`
4. **Permissions**: Edit `manifest.json`
5. **Colors**: Edit CSS variables in `:root`

---

## File Sizes (Approximate)

| File | Size | Type |
|------|------|------|
| newtab.js | ~900 lines | Logic |
| settings.js | ~200 lines | Logic |
| background.js | ~300 lines | Logic |
| newtab-style.css | ~1200 lines | Style |
| settings-style.css | ~600 lines | Style |
| i18n.js | ~150 lines | Logic |
| popup.js | ~100 lines | Logic |
| translations.json | ~70 lines | Data |

Total: ~4000 lines of code (fully functional extension)

---

## See Also

- [Detailed Documentation](README.md)
- [Main README](../../README.md)
- [Translations](../../translations.json)
- [Manifest File](../../manifest.json)

---

**Version**: 1.0.0  
**Last Updated**: 2026-06-09
