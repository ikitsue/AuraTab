/**
 * AuraTab - New Tab Page Logic
 * Gestion du fond d'écran, effets sonores, horloge et interface
 */

class AuraTabManager {
    constructor() {
        // Stocker l'instance globale pour accès depuis les listeners
        window.appManager = this;

        this.settings = {
            volume: 70,
            showShortcuts: true,
            showWeather: true,
            showTime: true,
            wallpaper: null
        };
        
        this.init();
    }

    /**
     * Initialisation de l'application
     */
    async init() {
        try {
            // Charger les paramètres sauvegardés
            await this.loadSettings();
            
            // Configurer les événements de l'interface
            this.setupEventListeners();
            
            // Initialiser l'horloge
            this.updateClock();
            setInterval(() => this.updateClock(), 1000);
            
            // Charger et afficher le fond d'écran
            await this.loadWallpaper();
            
            // Mettre à jour l'interface selon les paramètres
            this.updateUI();
            
            // Enregistrer les modifications de paramètres
            this.monitorSettings();
            
            console.log('✅ AuraTab initialized successfully');
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
        }
    }

    /**
     * Charger les paramètres depuis le stockage Chrome
     */
    async loadSettings() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.get(null, (items) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }
                
                // Fusionner avec les paramètres par défaut
                this.settings = { ...this.settings, ...items };
                resolve();
            });
        });
    }

    /**
     * Sauvegarder les paramètres dans le stockage Chrome
     */
    async saveSettings() {
        return new Promise((resolve, reject) => {
            chrome.storage.local.set(this.settings, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }
                resolve();
            });
        });
    }

    /**
     * Configuration des écouteurs d'événements
     */
    setupEventListeners() {
        // Bouton Paramètres
        document.getElementById('toggle-settings-btn').addEventListener('click', () => {
            this.toggleSettings();
        });

        // Bouton Fermer paramètres
        document.getElementById('close-settings-btn').addEventListener('click', () => {
            this.toggleSettings(false);
        });

        // Bouton son master
        document.getElementById('sound-toggle-btn').addEventListener('click', () => {
            this.toggleMasterSound();
        });

        // Fermer les paramètres en cliquant en dehors
        document.getElementById('settings-modal').addEventListener('click', (e) => {
            if (e.target.id === 'settings-modal') {
                this.toggleSettings(false);
            }
        });

        // Upload du fond d'écran
        document.getElementById('upload-wallpaper-btn').addEventListener('click', () => {
            document.getElementById('wallpaper-input').click();
        });

        document.getElementById('wallpaper-input').addEventListener('change', (e) => {
            this.handleWallpaperUpload(e);
        });

        // Supprimer le fond
        document.getElementById('remove-wallpaper-btn').addEventListener('click', () => {
            this.removeWallpaper();
        });

        // Volume
        document.getElementById('volume-slider').addEventListener('change', (e) => {
            this.settings.volume = parseInt(e.target.value);
            document.getElementById('volume-value').textContent = this.settings.volume + '%';
            this.saveSettings();
        });

        // Options d'interface
        document.getElementById('show-shortcuts').addEventListener('change', (e) => {
            this.settings.showShortcuts = e.target.checked;
            this.updateUI();
            this.saveSettings();
        });

        document.getElementById('show-weather').addEventListener('change', (e) => {
            this.settings.showWeather = e.target.checked;
            this.updateUI();
            this.saveSettings();
        });

        document.getElementById('show-time').addEventListener('change', (e) => {
            this.settings.showTime = e.target.checked;
            this.updateUI();
            this.saveSettings();
        });

        // Bouton Enregistrer
        document.getElementById('save-settings-btn').addEventListener('click', () => {
            this.toggleSettings(false);
            this.showNotification('✅ Paramètres enregistrés!');
        });

        // Barre de recherche
        document.getElementById('search-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value;
                if (query.trim()) {
                    window.location.href = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
                }
            }
        });
    }

    /**
     * Basculer l'affichage des paramètres
     */
    toggleSettings(show = null) {
        const modal = document.getElementById('settings-modal');
        const isHidden = modal.classList.contains('hidden');
        
        if (show === null) {
            show = isHidden;
        }

        if (show) {
            modal.classList.remove('hidden');
            // Mettre à jour les contrôles
            this.updateSettingsUI();
        } else {
            modal.classList.add('hidden');
        }
    }

    /**
     * Mettre à jour l'interface des paramètres
     */
    updateSettingsUI() {
        document.getElementById('volume-slider').value = this.settings.volume;
        document.getElementById('volume-value').textContent = this.settings.volume + '%';
        document.getElementById('show-shortcuts').checked = this.settings.showShortcuts;
        document.getElementById('show-weather').checked = this.settings.showWeather;
        document.getElementById('show-time').checked = this.settings.showTime;

        // Mettre à jour l'aperçu du fond
        if (this.settings.wallpaper) {
            const previewBox = document.getElementById('preview-wallpaper');
            previewBox.style.backgroundImage = `url(${this.settings.wallpaper})`;
            document.getElementById('wallpaper-info-text').textContent = '✅ Fond personnalisé chargé';
        }
    }

    /**
     * Basculer le son master
     */
    toggleMasterSound() {
        this.saveSettings();
    }


    /**
     * Gérer l'upload du fond d'écran
     */
    async handleWallpaperUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        // Vérifier le type de fichier
        const validTypes = ['image/png', 'image/jpeg', 'image/gif'];
        if (!validTypes.includes(file.type)) {
            this.showNotification('❌ Format non supporté. Utilisez PNG, JPG ou GIF.');
            return;
        }

        // Vérifier la taille (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification('❌ Le fichier est trop volumineux (max 5MB).');
            return;
        }

        try {
            // Convertir en Data URL
            const reader = new FileReader();
            reader.onload = async (e) => {
                this.settings.wallpaper = e.target.result;
                await this.saveSettings();
                await this.loadWallpaper();
                this.updateSettingsUI();
                this.showNotification('✅ Fond d\'écran mis à jour!');
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Erreur lors de l\'upload:', error);
            this.showNotification('❌ Erreur lors du chargement du fond');
        }
    }

    /**
     * Charger et afficher le fond d'écran
     */
    async loadWallpaper() {
        const wallpaperDisplay = document.getElementById('wallpaper-display');
        
        if (this.settings.wallpaper) {
            wallpaperDisplay.style.backgroundImage = `url('${this.settings.wallpaper}')`;
        } else {
            // Fond par défaut (gradient cyberpunk)
            wallpaperDisplay.style.background = 'linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(131, 56, 236, 0.1) 100%)';
        }
    }

    /**
     * Supprimer le fond d'écran
     */
    async removeWallpaper() {
        this.settings.wallpaper = null;
        await this.saveSettings();
        await this.loadWallpaper();
        this.updateSettingsUI();
        this.showNotification('🗑️ Fond supprimé');
    }

    /**
     * Mettre à jour l'interface selon les paramètres
     */
    updateUI() {
        // Affichage des raccourcis
        const shortcutsSection = document.querySelector('.shortcuts-section');
        shortcutsSection.style.display = this.settings.showShortcuts ? 'block' : 'none';

        // Affichage de la météo
        const weatherWidget = document.querySelector('.weather-widget');
        weatherWidget.style.display = this.settings.showWeather ? 'flex' : 'none';

        // Affichage de l'horloge
        const clockWidget = document.querySelector('.clock-widget');
        clockWidget.style.display = this.settings.showTime ? 'block' : 'none';
    }

    /**
     * Mettre à jour l'horloge
     */
    updateClock() {
        const now = new Date();
        
        // Formater l'heure
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        document.getElementById('time').textContent = `${hours}:${minutes}`;

        // Formater la date
        const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const dateStr = now.toLocaleDateString('fr-FR', options);
        document.getElementById('date').textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
    }

    /**
     * Afficher une notification temporaire
     */
    showNotification(message) {
        // Créer un élément de notification
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            bottom: 100px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(0, 217, 255, 0.2);
            border: 1px solid rgba(0, 217, 255, 0.5);
            color: #00d9ff;
            padding: 12px 24px;
            border-radius: 8px;
            font-size: 0.9rem;
            z-index: 1000;
            animation: slideUp 300ms ease;
            backdrop-filter: blur(10px);
        `;

        document.body.appendChild(notification);

        // Supprimer après 3 secondes
        setTimeout(() => {
            notification.style.animation = 'slideDown 300ms ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    /**
     * Surveiller les modifications des paramètres
     */
    monitorSettings() {
        // Écouter les changements depuis d'autres onglets
        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName === 'local') {
                for (let [key, { newValue }] of Object.entries(changes)) {
                    this.settings[key] = newValue;
                }
                this.updateUI();
            }
        });
    }
}

// Initialiser l'application au chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AuraTabManager();
    });
} else {
    new AuraTabManager();
}
