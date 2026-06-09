/**
 * AuraTab - Background Service Worker (Manifest V3)
 * Manages navigation events, tabs, and browser sounds
 */

// Sound configuration
const SOUNDS = {
    TAB_OPEN: 'tab-open.wav',
    TAB_CLOSE: 'tab-close.wav',
    PAGE_RELOAD: 'page-reload.wav'
};

// Track open tabs to detect new openings
const openTabs = new Set();

// Global variables
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
 * Initialize the Service Worker
 */
function initServiceWorker() {
    console.log('🚀 AuraTab Service Worker started');
    
    // Load settings
    loadSettings();
    
    // Setup event listeners
    setupEventListeners();
}

/**
 * Load settings from storage
 */
function loadSettings() {
    chrome.storage.local.get(null, (items) => {
        if (chrome.runtime.lastError) {
            console.warn('⚠️ Storage warning:', chrome.runtime.lastError.message);
        }
        if (items) {
            globalSettings = { ...globalSettings, ...items };
            console.log('⚙️ Settings loaded');
        }
    });
}

/**
 * Setup event listeners
 */
function setupEventListeners() {
    // Event: new tab opened
    chrome.tabs.onCreated.addListener((tab) => {
        handleTabCreated(tab);
    });

    // Event: tab closed
    chrome.tabs.onRemoved.addListener((tabId) => {
        handleTabRemoved(tabId);
    });

    // Event: page reloaded
    chrome.webNavigation.onBeforeNavigate.addListener((details) => {
        handlePageReload(details);
    }, { url: [{ urlMatches: '.*' }] });

    // Event: settings changed from popup or newtab
    chrome.storage.onChanged.addListener((changes, areaName) => {
        if (areaName === 'local') {
            for (let [key, { newValue }] of Object.entries(changes)) {
                globalSettings[key] = newValue;
            }
            console.log('⚙️ Settings updated:', globalSettings);
        }
    });

    // Handle messages from other scripts
    chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
        handleMessage(request, sender, sendResponse);
        return true;
    });
}

/**
 * Handle: new tab created
 */
function handleTabCreated(tab) {
    // Don't play sound for system tabs
    if (tab.url && (tab.url.startsWith('chrome://') || tab.url.startsWith('brave://'))) {
        return;
    }

    // Play tab open sound
    if (globalSettings.soundTabOpen && globalSettings.soundEnabled) {
        playSound(SOUNDS.TAB_OPEN);
    }

    // Add tab to list
    openTabs.add(tab.id);
}

/**
 * Handle: tab closed
 */
function handleTabRemoved(tabId) {
    // Play tab close sound
    if (openTabs.has(tabId) && globalSettings.soundTabClose && globalSettings.soundEnabled) {
        playSound(SOUNDS.TAB_CLOSE);
    }

    // Remove from list
    openTabs.delete(tabId);
}

/**
 * Handle: page reload
 */
function handlePageReload(details) {
    // Check if it's a reload (frameId === 0 = main frame)
    if (details.frameId === 0 && details.transitionType === 'reload') {
        if (globalSettings.soundPageReload && globalSettings.soundEnabled) {
            playSound(SOUNDS.PAGE_RELOAD);
        }
    }
}

/**
 * Play a sound with spam protection
 * @param {string} soundFile - Sound file name
 */
function playSound(soundFile) {
    // Spam protection
    const now = Date.now();
    const soundKey = soundFile.replace(/\.(mp3|wav)$/, '');
    const lastPlayTime = soundSpamProtection[soundKey] || 0;

    if (now - lastPlayTime < soundSpamProtection.cooldown) {
        return;
    }

    soundSpamProtection[soundKey] = now;

    try {
        // Send message to all tabs to play sound
        // (Service Worker doesn't have access to Audio API)
        chrome.tabs.query({}, (tabs) => {
            if (!tabs || !Array.isArray(tabs)) {
                console.warn('⚠️ No tabs available');
                return;
            }
            tabs.forEach(tab => {
                // Send message to each tab
                chrome.tabs.sendMessage(tab.id, {
                    action: 'playSoundFromBackground',
                    soundFile: soundFile
                }).catch(() => {
                    // Ignore errors (tab may not be ready)
                });
            });
        });
    } catch (error) {
        console.error('❌ Error sending audio message:', error);
    }
}

/**
 * Handle messages from popup/newtab
 */
function handleMessage(request, sender, sendResponse) {
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
            // Test all sounds
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
            sendResponse({ error: 'Unknown action' });
    }
}

/**
 * Get open tabs on startup
 */
function initOpenTabs() {
    chrome.tabs.query({}, (tabs) => {
        tabs.forEach(tab => {
            // Don't include system tabs
            if (!tab.url.startsWith('chrome://') && !tab.url.startsWith('brave://')) {
                openTabs.add(tab.id);
            }
        });
        console.log('📊 Open tabs initialized:', openTabs.size);
    });
}

/**
 * Extension installer (first installation)
 */
chrome.runtime.onInstalled.addListener((details) => {
    if (details.reason === chrome.runtime.OnInstalledReason.INSTALL) {
        console.log('🎉 AuraTab installed!');
        
        // Initialize default settings
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
            console.log('✅ Default settings initialized');
        });

        // Open home/setup page
        chrome.tabs.create({ url: 'newtab.html' });
    }

    if (details.reason === chrome.runtime.OnInstalledReason.UPDATE) {
        console.log('🔄 AuraTab updated');
    }
});

/**
 * Service Worker startup
 * Note: Service Worker doesn't have DOM access, direct initialization
 */
initServiceWorker();
initOpenTabs();

// Re-initialize open tabs periodically (safety check)
setInterval(() => {
    chrome.tabs.query({}, (tabs) => {
        const currentTabs = new Set();
        tabs.forEach(tab => {
            if (!tab.url.startsWith('chrome://') && !tab.url.startsWith('brave://')) {
                currentTabs.add(tab.id);
            }
        });
        
        // Compare with registered tabs
        for (let tabId of openTabs) {
            if (!currentTabs.has(tabId)) {
                openTabs.delete(tabId);
            }
        }
    });
}, 30000); // Check every 30 seconds
