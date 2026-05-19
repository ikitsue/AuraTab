/**
 * AuraTab - Popup Logic
 * Quick configuration interface
 */

class PopupManager {
    constructor() {
        this.settings = {};
        
        this.init();
    }

    /**
     * Initialize popup
     */
    async init() {
        try {
            // Initialize i18n
            await i18n.init();
            
            // Load settings
            await this.loadSettings();
            
            // Setup events
            this.setupEventListeners();
            
            // Update interface
            this.updateUI();
        } catch (error) {
            console.error('Error popup:', error);
        }
    }

    /**
     * Load settings
     */
    async loadSettings() {
        return new Promise((resolve) => {
            chrome.storage.local.get(null, (items) => {
                this.settings = { ...this.settings, ...items };
                resolve();
            });
        });
    }

    /**
     * Save settings
     */
    async saveSettings() {
        return new Promise((resolve) => {
            chrome.storage.local.set(this.settings, () => {
                resolve();
            });
        });
    }

    /**
     * Configuration des événements
     */
    setupEventListeners() {
        // Aucun événement à configurer pour le moment
    }

    /**
     * Mettre à jour l'interface
     */
    updateUI() {
        // Aucune mise à jour d'interface
    }
}

// Initialiser au chargement
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PopupManager();
    });
} else {
    new PopupManager();
}
