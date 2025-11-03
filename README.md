# SamaFacture

Système complet de gestion de facturation pour les TPE sénégalaises.

## 🎯 Fonctionnalités

### ✅ Implémentées (Version 1.0)
- **Architecture moderne** : Electron.js + PWA + SQL.js
- **Base de données locale** : Stockage sécurisé avec SQL.js
- **Système de licence** : Chiffrement local avec validation (30 jours)
- **Interface moderne** : Thème blanc/bleu avec mode sombre
- **Dashboard complet** : Statistiques et graphiques en temps réel
- **Gestion des thèmes** : Basculement automatique light/dark
- **Notifications** : Système de toast avancé
- **PWA** : Fonctionnement hors ligne avec Service Worker

### 🚧 En développement (Prochaines versions)
- Gestion complète des clients
- Gestion des produits et catégories
- Système de facturation et devis
- Gestion des dépenses
- Import/Export PDF et Excel
- Impression optimisée
- Paramètres boutique
- Sauvegarde/Restauration

## 🚀 Installation et Développement

### Prérequis
- Node.js 16+ 
- npm ou yarn

### Installation
```bash
# Cloner le repository
git clone https://github.com/yadepape/samafacture.git
cd samafacture

# Installer les dépendances
npm install
```

### Développement
```bash
# Démarrer en mode développement (Web + Electron)
npm run dev

# Démarrer uniquement la version web
npm run dev:web

# Démarrer uniquement Electron
npm run dev:electron
```

L'application sera accessible à :
- **Web** : http://localhost:3000
- **Electron** : Se lance automatiquement

### Build et Distribution

#### Build Web
```bash
# Build pour production web
npm run build:web
```

#### Build Electron
```bash
# Build complet (Web + Electron)
npm run build

# Créer un package sans installateur
npm run pack

# Créer des installateurs pour toutes les plateformes
npm run dist

# Créer un installateur Windows uniquement
npm run dist:win

# Créer un installateur macOS uniquement
npm run dist:mac

# Créer un installateur Linux uniquement
npm run dist:linux
```

Les fichiers de distribution seront créés dans le dossier `dist/`.

## 🔐 Système de Licence

### Activation via Interface
1. Au premier lancement, une modal de licence apparaît
2. Cliquer sur "Générer une clé" pour créer une licence de 30 jours
3. Ou entrer une clé existante et cliquer "Activer"

### Activation via Console Navigateur
```javascript
// Générer une nouvelle licence (30 jours)
generateLicense()

// Activer une licence existante
activateLicense('VOTRE_CLE_DE_LICENCE')

// Voir les informations de licence
licenseInfo()
```

### Renouvellement
- Les licences expirent après 30 jours
- Un avertissement apparaît 7 jours avant l'expiration
- Générer une nouvelle clé pour renouveler

## 🎨 Thèmes et Personnalisation

### Basculement de Thème
- **Interface** : Bouton lune/soleil dans l'en-tête
- **Raccourci** : Menu Affichage > Thème sombre
- **Automatique** : Suit les préférences système

### Couleurs Principales
- **Primaire** : Bleu BIC (#1e40af)
- **Secondaire** : Bleu sombre (#1e3a8a)
- **Accent** : Bleu clair (#3b82f6)
- **Fond** : Blanc avec dégradés bleus

## 📊 Base de Données

### Structure
- **SQL.js** : Base de données SQLite en mémoire
- **Stockage** : LocalStorage (sauvegarde automatique)
- **Tables** : Clients, Produits, Factures, Devis, Dépenses, etc.

### Sauvegarde/Restauration
- **Automatique** : Toutes les 30 secondes
- **Manuelle** : Menu utilisateur > Sauvegarder/Restaurer
- **Format** : JSON avec structure complète

## 🔧 Architecture Technique

### Technologies
- **Frontend** : HTML5, CSS3, JavaScript ES6+
- **Desktop** : Electron.js 27+
- **PWA** : Service Worker, Manifest
- **Base de données** : SQL.js
- **Graphiques** : Chart.js
- **Build** : Webpack 5
- **Chiffrement** : CryptoJS

### Structure des Fichiers
```
src/
├── js/
│   ├── app.js              # Point d'entrée principal
│   ├── components/         # Composants UI
│   │   ├── Dashboard.js
│   │   └── Sidebar.js
│   ├── database/           # Gestion base de données
│   │   ├── Database.js
│   │   └── schema.js
│   ├── license/            # Système de licence
│   │   └── LicenseManager.js
│   ├── models/             # Modèles de données
│   │   ├── Client.js
│   │   └── Product.js
│   └── utils/              # Utilitaires
│       ├── ThemeManager.js
│       └── ToastManager.js
├── css/
│   └── styles.css          # Styles principaux
├── index.html              # Page principale
├── manifest.json           # Manifest PWA
└── sw.js                   # Service Worker

electron/
├── main.js                 # Process principal Electron
└── preload.js              # Script de préchargement
```

## 🐛 Débogage

### Console Navigateur
```javascript
// Informations de licence
window.LicenseManager.getDebugInfo()

// Statistiques base de données
window.Database.getDashboardStats()

// Informations thème
window.ThemeManager.exportThemeSettings()

// Statistiques notifications
window.ToastManager.getStats()
```

### Logs
- **Développement** : Console navigateur + DevTools Electron
- **Production** : Logs dans le dossier utilisateur

## 📱 PWA (Progressive Web App)

### Installation
1. Ouvrir dans un navigateur moderne
2. Cliquer sur l'icône d'installation dans la barre d'adresse
3. Ou utiliser le menu navigateur > "Installer SamaFacture"

### Fonctionnalités Hors Ligne
- Interface complète disponible
- Base de données locale
- Synchronisation automatique au retour en ligne

## 🔒 Sécurité

### Chiffrement
- **Licences** : AES avec clé secrète + ID machine
- **Stockage** : Données sensibles chiffrées
- **Validation** : Signatures cryptographiques

### Bonnes Pratiques
- Pas de données sensibles en clair
- Validation côté client et serveur
- Gestion sécurisée des erreurs

## 🤝 Contribution

### Développement
1. Fork le repository
2. Créer une branche feature
3. Développer et tester
4. Créer une Pull Request

### Standards
- **Code** : ES6+, JSDoc pour la documentation
- **CSS** : Variables CSS, BEM methodology
- **Commits** : Conventional Commits

## 📄 Licence

MIT License - Voir le fichier LICENSE pour plus de détails.

## 📞 Support

- **Issues** : GitHub Issues
- **Documentation** : Wiki du repository
- **Contact** : [Votre email de contact]

---

**SamaFacture** - Simplifions la facturation pour les TPE sénégalaises ! 🇸🇳

