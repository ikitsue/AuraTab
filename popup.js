/**
 * AuraTab - Popup Logic
 * Interface de configuration rapide
 */

class PopupManager {
    constructor() {
        this.settings = {};
        
        this.init();
    }

    /**
     * Initialisation
     */
    async init() {
        try {
            // Charger les paramètres
            await this.loadSettings();
            
            // Configurer les événements
            this.setupEventListeners();
            
            // Mettre à jour l'interface
            this.updateUI();
        } catch (error) {
            console.error('❌ Erreur popup:', error);
        }
    }

    /**
     * Charger les paramètres
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
     * Sauvegarder les paramètres
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
