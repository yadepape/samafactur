# Guide d'Installation SamaFacture

Ce guide vous accompagne dans l'installation et la configuration de SamaFacture sur votre machine.

## 📋 Prérequis Système

### Configuration Minimale
- **OS** : Windows 10+, macOS 10.14+, ou Linux (Ubuntu 18.04+)
- **RAM** : 4 GB minimum, 8 GB recommandé
- **Stockage** : 500 MB d'espace libre
- **Résolution** : 1280x720 minimum

### Pour le Développement
- **Node.js** : Version 16.0 ou supérieure
- **npm** : Version 7.0 ou supérieure (inclus avec Node.js)
- **Git** : Pour cloner le repository

## 🚀 Installation Rapide (Utilisateur Final)

### Option 1 : Téléchargement Direct
1. Rendez-vous sur la page des [Releases](https://github.com/yadepape/samafacture/releases)
2. Téléchargez la version correspondant à votre système :
   - **Windows** : `SamaFacture-Setup-1.0.0.exe`
   - **macOS** : `SamaFacture-1.0.0.dmg`
   - **Linux** : `SamaFacture-1.0.0.AppImage`

### Option 2 : Installation Windows
1. Double-cliquez sur `SamaFacture-Setup-1.0.0.exe`
2. Suivez l'assistant d'installation
3. Choisissez le dossier d'installation (par défaut : `C:\\Program Files\\SamaFacture`)
4. Créez un raccourci bureau si souhaité
5. Lancez SamaFacture depuis le menu Démarrer

### Option 3 : Installation macOS
1. Ouvrez le fichier `SamaFacture-1.0.0.dmg`
2. Glissez l'icône SamaFacture vers le dossier Applications
3. Lancez SamaFacture depuis Launchpad ou Applications
4. Si macOS bloque l'application : Préférences Système > Sécurité > Autoriser

### Option 4 : Installation Linux
1. Rendez le fichier exécutable : `chmod +x SamaFacture-1.0.0.AppImage`
2. Double-cliquez ou exécutez : `./SamaFacture-1.0.0.AppImage`
3. L'application se lance directement (portable)

## 🛠️ Installation pour Développeurs

### 1. Clonage du Repository
```bash
# HTTPS
git clone https://github.com/yadepape/samafacture.git

# SSH (si configuré)
git clone git@github.com:yadepape/samafacture.git

# Entrer dans le dossier
cd samafacture
```

### 2. Installation des Dépendances
```bash
# Avec npm
npm install

# Ou avec yarn
yarn install
```

### 3. Vérification de l'Installation
```bash
# Vérifier Node.js
node --version  # Doit afficher v16.0.0 ou supérieur

# Vérifier npm
npm --version   # Doit afficher 7.0.0 ou supérieur

# Vérifier les dépendances
npm list --depth=0
```

### 4. Premier Lancement
```bash
# Mode développement (recommandé)
npm run dev

# Ou séparément
npm run dev:web     # Interface web uniquement
npm run dev:electron # Application Electron uniquement
```

## 🔧 Configuration Initiale

### 1. Activation de la Licence
Au premier lancement :
1. Une modal de licence apparaît
2. Cliquez sur **"Générer une clé"** pour une licence de 30 jours
3. Ou entrez une clé existante si vous en avez une
4. Cliquez sur **"Activer"**

### 2. Configuration de l'Entreprise
1. Allez dans **Paramètres** (icône engrenage)
2. Remplissez les informations de votre entreprise :
   - Nom de l'entreprise
   - Logo (optionnel)
   - Adresse
   - Téléphone et email
   - Numéro fiscal (NINEA)

### 3. Paramètres Initiaux
- **Devise** : XOF (Franc CFA) par défaut
- **Langue** : Français
- **Thème** : Clair (basculable vers sombre)
- **Taux de TVA** : 18% par défaut

## 🏗️ Build et Distribution

### Build pour Production
```bash
# Build complet (Web + Electron)
npm run build

# Build web uniquement
npm run build:web

# Build Electron uniquement
npm run build:electron
```

### Création d'Installateurs
```bash
# Toutes les plateformes
npm run dist

# Windows uniquement
npm run dist:win

# macOS uniquement  
npm run dist:mac

# Linux uniquement
npm run dist:linux

# Package sans installateur
npm run pack
```

### Fichiers Générés
Les fichiers seront créés dans `dist/` :
- **Windows** : `.exe` (installateur NSIS)
- **macOS** : `.dmg` (image disque)
- **Linux** : `.AppImage` (portable)

## 🔍 Résolution de Problèmes

### Problèmes Courants

#### 1. Erreur "Node.js version incompatible"
```bash
# Vérifier la version
node --version

# Mettre à jour Node.js
# Télécharger depuis https://nodejs.org
```

#### 2. Erreur "npm install failed"
```bash
# Nettoyer le cache
npm cache clean --force

# Supprimer node_modules et réinstaller
rm -rf node_modules package-lock.json
npm install
```

#### 3. Erreur "Electron failed to start"
```bash
# Réinstaller Electron
npm uninstall electron
npm install electron --save-dev
```

#### 4. Base de données corrompue
1. Fermer l'application
2. Supprimer les données : 
   - **Windows** : `%APPDATA%\\SamaFacture`
   - **macOS** : `~/Library/Application Support/SamaFacture`
   - **Linux** : `~/.config/SamaFacture`
3. Relancer l'application

#### 5. Licence expirée
```javascript
// Dans la console navigateur (F12)
generateLicense()  // Générer une nouvelle clé
// Puis copier la clé affichée et l'activer via l'interface
```

### Logs de Débogage

#### Mode Développement
- **Console navigateur** : F12 > Console
- **DevTools Electron** : Ctrl+Shift+I (Windows/Linux) ou Cmd+Opt+I (macOS)

#### Mode Production
- **Windows** : `%APPDATA%\\SamaFacture\\logs`
- **macOS** : `~/Library/Logs/SamaFacture`
- **Linux** : `~/.config/SamaFacture/logs`

## 🔄 Mise à Jour

### Mise à Jour Automatique (Prochaine version)
L'application vérifiera automatiquement les mises à jour.

### Mise à Jour Manuelle
1. Télécharger la nouvelle version
2. Sauvegarder vos données (Menu > Sauvegarder)
3. Installer la nouvelle version
4. Restaurer vos données si nécessaire

### Sauvegarde Avant Mise à Jour
```bash
# Localisation des données
# Windows: %APPDATA%\SamaFacture
# macOS: ~/Library/Application Support/SamaFacture  
# Linux: ~/.config/SamaFacture

# Ou via l'interface : Menu utilisateur > Sauvegarder
```

## 🌐 Version Web (PWA)

### Installation PWA
1. Ouvrir https://votre-domaine.com dans un navigateur moderne
2. Cliquer sur l'icône d'installation dans la barre d'adresse
3. Ou Menu navigateur > "Installer SamaFacture"

### Navigateurs Supportés
- **Chrome** 80+
- **Firefox** 75+
- **Safari** 13+
- **Edge** 80+

## 📱 Utilisation Mobile

### Installation sur Mobile
1. Ouvrir le site dans le navigateur mobile
2. Menu navigateur > "Ajouter à l'écran d'accueil"
3. L'application fonctionne hors ligne

### Fonctionnalités Mobiles
- Interface responsive
- Fonctionnement hors ligne
- Synchronisation automatique

## 🔐 Sécurité et Confidentialité

### Données Locales
- Toutes les données restent sur votre machine
- Aucune transmission vers des serveurs externes
- Chiffrement des données sensibles

### Sauvegarde Sécurisée
- Chiffrement AES des fichiers de sauvegarde
- Validation d'intégrité
- Protection par mot de passe (prochaine version)

## 📞 Support Technique

### Avant de Contacter le Support
1. Vérifiez cette documentation
2. Consultez les [Issues GitHub](https://github.com/yadepape/samafacture/issues)
3. Vérifiez les logs d'erreur

### Informations à Fournir
- Version de SamaFacture
- Système d'exploitation
- Description détaillée du problème
- Logs d'erreur si disponibles

### Canaux de Support
- **GitHub Issues** : Bugs et demandes de fonctionnalités
- **Email** : support@samafacture.com
- **Documentation** : Wiki GitHub

---

**Félicitations !** 🎉 SamaFacture est maintenant installé et prêt à simplifier votre gestion de facturation !

