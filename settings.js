/**
 * AuraTab - Settings Page Logic
 * Manage settings for the dedicated page
 */

class AuraTabSettings {
    constructor() {
        this.settings = {
            volume: 70,
            showShortcuts: true,
            showWeather: true,
            showTime: true,
            wallpaper: null,
            shortcuts: [],
            searchEngine: 'google',
            language: 'fr'
        };
        
        this.init();
    }

    /**
     * Initialize settings page
     */
    async init() {
        try {
            // Initialize internationalization first
            await i18n.init();
            
            // Load saved settings
            await this.loadSettings();
            
            // Setup events
            this.setupEventListeners();
            
            // Load wallpaper
            await this.loadWallpaper();
            
            // Update settings display
            this.updateSettingsUI();
        } catch (error) {
            console.error('Error during settings initialization:', error);
        }
    }

    /**
     * Load settings from storage
     */
    async loadSettings() {
        return new Promise((resolve) => {
            chrome.storage.local.get(['auraTabSettings'], (result) => {
                if (result.auraTabSettings) {
                    this.settings = { ...this.settings, ...result.auraTabSettings };
                }
                resolve();
            });
        });
    }

    /**
     * Save settings
     */
    async saveSettings() {
        return new Promise((resolve) => {
            chrome.storage.local.set({ auraTabSettings: this.settings }, resolve);
        });
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Language
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                const newLanguage = e.target.value;
                i18n.setLanguage(newLanguage);
                this.settings.language = newLanguage;
                this.saveSettings();
                // Update settings UI to show translated language names
                this.updateSettingsUI();
            });
        }
    }

    /**
     * Update volume display
     */
    updateVolumeDisplay() {
        const volumeSlider = document.getElementById('volume-slider');
        const volumeDisplay = document.getElementById('volume-display');
        if (volumeSlider && volumeDisplay) {
            volumeDisplay.textContent = volumeSlider.value + '%';
        }
    }

    /**
     * Update settings interface
     */
    updateSettingsUI() {
        // Update language select
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = this.settings.language;
            
            // Translate language options
            const languageNames = {
                'en': i18n.get('english'),
                'fr': i18n.get('francais'),
                'ru': i18n.get('russian'),
                'zh': i18n.get('chinese'),
                'es': i18n.get('spanish')
            };
            
            languageSelect.querySelectorAll('option').forEach(option => {
                const lang = option.value;
                if (languageNames[lang]) {
                    option.textContent = languageNames[lang];
                }
            });
        }
    }

    /**
     * Load and display wallpaper
     */
    async loadWallpaper() {
        try {
            // Load from storage
            const stored = await new Promise((resolve) => {
                chrome.storage.local.get('currentWallpaper', (result) => {
                    resolve(result.currentWallpaper);
                });
            });

            if (stored) {
                this.applyWallpaper(stored);
            }
        } catch (error) {
            console.error('Error loading wallpaper:', error);
        }
    }

    /**
     * Apply wallpaper
     */
    applyWallpaper(wallpaperPath) {
        const wallpaperDisplay = document.getElementById('wallpaper-display');
        if (wallpaperDisplay) {
            wallpaperDisplay.style.backgroundImage = `url('${wallpaperPath}')`;
        }
    }
}

// Initialiser l'application au chargement
document.addEventListener('DOMContentLoaded', () => {
    window.settingsApp = new AuraTabSettings();
});
