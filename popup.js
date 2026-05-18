/**
 * AuraTab - Popup Logic
 * Interface de configuration rapide
 */

class PopupManager {
    constructor() {
        this.settings = {
            volume: 70,
            soundEnabled: true,
            soundTabOpen: true,
            soundTabClose: true,
            soundPageReload: true,
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

        // Bouton état du son
        document.getElementById('sound-status-btn').addEventListener('click', () => {
            this.toggleSound();
        });

        // Toggles son
        document.getElementById('tab-open-toggle').addEventListener('change', (e) => {
            this.settings.soundTabOpen = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('tab-close-toggle').addEventListener('change', (e) => {
            this.settings.soundTabClose = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('page-reload-toggle').addEventListener('change', (e) => {
            this.settings.soundPageReload = e.target.checked;
            this.saveSettings();
        });

        // Volume
        document.getElementById('popup-volume-slider').addEventListener('change', (e) => {
            this.settings.volume = parseInt(e.target.value);
            document.getElementById('popup-volume-text').textContent = this.settings.volume + '%';
            this.saveSettings();
        });

        // Fond d'écran
        document.getElementById('change-wallpaper-btn').addEventListener('click', () => {
            document.getElementById('popup-wallpaper-input').click();
        });

        document.getElementById('popup-wallpaper-input').addEventListener('change', (e) => {
            this.handleWallpaperUpload(e);
        });

        // Tester les sons
        if (document.getElementById('test-sounds-popup-btn')) {
            document.getElementById('test-sounds-popup-btn').addEventListener('click', () => {
                this.testSounds();
            });
        }

        // Liens footer
        document.getElementById('feedback-link').addEventListener('click', (e) => {
            e.preventDefault();
            // Ouvrir un lien vers feedback
        });

        document.getElementById('help-link').addEventListener('click', (e) => {
            e.preventDefault();
            // Ouvrir un lien vers aide
        });
    }

    /**
     * Basculer le son
     */
    toggleSound() {
        this.settings.soundEnabled = !this.settings.soundEnabled;
        this.updateUI();
        this.saveSettings();
        
        // Envoyer un message au background
        chrome.runtime.sendMessage({
            action: 'toggleSound'
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
     * Tester les sons
     */
    testSounds() {
        // Envoyer un message au background pour tester les sons
        chrome.runtime.sendMessage({
            action: 'testSounds'
        }, (response) => {
            if (response && response.success) {
                alert('🔊 Test des sons en cours...');
            } else {
                alert('❌ Les sons ne peuvent pas être testés');
            }
        });
    }

    /**
     * Mettre à jour l'interface
     */
    updateUI() {
        // État du son
        const soundBtn = document.getElementById('sound-status-btn');
        if (this.settings.soundEnabled) {
            soundBtn.classList.add('active');
            soundBtn.classList.remove('inactive');
            soundBtn.innerHTML = '<span class="status-dot"></span>Activé';
        } else {
            soundBtn.classList.remove('active');
            soundBtn.classList.add('inactive');
            soundBtn.innerHTML = '<span class="status-dot"></span>Désactivé';
        }

        // Toggles son
        document.getElementById('tab-open-toggle').checked = this.settings.soundTabOpen;
        document.getElementById('tab-close-toggle').checked = this.settings.soundTabClose;
        document.getElementById('page-reload-toggle').checked = this.settings.soundPageReload;

        // Volume
        document.getElementById('popup-volume-slider').value = this.settings.volume;
        document.getElementById('popup-volume-text').textContent = this.settings.volume + '%';

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
