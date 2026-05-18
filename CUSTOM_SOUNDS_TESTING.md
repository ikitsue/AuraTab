# 🧪 Guide de test - Fonctionnalité sons personnalisés

Ce guide vous aide à tester complètement la nouvelle fonctionnalité de sons personnalisés.

## 📋 Checklist de test

### ✅ Test 1 : Interface d'upload

**Étapes** :
1. Ouvrir un nouvel onglet personnalisé AuraTab
2. Cliquer sur ⚙️ en bas à droite (paramètres)
3. Scroller jusqu'à "🎵 Sons personnalisés"

**Résultats attendus** :
- ✅ Section visible avec 3 items (Ouverture, Fermeture, Rechargement)
- ✅ Chaque item a un bouton "📤 Charger un son"
- ✅ Chaque item a un bouton "🔄 Réinitialiser"
- ✅ Le statut initial affiche "Par défaut"

---

### ✅ Test 2 : Upload d'un son

**Préparation** :
- Télécharger un fichier audio (MP3, WAV, OGG) de moins de 2MB
- Durée idéale : 0.5 à 1 seconde

**Étapes** :
1. Cliquer sur "📤 Charger un son" pour "Ouverture onglet"
2. Sélectionner votre fichier audio
3. Attendre la validation

**Résultats attendus** :
- ✅ Notification "✅ Son tab-open personnalisé!" s'affiche
- ✅ Le statut change de "Par défaut" à "✅ Personnalisé"
- ✅ L'interface reste responsive (pas de freeze)

---

### ✅ Test 3 : Limitation de taille

**Étapes** :
1. Créer un fichier audio > 2MB (ou en télécharger un)
2. Essayer de l'uploader dans "Fermeture onglet"
3. Observer le résultat

**Résultats attendus** :
- ✅ Notification "❌ Le fichier est trop volumineux (max 2MB)."
- ✅ Pas d'upload du fichier
- ✅ Statut reste "Par défaut"

---

### ✅ Test 4 : Validation de format

**Étapes** :
1. Essayer d'uploader un fichier non-audio (PDF, TXT, JPG)
2. Observer le résultat

**Résultats attendus** :
- ✅ Notification "❌ Format non supporté. Utilisez MP3, WAV, OGG ou M4A."
- ✅ Pas d'upload du fichier
- ✅ Statut reste "Par défaut"

---

### ✅ Test 5 : Upload de 3 sons différents

**Étapes** :
1. Uploader un son pour "Ouverture onglet"
2. Uploader un son pour "Fermeture onglet"
3. Uploader un son pour "Rechargement"
4. Vérifier que les 3 sont indépendants

**Résultats attendus** :
- ✅ Les 3 sons se chargent correctement
- ✅ Chaque statut affiche "✅ Personnalisé"
- ✅ Pas d'interférence entre les uploads

---

### ✅ Test 6 : Tester les sons (page nouvel onglet)

**Étapes** :
1. Cocher les 3 toggles pour les sons (doivent être ✅ cochés)
2. Vérifier que "État du son" est "Activé"
3. Cliquer sur le bouton "🔉 Tester les sons"

**Résultats attendus** :
- ✅ Notification "🔊 Test des sons..." s'affiche
- ✅ Son d'ouverture se joue (après ~200ms)
- ✅ Son de fermeture se joue (après ~800ms)
- ✅ Son de rechargement se joue (après ~1400ms)
- ✅ Les sons sont dans l'ordre correct avec délais

---

### ✅ Test 7 : Tester les sons (popup)

**Étapes** :
1. Cliquer sur l'icône AuraTab (extension)
2. Scroller jusqu'à "🔊 Tester les sons"
3. Cliquer sur le bouton

**Résultats attendus** :
- ✅ Alerte "🔊 Test des sons en cours..." s'affiche
- ✅ Les sons se jouent (dans l'ordre avec délais)

---

### ✅ Test 8 : Réinitialiser un son

**Étapes** :
1. Avoir un son personnalisé chargé
2. Cliquer sur "🔄 Réinitialiser" pour ce son
3. Vérifier le résultat

**Résultats attendus** :
- ✅ Notification "🔄 Son tab-open réinitialisé" s'affiche
- ✅ Le statut change de "✅ Personnalisé" à "Par défaut"
- ✅ Le son par défaut sera joué à la prochaine utilisation

---

### ✅ Test 9 : Intégration avec les événements réels

**Étapes** :
1. Avoir des sons personnalisés chargés
2. Ouvrir un nouvel onglet (⌘+T ou Ctrl+T)
3. Observer si le son se joue
4. Fermer l'onglet
5. Observer si le son se joue
6. Recharger la page (F5)
7. Observer si le son se joue

**Résultats attendus** :
- ✅ Le son personnalisé se joue à chaque événement
- ✅ Anti-spam fonctionne (500ms minimum entre deux sons identiques)
- ✅ Pas de crash ou erreur

---

### ✅ Test 10 : Toggle du son global

**Étapes** :
1. Avoir des sons personnalisés
2. Cliquer sur "État du son" (passer à "Désactivé")
3. Ouvrir un nouvel onglet
4. Observer si les sons se jouent

**Résultats attendus** :
- ✅ Aucun son ne se joue
- ✅ L'interface passe à "Désactivé"
- ✅ Cliquer à nouveau pour réactiver

---

### ✅ Test 11 : Toggle individuel des sons

**Étapes** :
1. Décocher "Ouverture onglet"
2. Ouvrir un nouvel onglet
3. Observer le résultat
4. Reconcher et tester "Fermeture onglet" et "Rechargement"

**Résultats attendus** :
- ✅ Seuls les sons cochés se jouent
- ✅ Les sons décochés ne se jouent pas
- ✅ Pas d'erreur

---

### ✅ Test 12 : Contrôle du volume

**Étapes** :
1. Charger un son personnalisé
2. Réduire le volume à 30%
3. Tester le son
4. Augmenter à 100%
5. Tester à nouveau

**Résultats attendus** :
- ✅ Le volume change effectivement
- ✅ 30% = très faible
- ✅ 100% = volume normal
- ✅ Pas de distorsion à haut volume

---

### ✅ Test 13 : Persistance des paramètres

**Étapes** :
1. Charger des sons personnalisés
2. Réduire le volume à 40%
3. Fermer le navigateur complètement
4. Rouvrir et ouvrir un nouvel onglet

**Résultats attendus** :
- ✅ Les sons personnalisés sont toujours là
- ✅ Le volume est toujours à 40%
- ✅ Aucune perte de données

---

### ✅ Test 14 : Réinstallation de l'extension

**Étapes** :
1. Charger des sons personnalisés
2. Désinstaller l'extension
3. Réinstaller l'extension
4. Vérifier les paramètres

**Résultats attendus** :
- ✅ Les sons sont réinitialisés (c'est normal, déjà observé avec les wallpapers)
- ✅ Les sons par défaut fonctionnent
- ✅ Pas d'erreur d'initialisation

---

## 🔍 Tests avancés

### Consoles et débogage

**Ouvrir la console de développement** : F12 → Console

**Rechercher** :
- Messages de log pour `playSound()`
- Messages d'erreur d'upload
- Erreurs réseau

**Vérifier** : Pas d'erreur rouge (❌) ou warning (⚠️) relatif aux sons

---

## 📊 Résumé des résultats

| Test | Status | Notes |
|------|--------|-------|
| Interface | ✅ | |
| Upload simple | ✅ | |
| Limite taille | ✅ | |
| Validation format | ✅ | |
| 3 sons différents | ✅ | |
| Test sons (page) | ✅ | |
| Test sons (popup) | ✅ | |
| Réinitialisation | ✅ | |
| Événements réels | ✅ | |
| Toggle global | ✅ | |
| Toggle individuel | ✅ | |
| Volume | ✅ | |
| Persistance | ✅ | |
| Réinstall | ✅ | |

---

## 🎯 Conclusion

Si tous les tests passent ✅, la fonctionnalité est prête à l'emploi !

**Problèmes rencontrés** ? Consultez [CUSTOM_SOUNDS_GUIDE.md](CUSTOM_SOUNDS_GUIDE.md#-dépannage)
