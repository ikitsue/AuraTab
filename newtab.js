/**
 * AuraTab - New Tab Page Logic
 * Manage wallpaper, sound effects, clock and interface
 */

class AuraTabManager {
    constructor() {
        // Store global instance for listener access
        window.appManager = this;

        this.settings = {
            volume: 70,
            showShortcuts: true,
            showWeather: true,
            showTime: true,
            showSeconds: false,
            wallpaper: null,
            shortcuts: [],
            searchEngine: 'google'
        };

        this.editingShortcutIndex = null;
        
        this.init();
    }

    /**
     * Initialize the application
     */
    async init() {
        try {
            // Initialize internationalization first
            await i18n.init();
            
            // Load saved settings
            await this.loadSettings();
            
            // Setup interface events
            this.setupEventListeners();
            
            // Initialize clock
            this.updateClock();
            setInterval(() => this.updateClock(), 1000);
            
            // Load and display wallpaper
            await this.loadWallpaper();
            
            // Display custom shortcuts
            this.renderShortcuts();
            
            // Update interface according to settings
            this.updateUI();
            
            // Load weather for selected location
            await this.loadWeather();
            
            // Refresh weather every 10 minutes
            setInterval(() => this.loadWeather(), 600000);
            
            // Record settings changes
            this.monitorSettings();
            
            console.log('✅ AuraTab initialized successfully');
        } catch (error) {
            console.error('❌ Error during initialization:', error);
        }
    }

    /**
     * Load settings from Chrome storage
     */
    async loadSettings() {
        return new Promise((resolve, reject) => {
            // Try to load from auraTabSettings first (created by settings.js)
            chrome.storage.local.get(['auraTabSettings'], (result) => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }
                
                if (result.auraTabSettings) {
                    // Merge auraTabSettings with default settings
                    this.settings = { ...this.settings, ...result.auraTabSettings };
                } else {
                    // Fallback: load all items (legacy support)
                    chrome.storage.local.get(null, (items) => {
                        this.settings = { ...this.settings, ...items };
                        resolve();
                        return;
                    });
                }
                resolve();
            });
        });
    }

    /**
     * Save settings to Chrome storage
     */
    async saveSettings() {
        return new Promise((resolve, reject) => {
            // Save with auraTabSettings key to be consistent with settings.js
            chrome.storage.local.set({ auraTabSettings: this.settings }, () => {
                if (chrome.runtime.lastError) {
                    reject(chrome.runtime.lastError);
                    return;
                }
                resolve();
            });
        });
    }

    /**
     * Setup event listeners
     */
    setupEventListeners() {
        // Settings button (dedicated page) - Header
        const settingsHeaderBtn = document.getElementById('settings-btn-header');
        if (settingsHeaderBtn) {
            settingsHeaderBtn.addEventListener('click', () => {
                window.location.href = 'settings.html';
            });
        }

        // Settings button (Quick Settings)
        const settingsBtn = document.getElementById('settings-btn');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', () => {
                window.location.href = 'settings.html';
            });
        }

        // Settings button
        const toggleSettingsBtn = document.getElementById('toggle-settings-btn');
        if (toggleSettingsBtn) {
            toggleSettingsBtn.addEventListener('click', () => {
                this.toggleSettings();
            });
        }

        // Close settings button
        const closeSettingsBtn = document.getElementById('close-settings-btn');
        if (closeSettingsBtn) {
            closeSettingsBtn.addEventListener('click', () => {
                this.toggleSettings(false);
            });
        }

        // Close settings by clicking outside
        const settingsModal = document.getElementById('settings-modal');
        if (settingsModal) {
            settingsModal.addEventListener('click', (e) => {
                if (e.target.id === 'settings-modal') {
                    this.toggleSettings(false);
                }
            });
        }

        // Upload wallpaper
        const uploadBtn = document.getElementById('upload-wallpaper-btn');
        if (uploadBtn) {
            uploadBtn.addEventListener('click', () => {
                document.getElementById('wallpaper-input').click();
            });
        }

        const wallpaperInput = document.getElementById('wallpaper-input');
        if (wallpaperInput) {
            wallpaperInput.addEventListener('change', (e) => {
                this.handleWallpaperUpload(e);
            });
        }

        // Remove wallpaper
        const removeWallpaperBtn = document.getElementById('remove-wallpaper-btn');
        if (removeWallpaperBtn) {
            removeWallpaperBtn.addEventListener('click', () => {
                this.removeWallpaper();
            });
        }

        // Interface options
        const showShortcuts = document.getElementById('show-shortcuts');
        if (showShortcuts) {
            showShortcuts.addEventListener('change', (e) => {
                this.settings.showShortcuts = e.target.checked;
                this.updateUI();
                this.saveSettings();
            });
        }

        const showWeather = document.getElementById('show-weather');
        if (showWeather) {
            showWeather.addEventListener('change', (e) => {
                this.settings.showWeather = e.target.checked;
                this.updateUI();
                this.saveSettings();
            });
        }

        const showTime = document.getElementById('show-time');
        if (showTime) {
            showTime.addEventListener('change', (e) => {
                this.settings.showTime = e.target.checked;
                this.updateUI();
                this.saveSettings();
            });
        }

        const showSeconds = document.getElementById('show-seconds');
        if (showSeconds) {
            showSeconds.addEventListener('change', (e) => {
                this.settings.showSeconds = e.target.checked;
                this.updateClock();
                this.saveSettings();
            });
        }

        // Save button
        const saveSettingsBtn = document.getElementById('save-settings-btn');
        if (saveSettingsBtn) {
            saveSettingsBtn.addEventListener('click', () => {
                this.toggleSettings(false);
                this.showNotification(i18n.get('settings_saved'));
            });
        }

        // Barre de recherche
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    const query = e.target.value;
                    if (query.trim()) {
                        this.performSearch(query);
                    }
                }
            });

            searchInput.addEventListener('input', (e) => {
                const query = e.target.value;
                if (query.trim()) {
                    this.fetchSuggestions(query);
                } else {
                    this.hideSuggestions();
                }
            });
        }

        // Fermer les suggestions quand on clique ailleurs
        document.addEventListener('click', (e) => {
            if (e.target !== searchInput && !e.target.closest('.search-suggestions')) {
                this.hideSuggestions();
            }
        });

        // Moteur de recherche
        const searchEngine = document.getElementById('search-engine');
        if (searchEngine) {
            searchEngine.addEventListener('change', (e) => {
                this.settings.searchEngine = e.target.value;
                this.saveSettings();
            });
        }

        // Bouton Ajouter raccourci (depuis la page)
        const addShortcutBtn = document.getElementById('add-shortcut-btn');
        if (addShortcutBtn) {
            addShortcutBtn.addEventListener('click', () => {
                this.openShortcutModal();
            });
        }

        // Bouton Ajouter raccourci (depuis les paramètres)
        const addShortcutSettingsBtn = document.getElementById('add-shortcut-settings-btn');
        if (addShortcutSettingsBtn) {
            addShortcutSettingsBtn.addEventListener('click', () => {
                this.openShortcutModal();
            });
        }

        // Bouton Annuler du modal raccourci
        const cancelShortcutBtn = document.getElementById('cancel-shortcut-btn');
        if (cancelShortcutBtn) {
            cancelShortcutBtn.addEventListener('click', () => {
                this.closeShortcutModal();
            });
        }

        // Bouton Fermer du modal raccourci
        const closeShortcutModalBtn = document.getElementById('close-shortcut-modal-btn');
        if (closeShortcutModalBtn) {
            closeShortcutModalBtn.addEventListener('click', () => {
                this.closeShortcutModal();
            });
        }

        // Bouton Enregistrer du modal raccourci
        const saveShortcutBtn = document.getElementById('save-shortcut-btn');
        if (saveShortcutBtn) {
            saveShortcutBtn.addEventListener('click', () => {
                this.saveShortcut();
            });
        }

        // Fermer le modal en cliquant en dehors
        const shortcutModal = document.getElementById('shortcut-modal');
        if (shortcutModal) {
            shortcutModal.addEventListener('click', (e) => {
                if (e.target.id === 'shortcut-modal') {
                    this.closeShortcutModal();
                }
            });
        }
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
    /**
     * Basculer le son master
     */
    toggleMasterSound() {
        this.saveSettings();
    }

    /**
     * Effectuer une recherche avec le moteur sélectionné
     */
    performSearch(query) {
        const searchEngines = {
            google: 'https://www.google.com/search?q=',
            brave: 'https://search.brave.com/search?q=',
            duckduckgo: 'https://duckduckgo.com/?q=',
            ecosia: 'https://www.ecosia.org/search?q=',
            bing: 'https://www.bing.com/search?q='
        };

        const baseUrl = searchEngines[this.settings.searchEngine] || searchEngines.google;
        window.location.href = baseUrl + encodeURIComponent(query);
    }

    /**
     * Récupérer les suggestions de recherche
     */
    async fetchSuggestions(query) {
        try {
            const suggestions = await this.getSearchSuggestions(query);
            this.displaySuggestions(suggestions, query);
        } catch (error) {
            console.error('Erreur suggestions:', error);
        }
    }

    /**
     * Obtenir les suggestions via l'API
     */
    async getSearchSuggestions(query) {
        try {
            // API de suggestions Google
            const response = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(query)}`);
            const data = await response.json();
            return data[1] || [];
        } catch (error) {
            console.error('Erreur API:', error);
            return [];
        }
    }

    /**
     * Afficher les suggestions
     */
    displaySuggestions(suggestions, query) {
        const suggestionsContainer = document.getElementById('search-suggestions');
        
        if (suggestions.length === 0) {
            this.hideSuggestions();
            return;
        }

        suggestionsContainer.innerHTML = '';
        
        suggestions.slice(0, 8).forEach(suggestion => {
            const item = document.createElement('div');
            item.className = 'search-suggestion-item';
            item.innerHTML = `
                <svg class="search-suggestion-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.35-4.35"></path>
                </svg>
                <span class="search-suggestion-text">${suggestion}</span>
            `;
            
            item.addEventListener('click', () => {
                document.getElementById('search-input').value = suggestion;
                this.performSearch(suggestion);
            });
            
            suggestionsContainer.appendChild(item);
        });
        
        suggestionsContainer.classList.remove('hidden');
    }

    /**
     * Cacher les suggestions
     */
    hideSuggestions() {
        const suggestionsContainer = document.getElementById('search-suggestions');
        suggestionsContainer.classList.add('hidden');
        suggestionsContainer.innerHTML = '';
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
            this.showNotification(i18n.get('format_error'));
            return;
        }

        // Vérifier la taille (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            this.showNotification(i18n.get('file_too_large'));
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
            this.showNotification(i18n.get('wallpaper_load_error'));
        }
    }

    /**
     * Charger et afficher le fond d'écran
     */
    async loadWallpaper() {
        const wallpaperDisplay = document.getElementById('wallpaper-display');
        
        if (this.settings.wallpaper) {
            // Nettoyer le gradient par défaut du CSS
            wallpaperDisplay.style.background = 'none';
            wallpaperDisplay.style.backgroundImage = `url('${this.settings.wallpaper}')`;
            wallpaperDisplay.style.backgroundSize = 'cover';
            wallpaperDisplay.style.backgroundPosition = 'center';
            wallpaperDisplay.style.backgroundRepeat = 'no-repeat';
        } else {
            // Fond par défaut (gradient cyberpunk)
            wallpaperDisplay.style.background = 'linear-gradient(135deg, rgba(0, 217, 255, 0.1) 0%, rgba(131, 56, 236, 0.1) 100%)';
            wallpaperDisplay.style.backgroundSize = 'cover';
            wallpaperDisplay.style.backgroundPosition = 'center';
            wallpaperDisplay.style.backgroundRepeat = 'no-repeat';
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
     * Format time in the selected timezone
     */
    updateClock() {
        const now = new Date();
        
        // Try to get location-based timezone
        this.getSettingsFromStorage().then(settings => {
            const city = settings.city || '';
            
            // Mapping of cities to timezones
            const timezoneMap = {
                // United States
                'New York': 'America/New_York',
                'Los Angeles': 'America/Los_Angeles',
                'Chicago': 'America/Chicago',
                // United Kingdom
                'London': 'Europe/London',
                'Manchester': 'Europe/London',
                'Liverpool': 'Europe/London',
                // France
                'Paris': 'Europe/Paris',
                'Lyon': 'Europe/Paris',
                'Marseille': 'Europe/Paris',
                // Germany
                'Berlin': 'Europe/Berlin',
                'Munich': 'Europe/Berlin',
                'Hamburg': 'Europe/Berlin',
                // Italy
                'Rome': 'Europe/Rome',
                'Milan': 'Europe/Rome',
                'Venice': 'Europe/Rome',
                // Spain
                'Madrid': 'Europe/Madrid',
                'Barcelona': 'Europe/Madrid',
                'Valencia': 'Europe/Madrid',
                // Canada
                'Toronto': 'America/Toronto',
                'Vancouver': 'America/Vancouver',
                'Montreal': 'America/Toronto',
                // Australia
                'Sydney': 'Australia/Sydney',
                'Melbourne': 'Australia/Melbourne',
                'Brisbane': 'Australia/Brisbane',
                // Japan
                'Tokyo': 'Asia/Tokyo',
                'Osaka': 'Asia/Tokyo',
                'Kyoto': 'Asia/Tokyo',
                // China
                'Beijing': 'Asia/Shanghai',
                'Shanghai': 'Asia/Shanghai',
                'Guangzhou': 'Asia/Shanghai',
                // Russia
                'Moscow': 'Europe/Moscow',
                'Saint Petersburg': 'Europe/Moscow',
                'Novosibirsk': 'Asia/Novosibirsk',
                // Brazil
                'São Paulo': 'America/Sao_Paulo',
                'Rio de Janeiro': 'America/Sao_Paulo',
                'Brasília': 'America/Sao_Paulo',
                // Mexico
                'Mexico City': 'America/Mexico_City',
                'Guadalajara': 'America/Mexico_City',
                'Monterrey': 'America/Mexico_City',
                // India
                'Delhi': 'Asia/Kolkata',
                'Mumbai': 'Asia/Kolkata',
                'Bangalore': 'Asia/Kolkata',
                // South Korea
                'Seoul': 'Asia/Seoul',
                'Busan': 'Asia/Seoul',
                'Incheon': 'Asia/Seoul'
            };
            
            const timezone = city && timezoneMap[city] ? timezoneMap[city] : 'UTC';
            
            // Format time in the selected timezone - with or without seconds
            const timeFormatterOptions = {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: timezone
            };
            
            // Add seconds if enabled in settings
            if (settings.showSeconds) {
                timeFormatterOptions.second = '2-digit';
            }
            
            const timeFormatter = new Intl.DateTimeFormat('en-US', timeFormatterOptions);
            
            const timeStr = timeFormatter.format(now);
            document.getElementById('time').textContent = timeStr;
            
            // Format date with current language
            const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
            
            // Map language codes to JavaScript locales
            const localeMap = {
                'fr': 'fr-FR',
                'en': 'en-US',
                'es': 'es-ES',
                'de': 'de-DE',
                'it': 'it-IT',
                'ru': 'ru-RU',
                'zh': 'zh-CN',
                'ja': 'ja-JP',
                'pt': 'pt-BR'
            };
            
            // Get current language from i18n
            let currentLang = 'en';
            if (typeof i18n !== 'undefined' && i18n && i18n.currentLanguage) {
                currentLang = i18n.currentLanguage;
            }
            
            const locale = localeMap[currentLang] || 'en-US';
            
            // Format date in selected timezone
            const dateFormatter = new Intl.DateTimeFormat(locale, {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                timeZone: timezone
            });
            
            const dateStr = dateFormatter.format(now);
            document.getElementById('date').textContent = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
        });
    }

    /**
     * Load weather for selected location
     */
    async loadWeather() {
        try {
            // Get settings from storage
            const settings = await this.getSettingsFromStorage();
            const city = settings.city || '';
            const country = settings.country || '';

            if (!city || !country) {
                // No location selected, hide or show default
                document.getElementById('temp').textContent = '--°C';
                return;
            }

            // Get coordinates for the city
            const coords = await this.getCoordinates(city, country);
            if (!coords) {
                console.error('Could not get coordinates for:', city, country);
                document.getElementById('temp').textContent = '--°C';
                return;
            }

            // Get temperature from Open-Meteo
            const temp = await this.getTemperature(coords.lat, coords.lon);
            if (temp !== null) {
                document.getElementById('temp').textContent = `${temp}°C`;
            } else {
                document.getElementById('temp').textContent = '--°C';
            }
        } catch (error) {
            console.error('Error loading weather:', error);
            document.getElementById('temp').textContent = '--°C';
        }
    }

    /**
     * Get coordinates from city name using Nominatim
     */
    async getCoordinates(city, country) {
        try {
            // Map country codes to country names
            const countryMap = {
                'us': 'United States',
                'gb': 'United Kingdom',
                'fr': 'France',
                'de': 'Germany',
                'it': 'Italy',
                'es': 'Spain',
                'ca': 'Canada',
                'au': 'Australia',
                'jp': 'Japan',
                'cn': 'China',
                'ru': 'Russia',
                'br': 'Brazil',
                'mx': 'Mexico',
                'in': 'India',
                'kr': 'South Korea'
            };

            const countryName = countryMap[country] || country;
            const query = `${city}, ${countryName}`;
            
            const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json`);
            const data = await response.json();

            if (data && data.length > 0) {
                return {
                    lat: parseFloat(data[0].lat),
                    lon: parseFloat(data[0].lon)
                };
            }
            return null;
        } catch (error) {
            console.error('Error getting coordinates:', error);
            return null;
        }
    }

    /**
     * Get temperature from Open-Meteo API
     */
    async getTemperature(lat, lon) {
        try {
            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m&temperature_unit=celsius`
            );
            const data = await response.json();

            if (data && data.current) {
                return Math.round(data.current.temperature_2m);
            }
            return null;
        } catch (error) {
            console.error('Error getting temperature:', error);
            return null;
        }
    }

    /**
     * Get settings from storage
     */
    async getSettingsFromStorage() {
        return new Promise((resolve) => {
            // Try to load from auraTabSettings first
            chrome.storage.local.get(['auraTabSettings'], (result) => {
                if (result.auraTabSettings) {
                    resolve(result.auraTabSettings);
                } else {
                    // Fallback: load all items
                    chrome.storage.local.get(null, (result) => {
                        resolve(result || {});
                    });
                }
            });
        });
    }

    /**
     * Display temporary notification
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
     * Ouvrir le modal pour ajouter/modifier un raccourci
     */
    openShortcutModal(index = null) {
        const modal = document.getElementById('shortcut-modal');
        const title = document.getElementById('shortcut-modal-title');
        const nameInput = document.getElementById('shortcut-name');
        const urlInput = document.getElementById('shortcut-url');
        const iconInput = document.getElementById('shortcut-icon');

        this.editingShortcutIndex = index;

        if (index !== null) {
            // Mode édition
            title.textContent = 'Modifier le raccourci';
            const shortcut = this.settings.shortcuts[index];
            nameInput.value = shortcut.name;
            urlInput.value = shortcut.url;
            iconInput.value = shortcut.icon;
        } else {
            // Mode création
            title.textContent = 'Ajouter un raccourci';
            nameInput.value = '';
            urlInput.value = '';
            iconInput.value = '📌';
        }

        modal.classList.remove('hidden');
        nameInput.focus();
    }

    /**
     * Fermer le modal des raccourcis
     */
    closeShortcutModal() {
        document.getElementById('shortcut-modal').classList.add('hidden');
        this.editingShortcutIndex = null;
    }

    /**
     * Enregistrer un raccourci
     */
    async saveShortcut() {
        const name = document.getElementById('shortcut-name').value.trim();
        const url = document.getElementById('shortcut-url').value.trim();
        const icon = document.getElementById('shortcut-icon').value.trim() || '📌';

        if (!name || !url) {
            this.showNotification(i18n.get('all_fields_required'));
            return;
        }

        // Valider l'URL
        try {
            new URL(url);
        } catch (e) {
            this.showNotification(i18n.get('invalid_url'));
            return;
        }

        const shortcut = { name, url, icon };

        if (this.editingShortcutIndex !== null) {
            // Modifier un raccourci existant
            this.settings.shortcuts[this.editingShortcutIndex] = shortcut;
            this.showNotification(i18n.get('shortcut_edited'));
        } else {
            // Ajouter un nouveau raccourci
            if (!this.settings.shortcuts) {
                this.settings.shortcuts = [];
            }
            this.settings.shortcuts.push(shortcut);
            this.showNotification(i18n.get('shortcut_added'));
        }

        await this.saveSettings();
        this.renderShortcuts();
        this.updateSettingsUI();
        this.closeShortcutModal();
    }

    /**
     * Supprimer un raccourci
     */
    async deleteShortcut(index) {
        if (confirm('Êtes-vous sûr de vouloir supprimer ce raccourci?')) {
            this.settings.shortcuts.splice(index, 1);
            await this.saveSettings();
            this.renderShortcuts();
            this.updateSettingsUI();
            this.showNotification('🗑️ Raccourci supprimé');
        }
    }

    /**
     * Afficher les raccourcis sur la page
     */
    renderShortcuts() {
        const grid = document.getElementById('shortcuts-grid');
        
        // Supprimer tous les raccourcis sauf le bouton "Ajouter"
        const shortcuts = grid.querySelectorAll('a, button:not(#add-shortcut-btn)');
        shortcuts.forEach(el => el.remove());

        // Ajouter les raccourcis personnalisés
        if (this.settings.shortcuts && this.settings.shortcuts.length > 0) {
            this.settings.shortcuts.forEach((shortcut, index) => {
                const container = document.createElement('div');
                container.className = 'shortcut-container';
                
                const card = document.createElement('a');
                card.href = shortcut.url;
                card.className = 'shortcut-card';
                card.title = shortcut.name;
                card.innerHTML = `
                    <div class="shortcut-icon">${shortcut.icon}</div>
                    <span>${shortcut.name}</span>
                `;
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'shortcut-delete-quick';
                deleteBtn.innerHTML = '🗑️';
                deleteBtn.title = 'Supprimer ce raccourci';
                deleteBtn.onclick = (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    this.deleteShortcut(index);
                };
                
                container.appendChild(card);
                container.appendChild(deleteBtn);
                
                // Insérer avant le bouton "Ajouter"
                const addBtn = document.getElementById('add-shortcut-btn');
                grid.insertBefore(container, addBtn);
            });
        }
    }

    /**
     * Mettre à jour l'interface des paramètres
     */
    updateSettingsUI() {
        document.getElementById('show-shortcuts').checked = this.settings.showShortcuts;
        document.getElementById('show-weather').checked = this.settings.showWeather;
        document.getElementById('show-time').checked = this.settings.showTime;
        document.getElementById('show-seconds').checked = this.settings.showSeconds;
        document.getElementById('search-engine').value = this.settings.searchEngine;

        // Mettre à jour l'aperçu du fond
        if (this.settings.wallpaper) {
            const previewBox = document.getElementById('preview-wallpaper');
            previewBox.style.backgroundImage = `url(${this.settings.wallpaper})`;
            document.getElementById('wallpaper-info-text').textContent = i18n.get('wallpaper_loaded');
        }

        // Mettre à jour la liste des raccourcis
        const shortcutsList = document.getElementById('shortcuts-list');
        shortcutsList.innerHTML = '';

        if (this.settings.shortcuts && this.settings.shortcuts.length > 0) {
            this.settings.shortcuts.forEach((shortcut, index) => {
                const item = document.createElement('div');
                item.className = 'shortcut-item';
                item.innerHTML = `
                    <div class="shortcut-item-content">
                        <div class="shortcut-item-icon">${shortcut.icon}</div>
                        <div class="shortcut-item-info">
                            <div class="shortcut-item-name">${shortcut.name}</div>
                            <div class="shortcut-item-url">${shortcut.url}</div>
                        </div>
                    </div>
                    <div class="shortcut-item-actions">
                        <button class="shortcut-edit-btn" onclick="window.appManager.openShortcutModal(${index})">✏️ Éditer</button>
                        <button class="shortcut-delete-btn" onclick="window.appManager.deleteShortcut(${index})">🗑️ Supprimer</button>
                    </div>
                `;
                shortcutsList.appendChild(item);
            });
        }
    }

    /**
     * Watch settings changes
     */
    monitorSettings() {
        // Listen for changes from other tabs
        chrome.storage.onChanged.addListener((changes, areaName) => {
            if (areaName === 'local') {
                // Update settings from auraTabSettings if it changed
                if (changes.auraTabSettings) {
                    this.settings = { ...this.settings, ...changes.auraTabSettings.newValue };
                    this.updateUI();
                    
                    // Reload weather and clock if location changed
                    this.loadWeather();
                    this.updateClock();
                }
                
                // Also handle individual setting changes for backward compatibility
                for (let [key, { newValue }] of Object.entries(changes)) {
                    if (key !== 'auraTabSettings') {
                        this.settings[key] = newValue;
                    }
                }
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
