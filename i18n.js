/**
 * AuraTab - Internationalization (i18n) Manager
 * Manages multi-language support for all UI elements
 */

class I18n {
    constructor() {
        this.translations = {};
        this.currentLanguage = 'en';
        this.defaultLanguage = 'en';
        this.supportedLanguages = ['en', 'fr', 'ru', 'zh', 'es'];
    }

    /**
     * Initialize i18n system
     */
    async init() {
        try {
            // Load translations
            await this.loadTranslations();
            
            // Load saved language preference from storage
            await this.loadLanguagePreference();
            
            // Apply translations to DOM
            this.updateAllTranslations();
        } catch (error) {
            console.error('Error initializing i18n:', error);
        }
    }

    /**
     * Load translations from translations.json
     */
    async loadTranslations() {
        try {
            const response = await fetch('translations.json');
            this.translations = await response.json();
        } catch (error) {
            console.error('Error loading translations:', error);
        }
    }

    /**
     * Load language preference from storage
     */
    async loadLanguagePreference() {
        return new Promise((resolve) => {
            chrome.storage.local.get('language', (result) => {
                if (result.language && this.supportedLanguages.includes(result.language)) {
                    this.currentLanguage = result.language;
                }
                resolve();
            });
        });
    }

    /**
     * Save language preference to storage
     */
    saveLanguagePreference() {
        chrome.storage.local.set({ language: this.currentLanguage });
    }

    /**
     * Get translated text for a key
     * @param {string} key - Translation key
     * @param {string} language - Language code (optional, uses current language)
     * @returns {string} Translated text or key if not found
     */
    get(key, language = this.currentLanguage) {
        const lang = language || this.currentLanguage;
        
        if (this.translations[lang] && this.translations[lang][key]) {
            return this.translations[lang][key];
        }
        
        // Fallback to English if translation not found
        if (this.translations['en'] && this.translations['en'][key]) {
            return this.translations['en'][key];
        }
        
        console.warn(`Translation missing for key: ${key} in language: ${lang}`);
        return key;
    }

    /**
     * Set current language
     * @param {string} language - Language code (en, fr, ru, zh, es)
     */
    setLanguage(language) {
        if (this.supportedLanguages.includes(language)) {
            this.currentLanguage = language;
            this.saveLanguagePreference();
            this.updateAllTranslations();
        } else {
            console.warn(`Unsupported language: ${language}`);
        }
    }

    /**
     * Update all translations in DOM
     */
    updateAllTranslations() {
        // Update page title
        document.title = this.get('title');

        // Update all elements with data-i18n attribute
        document.querySelectorAll('[data-i18n]').forEach((element) => {
            const key = element.getAttribute('data-i18n');
            const translation = this.get(key);
            
            if (element.tagName === 'INPUT') {
                element.placeholder = translation;
            } else if (element.tagName === 'BUTTON' || element.tagName === 'LABEL') {
                // Skip buttons that contain SVG (icon-only buttons)
                if (element.querySelector('svg')) {
                    return;
                }
                element.textContent = translation;
            } else {
                element.textContent = translation;
            }
        });

        // Update document language
        document.documentElement.lang = this.currentLanguage;
        
        // Update clock to reflect language change
        if (window.appManager && typeof window.appManager.updateClock === 'function') {
            window.appManager.updateClock();
        }
    }

    /**
     * Translate element's data-i18n attribute
     * @param {HTMLElement} element - Element to translate
     */
    translateElement(element) {
        const key = element.getAttribute('data-i18n');
        if (!key) return;

        const translation = this.get(key);
        
        if (element.tagName === 'INPUT') {
            element.placeholder = translation;
        } else if (element.tagName === 'BUTTON' || element.tagName === 'LABEL') {
            // Skip buttons that contain SVG (icon-only buttons)
            if (element.querySelector('svg')) {
                return;
            }
            element.textContent = translation;
        } else {
            element.textContent = translation;
        }
    }

    /**
     * Get all supported languages
     */
    getLanguages() {
        return this.supportedLanguages;
    }

    /**
     * Get current language
     */
    getCurrentLanguage() {
        return this.currentLanguage;
    }
}

// Create global i18n instance
const i18n = new I18n();
