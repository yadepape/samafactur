# 🧾 SamaFacture - Système de Gestion de Facturation

> **Système complet de gestion de facturation pour les TPE sénégalaises**

![SamaFacture](assets/icon-192x192.png)

## 📋 Description

SamaFacture est un système de gestion de facturation moderne, conçu spécifiquement pour les Très Petites Entreprises (TPE) sénégalaises. L'application offre une interface intuitive et professionnelle pour gérer clients, produits, factures, devis et dépenses.

## ✨ Fonctionnalités Principales

### 📊 Dashboard Complet
- Vue d'ensemble avec statistiques en temps réel
- Graphiques et métriques de performance
- Actions rapides pour créer clients, produits, factures

### 👥 Gestion des Clients
- CRUD complet (Créer, Lire, Modifier, Supprimer)
- Informations détaillées (contact, adresse, numéro fiscal)
- Historique des transactions
- Statut actif/inactif

### 📦 Gestion des Produits et Catégories
- Catalogue de produits avec catégorisation
- Prix, descriptions, codes produits
- Gestion des stocks (optionnel)
- Images de produits

### 🧾 Gestion des Factures
- Création de factures professionnelles
- Calcul automatique des taxes (TVA)
- Numérotation automatique
- Statuts : Brouillon, Envoyée, Payée, Annulée

### 📋 Gestion des Devis
- Création de devis détaillés
- Conversion devis → facture
- Suivi des acceptations/refus
- Dates de validité

### 💰 Gestion des Dépenses
- Enregistrement des dépenses d'entreprise
- Catégorisation des dépenses
- Suivi budgétaire
- Rapports de dépenses

### 📄 Export et Impression
- Export PDF des factures et devis
- Export Excel des données
- Impression via `window.print()`
- Templates personnalisables

### 🔍 Filtres Avancés
- Filtrage par période (jour, semaine, mois, année)
- Filtres par statut, client, produit
- Recherche textuelle avancée
- Tri multi-critères

### ⚙️ Paramètres Personnalisables
- Logo de l'entreprise
- Nom et informations de l'entreprise
- Thème clair/sombre
- Configuration des taxes
- Paramètres de numérotation

### 💾 Sauvegarde et Restauration
- Sauvegarde automatique locale
- Export/Import des données
- Backup complet de la base de données
- Restauration en un clic

### 🔐 Gestion de Licence Locale
- Système de licence chiffré local
- Durée de 1 mois renouvelable
- Génération de clés de licence
- Activation via console navigateur

## 🎨 Interface Utilisateur

### Design Moderne et Intuitif
- **Thème de couleurs** : Blanc, dégradé bleu BIC et bleu sombre
- **Responsive Design** : Adaptation mobile/tablette/desktop
- **Animations fluides** : Transitions CSS3 et lazy loading
- **Accessibilité** : Navigation clavier, raccourcis, contrastes

### Technologies Utilisées
- **Frontend** : HTML5, CSS3, JavaScript ES6+
- **PWA** : Service Worker, Manifest, mode hors ligne
- **Base de données** : SQLite avec SQL.js (local)
- **Desktop** : Electron.js pour exécutable
- **Mobile** : PWA installable

## 🚀 Installation Rapide

### Prérequis
- Navigateur moderne (Chrome 80+, Firefox 75+, Safari 13+)
- Python 3.7+ (pour le serveur de développement)

### Démarrage
```bash
# Cloner le projet
git clone https://github.com/yadepape/samafacture.git
cd samafacture/src

# Lancer le serveur
python3 -m http.server 8080

# Ouvrir dans le navigateur
# http://localhost:8080
```

## 📱 Installation Desktop

### Créer un Exécutable avec Electron
```bash
# Installer les dépendances
npm install electron electron-builder --save-dev

# Construire l'exécutable
npm run build

# L'exécutable sera dans le dossier dist/
```

## 🧪 Tests et Validation

### Tests Automatisés
```bash
# Validation syntaxe JavaScript
node -c js/app.js

# Tests d'environnement
node test_app.js
```

### Tests Manuels
- **Navigation** : Tester tous les modules
- **Thème** : Basculement light/dark
- **Responsive** : Mobile/desktop
- **Modales** : Ouverture/fermeture
- **Persistance** : Sauvegarde des données

## 📚 Documentation

- [📋 Tests et Vérification](TESTS_ET_VERIFICATION.md)
- [🚀 Installation et Déploiement](INSTALLATION_ET_DEPLOIEMENT.md)
- [🔧 Guide Développeur](docs/DEVELOPER_GUIDE.md)
- [👤 Guide Utilisateur](docs/USER_GUIDE.md)

## 🏗️ Architecture

```
src/
├── index.html              # Page principale
├── manifest.json           # Configuration PWA
├── sw.js                   # Service Worker
├── css/
│   └── styles.css          # Styles principaux
├── js/
│   ├── app.js              # Application principale
│   ├── pwa.js              # Gestion PWA
│   ├── database/
│   │   └── DatabaseManager.js
│   ├── license/
│   │   └── LicenseManager.js
│   └── modules/
│       ├── ClientManager.js
│       ├── ProductManager.js
│       ├── InvoiceManager.js
│       ├── QuoteManager.js
│       ├── ExpenseManager.js
│       └── SettingsManager.js
└── assets/
    ├── icons/              # Icônes PWA
    └── images/             # Images de l'application
```

## 🔧 Configuration

### Variables d'Environnement
```javascript
// Configuration dans js/app.js
const CONFIG = {
    APP_NAME: 'SamaFacture',
    VERSION: '1.0.0',
    CURRENCY: 'FCFA',
    TAX_RATE: 18, // TVA Sénégal
    LICENSE_DURATION: 30 // jours
};
```

### Personnalisation
- Modifier les couleurs dans `css/styles.css`
- Changer le logo dans `assets/`
- Adapter les templates de factures
- Configurer les taxes par défaut

## 🌍 Localisation

L'application est entièrement en français, adaptée au contexte sénégalais :
- Devise : Franc CFA (FCFA)
- Format de date : DD/MM/YYYY
- Numérotation : Format local
- Terminologie : Adaptée aux TPE

## 🔐 Sécurité

- **Données locales** : Stockage sécurisé dans le navigateur
- **Chiffrement** : Licence chiffrée localement
- **Pas de serveur** : Aucune donnée transmise en ligne
- **Contrôle total** : L'utilisateur garde ses données

## 📊 Performance

- **Chargement rapide** : < 2 secondes
- **Mode hors ligne** : Fonctionne sans internet
- **Cache intelligent** : Service Worker optimisé
- **Responsive** : Fluide sur tous les appareils

## 🤝 Contribution

Les contributions sont les bienvenues ! Pour contribuer :

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier [LICENSE](LICENSE) pour plus de détails.

## 👨‍💻 Auteur

**Développé par l'équipe Codegen**
- GitHub : [@yadepape](https://github.com/yadepape)
- Email : yadepapetoule6@gmail.com

## 🙏 Remerciements

- Communauté des développeurs sénégalais
- Entrepreneurs TPE pour leurs retours
- Contributeurs open source

## 📞 Support

Pour obtenir de l'aide :
1. Consulter la [documentation](docs/)
2. Ouvrir une [issue](https://github.com/yadepape/samafacture/issues)
3. Contacter l'équipe de développement

---

**SamaFacture** - *Simplifiez votre gestion de facturation* 🇸🇳

