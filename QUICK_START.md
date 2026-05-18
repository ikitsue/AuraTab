# ⚡ QUICK START - AuraTab

> Installation et utilisation en 5 minutes

---

## 🚀 Étapes d'Installation

### Étape 1: Préparer le dossier

```bash
# Le dossier AuraTab contient déjà tous les fichiers nécessaires
cd "c:\Users\ikits\Desktop\document\projet code\.extension-google\AuraTab"

# Vérifier la structure (lisez STRUCTURE.txt si besoin)
```

### Étape 2: Ouvrir le gestionnaire d'extensions

**Chrome**:
- URL: `chrome://extensions`
- Raccourci: Ctrl+Shift+X

**Brave**:
- URL: `brave://extensions`
- Raccourci: Ctrl+Shift+X

### Étape 3: Activer le Mode Développeur

```
- Cliquez le bouton "Mode développeur" en haut à droite
- Le bouton change de couleur (devient actif)
```

### Étape 4: Charger l'extension

```
1. Cliquez "Charger l'extension non empaquetée"
2. Sélectionnez le dossier "AuraTab"
3. Cliquez "Sélectionner le dossier"
```

### Étape 5: Vérification

✅ L'extension apparaît dans la liste
✅ Icon AuraTab visible dans la barre d'outils
✅ Ouvrir un nouvel onglet → Interface personnalisée

---

## 🎯 Utilisation Immédiate

### Ouvrir le Nouvel Onglet Personnalisé

```
Ctrl+T (Windows/Linux)
Cmd+T (macOS)
```

**Vous verrez:**
- Horloge numérique
- Barre de recherche Google
- Raccourcis rapides
- Boutons de contrôle

### Accéder aux Paramètres

**Méthode 1: Depuis le Nouvel Onglet**
```
1. Cliquez le bouton ⚙️ en bas à droite
2. Le panneau "Paramètres" s'ouvre
```

**Méthode 2: Depuis la Popup**
```
1. Cliquez l'icône AuraTab dans la barre d'outils
2. La popup s'affiche
```

---

## 🎨 Configuration de Base

### Charger un Fond d'Écran

```
1. Ouvrez les Paramètres (⚙️)
2. Trouvez la section "🎨 Fond d'écran"
3. Cliquez "📤 Charger un fond"
4. Sélectionnez une image:
   - PNG, JPG, ou GIF animé
   - Taille max: 5MB
5. Le fond s'affiche automatiquement
```

### Gérer les Sons

```
1. Ouvrez les Paramètres ou la Popup
2. Section "🔊 Effets sonores"
3. Contrôles disponibles:
   ✓ Ouverture d'onglet (toggle)
   ✓ Fermeture d'onglet (toggle)
   ✓ Rechargement (toggle)
   ✓ Tous les sons (toggle master)
   ✓ Volume (curseur 0-100%)
```

### Régler le Volume

```
1. Dans les Paramètres
2. Trouvez "Volume:"
3. Glissez le curseur (0-100%)
4. La valeur s'affiche en pourcentage
```

---

## ⚠️ Important: Fichiers Sons Placeholder

**Les fichiers sons sont des PLACEHOLDERS**

Vous devez les remplacer avec de vrais fichiers MP3:

**Dossier**: `sounds/`

**Fichiers à remplacer**:
- `tab-open.mp3` - Son ouverture onglet
- `tab-close.mp3` - Son fermeture onglet
- `page-reload.mp3` - Son rechargement

**Comment générer les sons** (Audacity - Gratuit):

```
1. Télécharger Audacity (audacityteam.org)
2. Nouveau projet → Générer → Ton/Bruit
3. Paramètres suggérés:
   - Fréquence: 1000-2000 Hz
   - Amplitude: 0.5
   - Durée: 0.3-0.5 secondes
4. Exporter → MP3
5. Renommer et placer dans sounds/
```

**Ou utiliser des sons existants**:
```
- Télécharger depuis:
  - Freesound.org
  - Zapsplat.com
  - Mixkit.co
- Placer dans dossier sounds/
- Renommer selon les fichiers
```

---

## 🧪 Test de Fonctionnement

### Test 1: Interface Nouvel Onglet
```
✅ Ouvrir nouvel onglet (Ctrl+T)
✅ Horloge affichée
✅ Barre de recherche visible
✅ Raccourcis visibles
```

### Test 2: Configuration
```
✅ Ouvrir Paramètres (⚙️)
✅ Popup s'affiche correctement
✅ Toggles réagissent
✅ Curseur volume fonctionne
```

### Test 3: Fond d'Écran
```
✅ Charger une image (test.jpg)
✅ Image s'affiche après upload
✅ Persiste après rechargement (F5)
✅ Bouton supprimer fonctionne
```

### Test 4: Sons (si remplacés)
```
✅ Ouvrir nouvel onglet (son?)
✅ Fermer l'onglet (son?)
✅ Recharger page (F5) (son?)
✅ Volume ajustable
```

---

## 🔧 Dépannage Rapide

### Problème: Extension ne s'affiche pas
**Solution**:
```
1. Chrome/Brave → Extensions
2. Vérifier Mode développeur ✓
3. Recharger l'extension (F5)
4. Réinstaller si nécessaire
```

### Problème: Nouvel onglet ne change pas
**Solution**:
```
1. Vérifier que l'extension est activée
2. Supprimer le cache (Ctrl+Maj+Suppr)
3. Ouvrir nouvel onglet (Ctrl+T)
4. Si besoin, redémarrer navigateur
```

### Problème: Sons ne se jouent pas
**Solution**:
```
1. Vérifier que fichiers MP3 existent
   → sounds/tab-open.mp3, etc.
2. Vérifier le volume (> 0%)
3. Vérifier toggles activés
4. Voir console (F12) pour erreurs
```

### Problème: Fond ne s'affiche pas
**Solution**:
```
1. Format: PNG, JPG, GIF ✓
2. Taille: < 5MB ✓
3. Chemins valides ✓
4. Recharger extension
5. Supprimer et recharger fond
```

---

## 📱 Raccourcis Clavier

| Raccourci | Action |
|-----------|--------|
| Ctrl+T | Nouvel onglet (AuraTab) |
| Ctrl+N | Nouvelle fenêtre |
| Ctrl+Maj+N | Fenêtre incognito |
| Ctrl+Maj+X | Extensions (Chrome) |
| Ctrl+Maj+J | DevTools console |
| F5 | Recharger page |
| Ctrl+Maj+Suppr | Vider cache |

---

## 📁 Structure des Fichiers

```
AuraTab/
├── manifest.json                 ← Configuration
├── background.js                 ← Service Worker
├── newtab.html, .js, -style.css  ← Nouvel onglet
├── popup.html, .js, -style.css   ← Configuration popup
├── sounds/                        ← Fichiers MP3
│   ├── tab-open.mp3 (placeholder)
│   ├── tab-close.mp3 (placeholder)
│   └── page-reload.mp3 (placeholder)
├── images/                        ← Icônes
│   ├── icon-16.png
│   ├── icon-48.png
│   └── icon-128.png
├── wallpapers/                    ← Fonds
│   └── default-wallpaper.svg
└── README.md                      ← Documentation
```

---

## 📖 Documentation Complète

Pour plus de détails, consultez:

- **README.md** - Documentation complète
- **MANIFEST_V3_VERIFICATION.md** - Validation technique
- **FAQ.md** - Questions fréquentes
- **CHANGELOG.md** - Historique des mises à jour

---

## ✅ Checklist Démarrage

- [ ] Dossier AuraTab téléchargé
- [ ] Chrome/Brave ouvert sur `chrome://extensions`
- [ ] Mode développeur activé
- [ ] Extension chargée (Load unpacked)
- [ ] Extension visible dans la liste
- [ ] Nouvel onglet (Ctrl+T) affiche AuraTab
- [ ] Paramètres accessibles (⚙️)
- [ ] Fond d'écran testé
- [ ] Sons remplacés (optionnel mais recommandé)

---

## 🎉 Prêt à Utiliser!

Votre extension AuraTab est maintenant installée et fonctionnelle!

**Que faire ensuite?**

1. **Personnaliser**: Charger vos fonds d'écran préférés
2. **Configurer**: Régler les sons et paramètres
3. **Améliorer**: Ajouter des sons MP3 réels
4. **Développer**: Modifier le code pour vos besoins
5. **Partager**: Distribuer l'extension aux autres

---

## 🆘 Besoin d'Aide?

1. Consulter le **README.md** complet
2. Vérifier la **FAQ.md**
3. Voir les erreurs dans **Chrome DevTools** (F12)
4. Créer une issue sur GitHub

---

**Bon voyage avec AuraTab! 🚀✨**

*Dernière mise à jour: 18/05/2026*
*Version: 1.0.0*
