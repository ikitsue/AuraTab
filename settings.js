/**
 * AuraTab - Settings Page Logic
 * Gestion des paramètres de la page dédiée
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
     * Initialisation de la page paramètres
     */
    async init() {
        try {
            // Charger les paramètres sauvegardés
            await this.loadSettings();
            
            // Configurer les événements
            this.setupEventListeners();
            
            // Charger le fond d'écran
            await this.loadWallpaper();
            
            // Mettre à jour l'affichage des paramètres
            this.updateSettingsUI();
        } catch (error) {
            console.error('Erreur lors de l\'initialisation des paramètres:', error);
        }
    }

    /**
     * Charger les paramètres depuis le stockage
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
     * Sauvegarder les paramètres
     */
    async saveSettings() {
        return new Promise((resolve) => {
            chrome.storage.local.set({ auraTabSettings: this.settings }, resolve);
        });
    }

    /**
     * Configurer les écouteurs d'événements
     */
    setupEventListeners() {
        // Langue
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.addEventListener('change', (e) => {
                this.settings.language = e.target.value;
                this.saveSettings();
            });
        }
    }

    /**
     * Mettre à jour l'affichage du volume
     */
    updateVolumeDisplay() {
        const volumeSlider = document.getElementById('volume-slider');
        const volumeDisplay = document.getElementById('volume-display');
        if (volumeSlider && volumeDisplay) {
            volumeDisplay.textContent = volumeSlider.value + '%';
        }
    }

    /**
     * Mettre à jour l'interface des paramètres
     */
    updateSettingsUI() {
        // Mettre à jour la langue
        const languageSelect = document.getElementById('language-select');
        if (languageSelect) {
            languageSelect.value = this.settings.language;
        }
    }

    /**
     * Charger et afficher le fond d'écran
     */
    async loadWallpaper() {
        try {
            // Charger depuis le stockage
            const stored = await new Promise((resolve) => {
                chrome.storage.local.get('currentWallpaper', (result) => {
                    resolve(result.currentWallpaper);
                });
            });

            if (stored) {
                this.applyWallpaper(stored);
            }
        } catch (error) {
            console.error('Erreur lors du chargement du fond d\'écran:', error);
        }
    }

    /**
     * Appliquer le fond d'écran
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
