/**
 * AuraTab - Background Service Worker (Manifest V3)
 * Gestion des événements et paramètres globaux
 */

// Stockage des onglets ouverts
const openTabs = new Set();

// Variables globales
let globalSettings = {
    volume: 70,
    showShortcuts: true,
    showWeather: true,
    showTime: true,
    wallpaper: null
};

/**
 * Initialisation du Service Worker
 */
function initServiceWorker() {
    console.log('🚀 AuraTab Service Worker started');
    
    // Charger les paramètres
    loadSettings();
    
    // Configurer les écouteurs d'événements
    setupEventListeners();
}

/**
 * Charger les paramètres depuis le stockage
 */
function loadSettings() {
    chrome.storage.local.get(null, (items) => {
        if (chrome.runtime.lastError) {
            console.warn('⚠️ Avertissement stockage:', chrome.runtime.lastError.message);
        }
        if (items) {
            globalSettings = { ...globalSettings, ...items };
            console.log('⚙️ Paramètres chargés');
        }
    });
}

/**
 * Configuration des écouteurs d'événements
 */
function setupEventListeners() {
    // Événement: changement de paramètres depuis popup ou newtab
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local') {
            for (let [key, { newValue }] of Object.entries(changes)) {
                globalSettings[key] = newValue;
            }
            console.log('⚙️ Paramètres mis à jour:', globalSettings);
        }
    });

    // Gérer les messages depuis d'autres scripts
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        handleMessage(request, sender, sendResponse);
        return true;
    });
}

/**
 * Gestion des messages depuis popup/newtab
 */
function handleMessage(request, sender, sendResponse) {
    console.log('📨 Message reçu:', request.action);

    switch (request.action) {
        case 'getSettings':
            sendResponse({ settings: globalSettings });
            break;

        case 'updateSettings':
            globalSettings = { ...globalSettings, ...request.settings };
            chrome.storage.local.set(globalSettings);
            sendResponse({ success: true, settings: globalSettings });
            break;

        default:
            sendResponse({ error: 'Action non reconnue' });
    }
}

/**
 * Obtenir les onglets ouverts au démarrage
 */
function initOpenTabs() {
    chrome.tabs.query({}, (tabs) => {
        if (tabs && Array.isArray(tabs)) {
            tabs.forEach(tab => {
                // Ne pas inclure les onglets système
                if (!tab.url.startsWith('chrome://') && !tab.url.startsWith('brave://')) {
                    openTabs.add(tab.id);
                }
            });
        }
        console.log('📊 Onglets ouverts initialisés:', openTabs.size);
    });
}

/**
 * Installateur d'extension (première installation)
 */
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        console.log('🎉 AuraTab installé!');
        
        // Initialiser les paramètres par défaut
        chrome.storage.local.set({
            volume: 70,
            showShortcuts: true,
            showWeather: true,
            showTime: true,
            wallpaper: null
        }, () => {
            console.log('✅ Paramètres par défaut définis');
        });

        // Ouvrir la page d'accueil/configuration
        chrome.tabs.create({ url: 'newtab.html' });
    }

    if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        console.log('🔄 AuraTab mise à jour');
    }
});

/**
 * Démarrage du Service Worker
 * Note: Service Worker n'a pas accès au DOM, initialisation directe
 */
initServiceWorker();
initOpenTabs();

// Re-initialiser les onglets ouverts périodiquement (sécurité)
setInterval(() => {
    chrome.tabs.query({}, (tabs) => {
        if (!tabs || !Array.isArray(tabs)) return;
        
        const currentTabs = new Set();
        tabs.forEach(tab => {
            if (!tab.url.startsWith('chrome://') && !tab.url.startsWith('brave://')) {
                currentTabs.add(tab.id);
            }
        });
        
        // Comparer avec les onglets enregistrés
        for (let tabId of openTabs) {
            if (!currentTabs.has(tabId)) {
                openTabs.delete(tabId);
            }
        }
    });
}, 30000); // Vérification toutes les 30 secondes
