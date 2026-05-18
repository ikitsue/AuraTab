# ❓ FAQ - AuraTab

## Questions Générales

### Q1: Est-ce que AuraTab fonctionne avec tous les navigateurs?

**R**: AuraTab est compatible avec:
- ✅ Google Chrome 88+
- ✅ Brave Browser (tous les versions récentes)
- ✅ Microsoft Edge (Chromium-based)
- ✅ Opera (Chromium-based)

Les navigateurs basés sur Chromium avec support Manifest V3.

### Q2: Mes données sont-elles sécurisées?

**R**: Oui, totalement:
- Les données sont stockées localement avec `chrome.storage.local`
- Aucune donnée n'est envoyée vers des serveurs externes
- AuraTab n'a accès qu'aux URLs dans les permissions
- Aucun tracking ou télémétrie

### Q3: Puis-je utiliser AuraTab en mode incognito?

**R**: Non par défaut, mais vous pouvez l'activer:
1. `chrome://extensions`
2. Cliquez "Détails" sur AuraTab
3. Cochez "Autoriser en navigation privée"

### Q4: L'extension ralentit mon navigateur?

**R**: Non, AuraTab est optimisé:
- Service Worker inactif quand pas utilisé
- Pas d'impact sur les performances du navigateur
- Utilisation mémoire < 50MB
- Chargement d'images optimisé

### Q5: Puis-je désinstaller AuraTab?

**R**: Bien sûr:
1. `chrome://extensions`
2. Trouvez AuraTab
3. Cliquez "Supprimer"

Les paramètres sont automatiquement nettoyés.

---

## Problèmes Courants

### ❌ Problème: "Extension ne s'affiche pas"

**Causes possibles**:
1. Mode développeur non activé
2. Mauvais chemin du dossier
3. Fichiers corrompus

**Solutions**:
```javascript
// Vérifier l'onglet "Détails" pour les erreurs
chrome://extensions > AuraTab > Détails > Erreurs
```

### ❌ Problème: "Les sons ne se jouent pas"

**Causes**:
- Fichiers MP3 placeholder non remplacés
- Volume à 0%
- Son master désactivé
- Autoplay bloqué

**Solutions**:
1. Remplacer les fichiers dans `sounds/`:
   - `tab-open.mp3`
   - `tab-close.mp3`
   - `page-reload.mp3`
2. Vérifier le volume dans la popup (min 20%)
3. Vérifier que "Tous les sons" est activé
4. Vérifier les permissions audio du navigateur

### ❌ Problème: "Le fond ne s'affiche pas"

**Causes**:
- Format non supporté
- Fichier trop volumineux (>5MB)
- Chemin d'accès incorrect

**Solutions**:
```javascript
// Formats autorisés:
- PNG (.png)
- JPEG (.jpg, .jpeg)
- GIF animé (.gif)

// Taille max: 5MB
// Résolution recommandée: 1920x1080 ou 2560x1440
```

### ❌ Problème: "Erreur 'chrome.storage.local' indéfini"

**Cause**: Script exécuté dans un contexte invalide

**Solution**:
```javascript
// ✅ Bon (newtab.js ou popup.js):
chrome.storage.local.get(null, (items) => { ... });

// ❌ Mauvais (content script):
// chrome.storage n'est pas accessible
```

### ❌ Problème: "Popup n'ouvre pas"

**Causes**:
- Fichier `popup.html` manquant
- Référence JSON incorrecte dans manifest
- Droits d'accès insuffisants

**Solutions**:
1. Vérifier que `popup.html` existe
2. Vérifier manifest.json:
```json
"action": {
  "default_popup": "popup.html"
}
```

### ❌ Problème: "Manifest V3 incompatible"

**Cause**: Utilisation d'APIs dépréciées

**Solutions**:
```javascript
// ❌ Éviter (Manifest V2):
- chrome.tabs.executeScript()
- chrome.webRequest
- content_scripts pour newtab

// ✅ Utiliser (Manifest V3):
- Service Worker (background.js)
- chrome.webNavigation
- chrome_url_overrides
```

---

## Performance & Optimisation

### Q: Comment optimiser l'utilisation mémoire?

**R**:
1. Limiter la taille des images GIF (< 2MB)
2. Utiliser des images PNG/JPG compressées
3. Fermer les onglets inutilisés
4. Vérifier "Désactiver l'extension" si non utilisée

### Q: Peut-on avoir plusieurs fonds d'écran?

**R**: Non actuellement, mais vous pouvez:
1. Utiliser un GIF animé pour plusieurs images
2. Remplacer le fond manuellement
3. Utiliser des widgets externes

### Q: Comment faire des sons personnalisés?

**R**: Avec Audacity (gratuit):
1. Télécharger Audacity
2. Ouvrir ou créer un nouveau projet
3. Générer un ton (Générer → Ton/Bruit)
4. Exporter en MP3 (Fichier → Exporter → MP3)
5. Remplacer les fichiers dans `sounds/`

---

## Développement

### Q: Comment modifier les couleurs?

**R**: Éditer `newtab-style.css`:
```css
:root {
    --primary-color: #00d9ff;        /* Couleur primaire */
    --secondary-color: #ff006e;      /* Couleur secondaire */
    --tertiary-color: #8338ec;       /* Couleur tertiaire */
    --background-dark: #0a0e27;      /* Fond sombre */
}
```

### Q: Comment ajouter de nouveaux raccourcis?

**R**: Éditer `newtab.html`:
```html
<a href="https://exemple.com" class="shortcut-card">
    <div class="shortcut-icon">🌐</div>
    <span>Mon Site</span>
</a>
```

### Q: Comment changer le thème?

**R**: Plusieurs approches:
1. Éditer les CSS variables
2. Créer un thème dans les paramètres
3. Utiliser des thèmes externes

---

## Compatibilité

### Q: Fonctionne sur macOS?

**R**: Oui, Chrome/Brave est disponible sur macOS

### Q: Fonctionne sur Linux?

**R**: Oui, Chrome/Brave est disponible sur Linux

### Q: Fonctionne sur Android?

**R**: Non, Android utilise une version différente de Chrome
(Version Chromium mais avec limitations)

---

## Sécurité & Confidentialité

### Q: L'extension lit-elle mes données personnelles?

**R**: Non:
- AuraTab n'a pas accès à votre historique
- N'a pas accès à vos cookies
- N'a pas accès à vos identifiants
- Ne lit que les events de navigation (pour les sons)

### Q: Puis-je me fier aux permissions demandées?

**R**: Oui:
- `storage`: Sauvegarde des paramètres locaux
- `tabs`: Pour la détection d'ouverture d'onglets
- `webNavigation`: Pour la détection de rechargement

Chaque permission est nécessaire.

### Q: Est-ce open source?

**R**: Oui, consultez le dépôt GitHub pour le code source complet

---

## Support & Aide

### Je n'ai pas trouvé ma réponse...

1. **Consulter la Documentation**: `README.md`
2. **Vérifier les Erreurs**: Chrome DevTools (F12)
3. **Contacter le Support**: 
   - GitHub Issues
   - Email de contact

### Comment contribuer?

Consultez `CONTRIBUTING.md` pour:
- Rapporter des bugs
- Proposer des fonctionnalités
- Soumettre des pull requests

---

## Lexique

| Terme | Définition |
|-------|-----------|
| **Manifest V3** | Version 3 du manifest des extensions Chromium (standard actuel) |
| **Service Worker** | Script d'arrière-plan sans DOM qui gère les événements |
| **Chrome Storage** | API pour stocker les données localement |
| **Web Accessible Resources** | Ressources (images, sons) accessibles à partir des pages |
| **GIF Animé** | Image au format GIF avec animations (plusieurs frames) |
| **Data URL** | Représentation base64 d'un fichier en URL |
| **Anti-Spam** | Système pour éviter les actions répétées trop souvent |
| **Cyberpunk** | Style esthétique futuriste avec couleurs vives |

---

## Ressources Externes

- [Chrome Extensions Docs](https://developer.chrome.com/docs/extensions/)
- [Manifest V3 Guide](https://developer.chrome.com/docs/extensions/mv3/)
- [Web APIs](https://developer.mozilla.org/en-US/docs/Web/API)
- [Chrome Storage API](https://developer.chrome.com/docs/extensions/reference/storage/)

---

## Version FAQ

| Date | Version | Mises à jour |
|------|---------|-------------|
| 18/05/2026 | 1.0.0 | Version initiale |

---

*Dernière mise à jour: 18/05/2026*
*Besoin d'aide? Consultez le README.md ou créez une issue GitHub*
