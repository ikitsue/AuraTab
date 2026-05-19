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
            wallpaper: null,
            shortcuts: [],
            searchEngine: 'google'
        };

        this.editingShortcutIndex = null;
        
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
            
            // Afficher les raccourcis personnalisés
            this.renderShortcuts();
            
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
        const searchInput = document.getElementById('search-input');
        
        searchInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const query = e.target.value;
                if (query.trim()) {
                    this.performSearch(query);
                    this.hideSuggestions();
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

        // Fermer les suggestions quand on clique ailleurs
        document.addEventListener('click', (e) => {
            if (e.target !== searchInput && !e.target.closest('.search-suggestions')) {
                this.hideSuggestions();
            }
        });

        // Moteur de recherche
        document.getElementById('search-engine').addEventListener('change', (e) => {
            this.settings.searchEngine = e.target.value;
            this.saveSettings();
        });

        // Bouton Ajouter raccourci (depuis la page)
        document.getElementById('add-shortcut-btn').addEventListener('click', () => {
            this.openShortcutModal();
        });

        // Bouton Ajouter raccourci (depuis les paramètres)
        document.getElementById('add-shortcut-settings-btn').addEventListener('click', () => {
            this.openShortcutModal();
        });

        // Bouton Annuler du modal raccourci
        document.getElementById('cancel-shortcut-btn').addEventListener('click', () => {
            this.closeShortcutModal();
        });

        // Bouton Fermer du modal raccourci
        document.getElementById('close-shortcut-modal-btn').addEventListener('click', () => {
            this.closeShortcutModal();
        });

        // Bouton Enregistrer du modal raccourci
        document.getElementById('save-shortcut-btn').addEventListener('click', () => {
            this.saveShortcut();
        });

        // Fermer le modal en cliquant en dehors
        document.getElementById('shortcut-modal').addEventListener('click', (e) => {
            if (e.target.id === 'shortcut-modal') {
                this.closeShortcutModal();
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
            this.showNotification('❌ Veuillez remplir tous les champs');
            return;
        }

        // Valider l'URL
        try {
            new URL(url);
        } catch (e) {
            this.showNotification('❌ URL invalide');
            return;
        }

        const shortcut = { name, url, icon };

        if (this.editingShortcutIndex !== null) {
            // Modifier un raccourci existant
            this.settings.shortcuts[this.editingShortcutIndex] = shortcut;
            this.showNotification('✅ Raccourci modifié');
        } else {
            // Ajouter un nouveau raccourci
            if (!this.settings.shortcuts) {
                this.settings.shortcuts = [];
            }
            this.settings.shortcuts.push(shortcut);
            this.showNotification('✅ Raccourci ajouté');
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
        document.getElementById('search-engine').value = this.settings.searchEngine;

        // Mettre à jour l'aperçu du fond
        if (this.settings.wallpaper) {
            const previewBox = document.getElementById('preview-wallpaper');
            previewBox.style.backgroundImage = `url(${this.settings.wallpaper})`;
            document.getElementById('wallpaper-info-text').textContent = '✅ Fond personnalisé chargé';
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
