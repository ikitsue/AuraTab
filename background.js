/**
 * AuraTab - Background Service Worker (Manifest V3)
 * Gestion des événements de navigation, tabs et sons du navigateur
 */

// Configuration des sons
const SOUNDS = {
    TAB_OPEN: 'tab-open.wav',
    TAB_CLOSE: 'tab-close.wav',
    PAGE_RELOAD: 'page-reload.wav'
};

// Stockage des onglets ouverts pour détecter les nouvelles ouvertures
const openTabs = new Set();

// Variables globales
let globalSettings = {
    volume: 70,
    soundEnabled: true,
    soundTabOpen: true,
    soundTabClose: true,
    soundPageReload: false,
    wallpaper: null
};

const soundSpamProtection = {
    tabOpen: 0,
    tabClose: 0,
    pageReload: 0,
    cooldown: 500
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
    // Événement: nouvel onglet ouvert
    chrome.tabs.onCreated.addListener((tab) => {
        handleTabCreated(tab);
    });

    // Événement: onglet fermé
    chrome.tabs.onRemoved.addListener((tabId) => {
        handleTabRemoved(tabId);
    });

    // Événement: page rechargée
    chrome.webNavigation.onBeforeNavigate.addListener((details) => {
        handlePageReload(details);
    }, { url: [{ urlMatches: '.*' }] });

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
 * Gestion: nouvel onglet créé
 */
function handleTabCreated(tab) {
    console.log('📂 Onglet créé:', tab.id);

    // Ne pas jouer le son pour les onglets système
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('brave://'))) {
        return;
    }

    // Jouer le son d'ouverture d'onglet
    if (globalSettings.soundTabOpen && globalSettings.soundEnabled) {
        playSound(SOUNDS.TAB_OPEN);
    }

    // Ajouter l'onglet à la liste
    openTabs.add(tab.id);
}

/**
 * Gestion: onglet fermé
 */
function handleTabRemoved(tabId) {
    console.log('❌ Onglet fermé:', tabId);

    // Jouer le son de fermeture d'onglet
    if (openTabs.has(tabId) && globalSettings.soundTabClose && globalSettings.soundEnabled) {
        playSound(SOUNDS.TAB_CLOSE);
    }

    // Supprimer de la liste
    openTabs.delete(tabId);
}

/**
 * Gestion: rechargement de page
 */
function handlePageReload(details) {
    // Vérifier si c'est un rechargement (frameId === 0 = frame principal)
    if (details.frameId === 0 && details.transitionType === 'reload') {
        console.log('🔄 Page rechargée:', details.tabId);

        if (globalSettings.soundPageReload && globalSettings.soundEnabled) {
            playSound(SOUNDS.PAGE_RELOAD);
        }
    }
}

/**
 * Jouer un son avec protection anti-spam
 * @param {string} soundFile - Nom du fichier son
 */
function playSound(soundFile) {
    // Protection anti-spam
    const now = Date.now();
    const soundKey = soundFile.replace(/\.(mp3|wav)$/, '');
    const lastPlayTime = soundSpamProtection[soundKey] || 0;

    if (now - lastPlayTime < soundSpamProtection.cooldown) {
        console.log('⏱️ Son bloqué (anti-spam):', soundFile);
        return;
    }

    soundSpamProtection[soundKey] = now;

    try {
        // Envoyer un message à tous les tabs pour jouer le son
        // (Service Worker n'a pas accès à Audio API)
        chrome.tabs.query({}, (tabs) => {
            if (!tabs || !Array.isArray(tabs)) {
                console.warn('⚠️ Pas de tabs disponibles');
                return;
            }
            tabs.forEach(tab => {
                // Envoyer le message à chaque tab
                chrome.tabs.sendMessage(tab.id, {
                    action: 'playSoundFromBackground',
                    soundFile: soundFile
                }).catch(() => {
                    // Ignore les erreurs (tab peut ne pas être prêt)
                });
            });
        });

        console.log('🔊 Message de lecture envoyé pour:', soundFile);
    } catch (error) {
        console.error('❌ Erreur lors de l\'envoi du message audio:', error);
    }
}

/**
 * Gestion des messages depuis popup/newtab
 */
function handleMessage(request, sender, sendResponse) {
    console.log('📨 Message reçu:', request.action);

    switch (request.action) {
        case 'playSound':
            playSound(request.soundFile);
            sendResponse({ success: true });
            break;

        case 'getSettings':
            sendResponse({ settings: globalSettings });
            break;

        case 'updateSettings':
            globalSettings = { ...globalSettings, ...request.settings };
            chrome.storage.local.set(globalSettings);
            sendResponse({ success: true, settings: globalSettings });
            break;

        case 'toggleSound':
            globalSettings.soundEnabled = !globalSettings.soundEnabled;
            chrome.storage.local.set({ soundEnabled: globalSettings.soundEnabled });
            sendResponse({ soundEnabled: globalSettings.soundEnabled });
            break;

        case 'testSounds':
            // Tester tous les sons
            if (globalSettings.soundEnabled) {
                setTimeout(() => {
                    if (globalSettings.soundTabOpen) playSound('tab-open.wav');
                }, 200);
                setTimeout(() => {
                    if (globalSettings.soundTabClose) playSound('tab-close.wav');
                }, 800);
                setTimeout(() => {
                    if (globalSettings.soundPageReload) playSound('page-reload.wav');
                }, 1400);
            }
            sendResponse({ success: true });
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
        tabs.forEach(tab => {
            // Ne pas inclure les onglets système
            if (!tab.url.startsWith('chrome://') && !tab.url.startsWith('brave://')) {
                openTabs.add(tab.id);
            }
        });
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
            soundEnabled: true,
            soundTabOpen: true,
            soundTabClose: true,
            soundPageReload: false,
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
