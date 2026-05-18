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
            soundEnabled: true,
            soundTabOpen: true,
            soundTabClose: true,
            soundPageReload: false,
            showShortcuts: true,
            showWeather: true,
            showTime: true,
            wallpaper: null,
            customSoundTabOpen: null,
            customSoundTabClose: null,
            customSoundPageReload: null
        };
        
        this.soundSpamProtection = {
            tabOpen: 0,
            tabClose: 0,
            pageReload: 0,
            cooldown: 500 // ms minimum entre deux sons
        };
        
        // Vérifier que l'élément audio existe
        this.audioPlayer = document.getElementById('sound-player');
        if (!this.audioPlayer) {
            console.warn('⚠️ Élément audio-player non trouvé');
        }
        
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

        // Upload sons personnalisés
        document.getElementById('upload-sound-tab-open-btn').addEventListener('click', () => {
            document.getElementById('sound-tab-open-input').click();
        });

        document.getElementById('upload-sound-tab-close-btn').addEventListener('click', () => {
            document.getElementById('sound-tab-close-input').click();
        });

        document.getElementById('upload-sound-page-reload-btn').addEventListener('click', () => {
            document.getElementById('sound-page-reload-input').click();
        });

        document.getElementById('sound-tab-open-input').addEventListener('change', (e) => {
            this.handleCustomSoundUpload(e, 'customSoundTabOpen', 'tab-open');
        });

        document.getElementById('sound-tab-close-input').addEventListener('change', (e) => {
            this.handleCustomSoundUpload(e, 'customSoundTabClose', 'tab-close');
        });

        document.getElementById('sound-page-reload-input').addEventListener('change', (e) => {
            this.handleCustomSoundUpload(e, 'customSoundPageReload', 'page-reload');
        });

        // Réinitialiser sons
        document.getElementById('reset-sound-tab-open-btn').addEventListener('click', () => {
            this.resetCustomSound('customSoundTabOpen', 'tab-open');
        });

        document.getElementById('reset-sound-tab-close-btn').addEventListener('click', () => {
            this.resetCustomSound('customSoundTabClose', 'tab-close');
        });

        document.getElementById('reset-sound-page-reload-btn').addEventListener('click', () => {
            this.resetCustomSound('customSoundPageReload', 'page-reload');
        });

        // Tester les sons
        document.getElementById('test-sounds-btn').addEventListener('click', () => {
            this.testAllSounds();
        });

        // Contrôles sonores
        document.getElementById('sound-tab-open').addEventListener('change', (e) => {
            this.settings.soundTabOpen = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('sound-tab-close').addEventListener('change', (e) => {
            this.settings.soundTabClose = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('sound-page-reload').addEventListener('change', (e) => {
            this.settings.soundPageReload = e.target.checked;
            this.saveSettings();
        });

        document.getElementById('sound-master').addEventListener('change', (e) => {
            this.settings.soundEnabled = e.target.checked;
            this.updateSoundButtonState();
            this.saveSettings();
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
        document.getElementById('sound-tab-open').checked = this.settings.soundTabOpen;
        document.getElementById('sound-tab-close').checked = this.settings.soundTabClose;
        document.getElementById('sound-page-reload').checked = this.settings.soundPageReload;
        document.getElementById('sound-master').checked = this.settings.soundEnabled;
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

        // Mettre à jour les statuts des sons
        this.updateSoundStatus('tab-open', this.settings.customSoundTabOpen);
        this.updateSoundStatus('tab-close', this.settings.customSoundTabClose);
        this.updateSoundStatus('page-reload', this.settings.customSoundPageReload);
    }

    /**
     * Mettre à jour le statut d'un son personnalisé
     */
    updateSoundStatus(soundType, customSound) {
        const statusElement = document.getElementById(`${soundType}-status`);
        if (!statusElement) return;

        if (customSound) {
            statusElement.textContent = '✅ Personnalisé';
            statusElement.classList.add('custom');
        } else {
            statusElement.textContent = 'Par défaut';
            statusElement.classList.remove('custom');
        }
    }

    /**
     * Basculer le son master
     */
    toggleMasterSound() {
        this.settings.soundEnabled = !this.settings.soundEnabled;
        document.getElementById('sound-master').checked = this.settings.soundEnabled;
        this.updateSoundButtonState();
        this.saveSettings();
    }

    /**
     * Mettre à jour l'état du bouton son
     */
    updateSoundButtonState() {
        const btn = document.getElementById('sound-toggle-btn');
        if (this.settings.soundEnabled) {
            btn.classList.remove('muted');
        } else {
            btn.classList.add('muted');
        }
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
     * Gérer l'upload d'un son personnalisé
     */
    async handleCustomSoundUpload(event, settingKey, soundType) {
        const file = event.target.files[0];
        if (!file) return;

        // Vérifier le type de fichier audio
        const validTypes = ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4', 'audio/x-m4a'];
        if (!validTypes.includes(file.type)) {
            this.showNotification('❌ Format non supporté. Utilisez MP3, WAV, OGG ou M4A.');
            return;
        }

        // Vérifier la taille (max 2MB par son)
        if (file.size > 2 * 1024 * 1024) {
            this.showNotification('❌ Le fichier est trop volumineux (max 2MB).');
            return;
        }

        try {
            const reader = new FileReader();
            reader.onload = async (e) => {
                this.settings[settingKey] = e.target.result;
                await this.saveSettings();
                this.updateSettingsUI();
                this.showNotification(`✅ Son ${soundType} personnalisé!`);
            };
            reader.readAsDataURL(file);
        } catch (error) {
            console.error('Erreur lors de l\'upload du son:', error);
            this.showNotification('❌ Erreur lors du chargement du son');
        }
    }

    /**
     * Réinitialiser un son personnalisé
     */
    async resetCustomSound(settingKey, soundType) {
        this.settings[settingKey] = null;
        await this.saveSettings();
        this.updateSettingsUI();
        this.showNotification(`🔄 Son ${soundType} réinitialisé`);
    }

    /**
     * Tester tous les sons
     */
    testAllSounds() {
        this.showNotification('🔊 Test des sons...');
        
        setTimeout(() => {
            if (this.settings.soundTabOpen && this.settings.soundEnabled) {
                this.playSound('tab-open');
            }
        }, 200);

        setTimeout(() => {
            if (this.settings.soundTabClose && this.settings.soundEnabled) {
                this.playSound('tab-close');
            }
        }, 800);

        setTimeout(() => {
            if (this.settings.soundPageReload && this.settings.soundEnabled) {
                this.playSound('page-reload');
            }
        }, 1400);
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
     * Jouer un son avec protection anti-spam
     */
    async playSound(soundType) {
        // Vérifier si les sons sont activés
        if (!this.settings.soundEnabled) return;

        // Vérifier le type de son
        const soundSettings = {
            'tab-open': this.settings.soundTabOpen,
            'tab-close': this.settings.soundTabClose,
            'page-reload': this.settings.soundPageReload
        };

        if (!soundSettings[soundType]) return;

        // Protection anti-spam
        const now = Date.now();
        const lastPlayTime = this.soundSpamProtection[soundType.replace('-', '')] || 0;
        
        if (now - lastPlayTime < this.soundSpamProtection.cooldown) {
            return;
        }

        this.soundSpamProtection[soundType.replace('-', '')] = now;

        try {
            let soundUrl;
            
            // Vérifier si un son personnalisé existe
            const customSoundKey = {
                'tab-open': 'customSoundTabOpen',
                'tab-close': 'customSoundTabClose',
                'page-reload': 'customSoundPageReload'
            }[soundType];

            if (this.settings[customSoundKey]) {
                // Utiliser le son personnalisé
                soundUrl = this.settings[customSoundKey];
            } else {
                // Utiliser le son par défaut
                soundUrl = chrome.runtime.getURL(`sounds/${soundType}.wav`);
            }
            
            // Configurer l'audio
            if (this.audioPlayer) {
                this.audioPlayer.src = soundUrl;
                this.audioPlayer.volume = this.settings.volume / 100;
                
                // Jouer le son
                const playPromise = this.audioPlayer.play();
                
                if (playPromise !== undefined) {
                    playPromise.catch(error => {
                        // Autoplay peut être bloqué
                        console.warn('Son bloqué (autoplay):', error);
                    });
                }
            } else {
                console.warn('Audio player non disponible');
            }
        } catch (error) {
            console.error('Erreur lors de la lecture du son:', error);
        }
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

// Écouter les messages du background pour jouer les sons
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'playSoundFromBackground') {
        // Jouer le son demandé par le background
        const soundFile = request.soundFile;
        const soundUrl = chrome.runtime.getURL(`sounds/${soundFile}`);
        
        try {
            // Vérifier si c'est une Data URL (son personnalisé) ou une URL d'extension
            if (soundUrl.startsWith('data:')) {
                // C'est une Data URL, on peut la jouer directement
                const audio = new Audio(soundUrl);
                if (window.appManager && window.appManager.settings) {
                    audio.volume = window.appManager.settings.volume / 100;
                } else {
                    audio.volume = 0.7;
                }
                audio.play().then(() => {
                    console.log('🔊 Son joué (personnalisé):', soundFile);
                }).catch(error => {
                    console.warn('⚠️ Erreur lecture son:', error);
                });
            } else {
                // C'est une URL d'extension, utiliser fetch
                fetch(soundUrl)
                    .then(response => response.blob())
                    .then(blob => {
                        // Créer une URL blob
                        const blobUrl = URL.createObjectURL(blob);
                        
                        // Créer un nouvel Audio element avec l'URL blob
                        const audio = new Audio(blobUrl);
                        
                        // Utiliser les paramètres globaux si possible
                        if (window.appManager && window.appManager.settings) {
                            audio.volume = window.appManager.settings.volume / 100;
                        } else {
                            audio.volume = 0.7;
                        }
                        
                        // Jouer le son
                        audio.play().then(() => {
                            console.log('🔊 Son joué (par défaut):', soundFile);
                            // Nettoyer après 5 secondes
                            setTimeout(() => URL.revokeObjectURL(blobUrl), 5000);
                        }).catch(error => {
                            console.warn('⚠️ Erreur lecture son:', error);
                        });
                    })
                    .catch(error => {
                        console.error('❌ Erreur chargement du fichier audio:', error);
                    });
            }
        } catch (error) {
            console.error('❌ Erreur lors de la lecture du son:', error);
        }
        sendResponse({ success: true });
    }
});

// Initialiser l'application au chargement du DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new AuraTabManager();
    });
} else {
    new AuraTabManager();
}
