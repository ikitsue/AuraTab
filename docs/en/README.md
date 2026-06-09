# ✨ AuraTab - Modern New Tab Extension

Transform your New Tab page with a modern, feature-rich interface. Track weather, time zones, and customize your browsing experience.

## 📋 Project Files

### 1. **manifest.json**
Extension configuration (required by Chrome).

**What it does:**
- Declares the name, version and description of the extension
- Lists required permissions (`storage`, `tabs`, `webNavigation`)
- Points to the service worker (`background.js`)
- Configures the new tab page override (`newtab.html`)

**Key point:** `manifest_version: 3` = Manifest V3 (modern standard)

---

### 2. **background.js**
Service Worker that runs in the background and manages the logic.

**What it does:**
- 🎵 **Audio Event Handler** → Plays sounds for tab open/close/reload
- 💾 **Stores Settings** → Uses `chrome.storage.local` (never sent anywhere)
- 📨 **Communicates with Pages** → Responds to messages from popup/newtab

**Key events:**
- `chrome.tabs.onCreated` → Fires when a tab opens
- `chrome.tabs.onRemoved` → Fires when a tab closes
- `chrome.webNavigation.onBeforeNavigate` → Fires when page reloads
- `chrome.runtime.onMessage` → Receives requests from popup/newtab

---

### 3. **newtab.html**
User interface for the new tab page (replaces the default Chrome new tab).

**What it displays:**
- ⏰ Current time with timezone support
- 🌡️ Weather widget based on selected location
- 🔍 Search bar with multiple search engine options
- 📍 Location selector (country/city)
- ⚙️ Settings panel

---

### 4. **newtab.js**
Core logic for the new tab page.

**What it does:**
- 🕐 **Updates Clock** → Shows time in selected timezone using `Intl.DateTimeFormat`
- 🌦️ **Fetches Weather** → Calls Open-Meteo API based on location
- 🗺️ **Manages Location** → Maps 45+ cities to timezones
- 🎨 **Loads Wallpapers** → Displays custom or default wallpapers
- 🔗 **Manages Shortcuts** → Customizable quick links
- 📋 **Monitors Settings** → Updates when user changes preferences

**Key functions:**
- `updateClock()` → Formats time in the selected timezone
- `loadWeather()` → Fetches temperature from API
- `getCoordinates()` → Geocodes city names using Nominatim API
- `getTemperature()` → Gets weather from Open-Meteo API

---

### 5. **newtab-style.css**
Styling for the new tab page.

**Key features:**
- 🎨 Cyberpunk/gaming modern theme
- 🌈 CSS variables for easy customization
- 📱 Responsive design (mobile, tablet, desktop)
- ✨ Smooth animations and transitions

---

### 6. **popup.html**
User interface for the extension popup (visible when clicking the extension icon).

**What it displays:**
- 📊 Quick statistics
- 🔊 Sound control toggle
- 🎨 Wallpaper preview
- ⚙️ Quick access to settings

---

### 7. **popup.js**
Logic for the popup interface.

**What it does:**
- 📡 **Fetches Settings** → Gets current configuration
- 🔊 **Controls Audio** → Toggle sounds on/off
- 📋 **Displays Status** → Shows current settings status

---

### 8. **popup-style.css**
Styling for the popup interface.

---

### 9. **settings.html**
Settings page for advanced configuration.

**What it displays:**
- 🌐 Language selector
- 📍 Country/city location selection
- 🎨 Wallpaper upload
- 🔊 Sound controls
- 🔍 Search engine selection
- 📱 Interface toggles

---

### 10. **settings.js**
Logic for the settings page.

**What it does:**
- 💾 **Saves Settings** → Persists user preferences
- 🗺️ **Dynamic City Selection** → Updates cities based on selected country
- 🌐 **Language Management** → Handles i18n switching
- 🔄 **Syncs with Storage** → Updates all tabs when settings change

**Key data structures:**
- `citiesByCountry` → Maps 15 countries to 3 cities each (45 total)

---

### 11. **settings-style.css**
Styling for the settings page.

---

### 12. **i18n.js**
Internationalization system managing translations.

**Supported languages:**
- 🇬🇧 English (en)
- 🇫🇷 Français (fr)
- 🇷🇺 Русский (ru)
- 🇪🇸 Español (es)
- 🇨🇳 中文 (zh)

**What it does:**
- 🌐 **Load Translations** → Fetches from `translations.json`
- 🔄 **Update UI** → Applies translations to all elements with `data-i18n` attribute
- 💾 **Persist Language** → Saves user's language preference
- 🎯 **Smart Translation** → Preserves SVG icons when translating buttons

---

### 13. **translations.json**
Dictionary containing all UI strings in 5 languages.

**Structure:**
```json
{
  "en": { "key": "English text", ... },
  "fr": { "key": "Texte français", ... },
  "ru": { "key": "Русский текст", ... },
  "es": { "key": "Texto español", ... },
  "zh": { "key": "中文文本", ... }
}
```

---

## 🚀 How to Load

1. Open `chrome://extensions/` or `brave://extensions/`
2. Enable "Developer mode"
3. Click "Load unpacked"
4. Select the AuraTab folder
5. Done! ✅

---

## ✨ Key Features

### 🎨 Dynamic Wallpapers
- Upload custom images (PNG, JPG, GIF)
- Auto-save with Chrome storage
- Instant preview

### 🌍 Multi-Location Support
- 45+ cities across 15 countries
- Real-time weather from Open-Meteo API
- Timezone-aware clock using Intl API

### 🔍 Smart Search
- Support for 5 search engines (Google, Brave, DuckDuckGo, Ecosia, Bing)
- Quick switching between engines
- Search suggestions

### 🌐 Multi-Language
- 5 languages built-in (EN, FR, RU, ES, ZH)
- Seamless language switching
- Persistent language preference

### 🔗 Customizable Shortcuts
- Add/edit/delete quick links
- Custom icons (emoji support)
- Organized grid layout

### ⚙️ Advanced Settings
- Sound control (on/off per event)
- Volume adjustment
- Interface customization
- Location and timezone management

---

## 🛠️ Development

### Code Organization

- **newtab.js** → Main application logic (AuraTabManager class)
- **background.js** → Background service worker (sound handling, storage)
- **i18n.js** → Translation system
- **settings.js** → Settings page logic

### APIs Used

1. **Chrome APIs:**
   - `chrome.storage.local` → Local data storage
   - `chrome.tabs` → Tab management
   - `chrome.webNavigation` → Page load detection
   - `chrome.runtime.onMessage` → Inter-script communication

2. **External APIs:**
   - **Open-Meteo** → Free weather data (no API key needed)
   - **Nominatim** → Free geocoding (OpenStreetMap)

3. **Web APIs:**
   - `Intl.DateTimeFormat` → Locale-aware date/time formatting with timezone support
   - `localStorage` → Client-side storage (via Chrome API)

### Modifying the Code

1. Edit `.js`, `.css`, or `.html` files
2. Reload the extension:
   - Go to `chrome://extensions`
   - Click the refresh icon on AuraTab
3. Verify changes in a new tab

---

## 🎨 Customization

### Colors & Theme
Edit `:root` variables in `newtab-style.css`:

```css
:root {
    --primary-color: #00d9ff;      /* Cyan */
    --secondary-color: #ff006e;    /* Pink */
    --tertiary-color: #8338ec;     /* Purple */
    --background-dark: #0a0e27;    /* Dark background */
}
```

### Adding New Cities
Edit `citiesByCountry` in `settings.js`:

```javascript
citiesByCountry: {
    'us': ['New York', 'Los Angeles', 'Chicago'],
    'fr': ['Paris', 'Lyon', 'Marseille'],
    // Add more countries/cities...
}
```

### Changing Default Settings
Edit `globalSettings` in `newtab.js`:

```javascript
this.settings = {
    volume: 70,
    showShortcuts: true,
    showWeather: true,
    showTime: true,
    // Add more defaults...
}
```

---

## 🐛 Troubleshooting

### Weather not showing
- Check if location is selected in settings
- Verify internet connection
- Check browser console for API errors

### Time showing wrong timezone
- Verify selected city in settings
- Ensure city is in the timezone map (45 cities supported)
- Reload the extension

### Language not changing
- Clear browser cache
- Ensure `translations.json` is loaded
- Check console for i18n errors

### Settings not saving
- Check Chrome storage permissions
- Verify `manifest.json` includes `storage` permission
- Check browser console for errors

---

## 📚 See Also

- [Project Structure](STRUCTURE.md)
- [Main Documentation](../../README.md)
- [Complete API Reference](../DOCUMENTATION_INDEX.md)

---

**Version**: 1.0.0  
**Last Updated**: 2026-06-09
