# 🚀 Installation et Déploiement - SamaFacture

## 📋 Prérequis Système

### Développement
- **Node.js** 16+ (pour les tests et outils de développement)
- **Python 3.7+** (pour le serveur de développement)
- **Git** (pour la gestion de version)
- **Navigateur moderne** (Chrome 80+, Firefox 75+, Safari 13+, Edge 80+)

### Production
- **Serveur Web** (Apache, Nginx, ou serveur statique)
- **HTTPS** (recommandé pour PWA)
- **Navigateur moderne** avec support JavaScript ES6+

## 🛠️ Installation pour Développement

### 1. Cloner le Projet
```bash
git clone https://github.com/yadepape/samafacture.git
cd samafacture/src
```

### 2. Installer les Dépendances de Développement
```bash
# Initialiser npm (si pas déjà fait)
npm init -y

# Installer les dépendances de test
npm install jsdom --save-dev

# Optionnel : installer un serveur de développement
npm install -g http-server
```

### 3. Lancer en Mode Développement
```bash
# Option 1 : Serveur Python (recommandé)
python3 -m http.server 8080

# Option 2 : Serveur Node.js
npx http-server -p 8080 -c-1

# Option 3 : Serveur global
http-server -p 8080 -c-1
```

### 4. Accéder à l'Application
- **Application principale** : http://localhost:8080
- **Tests navigateur** : http://localhost:8080/test_browser.html

## 🧪 Tests et Validation

### Tests Automatisés
```bash
# Test de syntaxe JavaScript
node -c js/app.js
node -c js/modules/*.js
node -c js/database/*.js
node -c js/license/*.js

# Tests d'environnement
node test_app.js
```

### Tests Manuels
1. Ouvrir http://localhost:8080
2. Vérifier que l'application se charge
3. Tester la navigation entre modules
4. Tester le basculement de thème
5. Tester la responsivité mobile

## 📦 Déploiement en Production

### 1. Préparation des Fichiers
```bash
# Créer un dossier de production
mkdir samafacture-prod
cd samafacture-prod

# Copier les fichiers nécessaires
cp -r ../src/* .

# Supprimer les fichiers de développement
rm test_app.js
rm test_browser.html
rm TESTS_ET_VERIFICATION.md
rm INSTALLATION_ET_DEPLOIEMENT.md
rm package.json
rm package-lock.json
rm -rf node_modules/
```

### 2. Optimisation (Optionnel)
```bash
# Minifier les fichiers CSS (avec un outil comme cssnano)
# Minifier les fichiers JavaScript (avec un outil comme terser)
# Optimiser les images
# Générer les icônes PWA dans différentes tailles
```

### 3. Configuration du Serveur Web

#### Apache (.htaccess)
```apache
# Activer la compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache des ressources statiques
<IfModule mod_expires.c>
    ExpiresActive on
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/ico "access plus 1 year"
    ExpiresByType image/icon "access plus 1 year"
    ExpiresByType text/ico "access plus 1 year"
    ExpiresByType application/ico "access plus 1 year"
</IfModule>

# Support PWA
<IfModule mod_mime.c>
    AddType application/manifest+json .webmanifest
    AddType application/manifest+json .json
</IfModule>
```

#### Nginx
```nginx
server {
    listen 80;
    server_name votre-domaine.com;
    root /path/to/samafacture-prod;
    index index.html;

    # Compression
    gzip on;
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript;

    # Cache des ressources statiques
    location ~* \.(css|js|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Support PWA
    location /manifest.json {
        add_header Content-Type application/manifest+json;
    }

    # Fallback pour SPA
    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

## 📱 Création d'un Exécutable Desktop

### Avec Electron

#### 1. Installation d'Electron
```bash
# Dans le dossier du projet
npm install electron --save-dev
npm install electron-builder --save-dev
```

#### 2. Créer main.js pour Electron
```javascript
const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1200,
        height: 800,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },
        icon: path.join(__dirname, 'assets/icon-256x256.png')
    });

    mainWindow.loadFile('index.html');
    
    // Masquer la barre de menu en production
    mainWindow.setMenuBarVisibility(false);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
```

#### 3. Configurer package.json
```json
{
  "name": "samafacture",
  "version": "1.0.0",
  "description": "Système de gestion de facturation pour TPE sénégalaises",
  "main": "main.js",
  "scripts": {
    "start": "electron .",
    "build": "electron-builder",
    "dist": "electron-builder --publish=never"
  },
  "build": {
    "appId": "com.samafacture.app",
    "productName": "SamaFacture",
    "directories": {
      "output": "dist"
    },
    "files": [
      "**/*",
      "!node_modules",
      "!test_*.js",
      "!*.md"
    ],
    "win": {
      "target": "nsis",
      "icon": "assets/icon-256x256.png"
    },
    "mac": {
      "target": "dmg",
      "icon": "assets/icon-256x256.png"
    },
    "linux": {
      "target": "AppImage",
      "icon": "assets/icon-256x256.png"
    }
  }
}
```

#### 4. Construire l'Exécutable
```bash
# Pour Windows
npm run build -- --win

# Pour macOS
npm run build -- --mac

# Pour Linux
npm run build -- --linux

# Pour toutes les plateformes
npm run build
```

### Avec Tauri (Alternative Rust)

#### 1. Installation
```bash
npm install @tauri-apps/cli --save-dev
npm install @tauri-apps/api
```

#### 2. Initialisation
```bash
npx tauri init
```

#### 3. Configuration et Build
```bash
npx tauri build
```

## 🔧 Configuration Avancée

### Variables d'Environnement
```bash
# Fichier .env (pour développement)
NODE_ENV=development
API_URL=http://localhost:8080
DEBUG=true
```

### Configuration PWA
Vérifier que `manifest.json` est correctement configuré :
```json
{
  "name": "SamaFacture",
  "short_name": "SamaFacture",
  "description": "Système de gestion de facturation",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#3b82f6",
  "icons": [
    {
      "src": "assets/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "assets/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 🚀 Déploiement Cloud

### Netlify
1. Connecter le repository GitHub
2. Configurer le build : `Build command: none`, `Publish directory: src`
3. Déployer automatiquement

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### GitHub Pages
1. Activer GitHub Pages dans les paramètres du repository
2. Sélectionner la branche et le dossier `src`
3. L'application sera disponible sur `https://username.github.io/repository`

## 📊 Monitoring et Maintenance

### Logs d'Application
- Vérifier la console du navigateur pour les erreurs
- Monitorer les performances avec les DevTools
- Utiliser les Service Worker pour le cache et les mises à jour

### Mises à Jour
1. Modifier les fichiers source
2. Tester en développement
3. Déployer en production
4. Le Service Worker gérera automatiquement les mises à jour

## 🔐 Sécurité

### HTTPS
- Obligatoire pour PWA
- Utiliser Let's Encrypt pour les certificats gratuits
- Configurer les headers de sécurité

### Content Security Policy
```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; script-src 'self' 'unsafe-inline' https://cdnjs.cloudflare.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:;">
```

## 🎯 Checklist de Déploiement

- [ ] Tests passent en local
- [ ] Application fonctionne hors ligne
- [ ] PWA installable
- [ ] Responsive sur tous les appareils
- [ ] Performance optimisée
- [ ] HTTPS configuré
- [ ] Monitoring en place
- [ ] Sauvegarde configurée
- [ ] Documentation utilisateur prête

## 📞 Support et Maintenance

Pour le support technique :
1. Vérifier les logs du navigateur
2. Tester sur différents navigateurs
3. Vérifier la connectivité réseau
4. Consulter la documentation technique

L'application est conçue pour fonctionner de manière autonome avec un minimum de maintenance.

