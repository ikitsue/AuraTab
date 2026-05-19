/**
 * AuraTab - Popup Logic
 * Interface de configuration rapide
 */

class PopupManager {
    constructor() {
        this.settings = {
            volume: 70,
            wallpaper: null
        };
        
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
            
            console.log('✅ Popup initialized');
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
        // Bouton paramètres complets
        document.getElementById('open-settings-btn').addEventListener('click', () => {
            chrome.tabs.create({ url: 'newtab.html' });
            window.close();
        });

        // Nouvel onglet
        document.getElementById('new-tab-btn').addEventListener('click', () => {
            chrome.tabs.create({ url: 'newtab.html' });
        });

        // Fond d'écran
        document.getElementById('change-wallpaper-btn').addEventListener('click', () => {
            document.getElementById('popup-wallpaper-input').click();
        });

        document.getElementById('popup-wallpaper-input').addEventListener('change', (e) => {
            this.handleWallpaperUpload(e);
        });
    }

    /**
     * Gérer l'upload du fond d'écran
     */
    async handleWallpaperUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Vérifier le type
        const validTypes = ['image/png', 'image/jpeg', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            alert('❌ Format non supporté. Utilisez PNG, JPG ou GIF.');
            return;
        }

        // Vérifier la taille
        if (file.size > 5 * 1024 * 1024) {
            alert('❌ Le fichier est trop volumineux (max 5MB).');
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                this.settings.wallpaper = e.target.result;
                await this.saveSettings();
                this.updateUI();
                alert('✅ Fond d\'écran mis à jour!');
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Erreur upload:', error);
        }
    }

    /**
     * Mettre à jour l'interface
     */
    updateUI() {
        // Aperçu du fond
        const preview = document.getElementById('popup-wallpaper-preview');
        if (this.settings.wallpaper) {
            preview.style.backgroundImage = `url('${this.settings.wallpaper}')`;
        } else {
            preview.style.backgroundImage = 'none';
        }
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
