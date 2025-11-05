/**
 * SamaFacture - Application principale
 * Système complet de gestion de facturation pour TPE sénégalaises
 */

class SamaFactureApp {
    constructor() {
        this.currentModule = 'dashboard';
        this.managers = {};
        this.isInitialized = false;
    }

    /**
     * Initialisation de l'application
     */
    async init() {
        try {
            console.log('🚀 Initialisation de SamaFacture...');
            
            // Initialiser les gestionnaires
            await this.initializeManagers();
            
            // Configurer la navigation
            this.setupNavigation();
            
            // Configurer les événements globaux
            this.setupGlobalEvents();
            
            // Charger le module par défaut
            this.loadModule('dashboard');
            
            this.isInitialized = true;
            console.log('✅ SamaFacture initialisé avec succès');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation:', error);
            this.showError('Erreur lors du chargement de l\'application');
        }
    }

    /**
     * Initialiser tous les gestionnaires
     */
    async initializeManagers() {
        try {
            // Utiliser les instances déjà créées dans les fichiers de gestionnaires
            if (typeof window.clientManager !== 'undefined') {
                this.managers.clients = window.clientManager;
                console.log('✅ ClientManager initialisé (instance existante)');
            }
            
            // Gestionnaire des produits
            if (typeof window.productManager !== 'undefined') {
                this.managers.products = window.productManager;
                console.log('✅ ProductManager initialisé (instance existante)');
            }
            
            // Gestionnaire des factures
            if (typeof window.invoiceManager !== 'undefined') {
                this.managers.invoices = window.invoiceManager;
                console.log('✅ InvoiceManager initialisé (instance existante)');
            }
            
            // Gestionnaire des devis
            if (typeof window.quoteManager !== 'undefined') {
                this.managers.quotes = window.quoteManager;
                console.log('✅ QuoteManager initialisé (instance existante)');
            }
            
            // Gestionnaire des dépenses
            if (typeof window.expenseManager !== 'undefined') {
                this.managers.expenses = window.expenseManager;
                console.log('✅ ExpenseManager initialisé (instance existante)');
            }
            
            // Gestionnaire des paramètres
            if (typeof window.settingsManager !== 'undefined') {
                this.managers.settings = window.settingsManager;
                console.log('✅ SettingsManager initialisé (instance existante)');
            }
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation des gestionnaires:', error);
            throw error;
        }
    }

    /**
     * Configurer la navigation
     */
    setupNavigation() {
        // Navigation principale
        const navLinks = document.querySelectorAll('[data-module]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const module = link.getAttribute('data-module');
                console.log(`🔗 Navigation vers: ${module}`);
                this.loadModule(module);
                
                // Fermer le menu mobile si ouvert
                if (window.innerWidth <= 768) {
                    const sidebar = document.getElementById('sidebar');
                    if (sidebar) {
                        sidebar.classList.remove('mobile-open');
                    }
                }
            });
        });

        // Navigation mobile (si applicable)
        const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
        if (mobileMenuToggle) {
            mobileMenuToggle.addEventListener('click', () => {
                this.toggleMobileMenu();
            });
        }
    }

    /**
     * Configurer les événements globaux
     */
    setupGlobalEvents() {
        // Gestion des modales
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                this.closeAllModals();
            }
        });

        // Gestion des raccourcis clavier
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeAllModals();
            }
        });

        // Gestion du thème
        const themeToggle = document.getElementById('theme-toggle');
        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
        }
    }

    /**
     * Charger un module spécifique
     */
    loadModule(moduleName) {
        try {
            console.log(`📄 Chargement du module: ${moduleName}`);
            console.log('📋 État de l\'initialisation:', this.isInitialized);
            console.log('🎯 Gestionnaires disponibles:', Object.keys(this.managers));
            
            // Mettre à jour la navigation active
            this.updateActiveNavigation(moduleName);
            
            // Charger le contenu du module
            switch (moduleName) {
                case 'dashboard':
                    this.loadDashboard();
                    break;
                    
                case 'clients':
                    this.loadClients();
                    break;
                    
                case 'products':
                    this.loadProducts();
                    break;
                    
                case 'invoices':
                    this.loadInvoices();
                    break;
                    
                case 'quotes':
                    this.loadQuotes();
                    break;
                    
                case 'expenses':
                    this.loadExpenses();
                    break;
                    
                case 'settings':
                    this.loadSettings();
                    break;
                    
                default:
                    console.warn(`⚠️ Module inconnu: ${moduleName}`);
                    this.loadDashboard();
            }
            
            this.currentModule = moduleName;
            
        } catch (error) {
            console.error(`❌ Erreur lors du chargement du module ${moduleName}:`, error);
            this.showError(`Erreur lors du chargement de ${moduleName}`);
        }
    }

    /**
     * Mettre à jour la navigation active
     */
    updateActiveNavigation(moduleName) {
        // Retirer la classe active de tous les liens
        document.querySelectorAll('[data-module]').forEach(link => {
            link.classList.remove('active');
        });
        
        // Ajouter la classe active au lien courant
        const activeLink = document.querySelector(`[data-module="${moduleName}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
        
        // Mettre à jour le titre de la page
        this.updatePageTitle(moduleName);
    }

    /**
     * Mettre à jour le titre de la page
     */
    updatePageTitle(moduleName) {
        const titles = {
            dashboard: 'Tableau de Bord',
            clients: 'Gestion des Clients',
            products: 'Gestion des Produits',
            invoices: 'Factures',
            quotes: 'Devis',
            expenses: 'Dépenses',
            settings: 'Paramètres'
        };
        
        const title = titles[moduleName] || 'SamaFacture';
        document.title = `${title} - SamaFacture`;
    }

    /**
     * Charger le tableau de bord
     */
    loadDashboard() {
        console.log('📊 Chargement du dashboard...');
        const mainContent = document.getElementById('main-content');
        if (!mainContent) {
            console.error('❌ Élément main-content introuvable !');
            return;
        }
        console.log('✅ Élément main-content trouvé, chargement du contenu...');
        
        mainContent.innerHTML = `
            <div class="dashboard-container">
                <div class="page-header">
                    <div class="page-title">
                        <h1><i class="fas fa-tachometer-alt"></i> Tableau de Bord</h1>
                        <p>Vue d'ensemble de votre activité</p>
                    </div>
                </div>
                
                <div class="dashboard-stats">
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${this.managers.clients ? this.managers.clients.clients.length : 0}</div>
                            <div class="stat-label">Clients</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-box"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${this.managers.products ? this.managers.products.products.length : 0}</div>
                            <div class="stat-label">Produits</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-file-invoice"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${this.managers.invoices ? this.managers.invoices.invoices.length : 0}</div>
                            <div class="stat-label">Factures</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-file-alt"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${this.managers.quotes ? this.managers.quotes.quotes.length : 0}</div>
                            <div class="stat-label">Devis</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-receipt"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${this.managers.expenses ? this.managers.expenses.expenses.length : 0}</div>
                            <div class="stat-label">Dépenses</div>
                        </div>
                    </div>
                    
                    <div class="stat-card">
                        <div class="stat-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-content">
                            <div class="stat-number">${this.managers.invoices ? this.managers.invoices.formatPrice(this.managers.invoices.getStats().totalRevenue) : '0 FCFA'}</div>
                            <div class="stat-label">Chiffre d'Affaires</div>
                        </div>
                    </div>
                </div>
                
                <div class="dashboard-content">
                    <div class="dashboard-section">
                        <h2>Actions Rapides</h2>
                        <div class="quick-actions">
                            <button class="btn btn-primary" onclick="app.loadModule('clients')">
                                <i class="fas fa-user-plus"></i> Nouveau Client
                            </button>
                            <button class="btn btn-primary" onclick="app.loadModule('products')">
                                <i class="fas fa-plus"></i> Nouveau Produit
                            </button>
                            <button class="btn btn-primary" onclick="app.loadModule('invoices')">
                                <i class="fas fa-file-invoice"></i> Nouvelle Facture
                            </button>
                            <button class="btn btn-primary" onclick="app.loadModule('quotes')">
                                <i class="fas fa-file-alt"></i> Nouveau Devis
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        console.log('✅ Dashboard chargé avec succès !');
    }

    /**
     * Charger la gestion des clients
     */
    loadClients() {
        if (this.managers.clients) {
            this.managers.clients.render();
        } else {
            this.showError('Le gestionnaire de clients n\'est pas disponible');
        }
    }

    /**
     * Charger la gestion des produits
     */
    loadProducts() {
        if (this.managers.products) {
            this.managers.products.render();
        } else {
            this.showError('Le gestionnaire de produits n\'est pas disponible');
        }
    }

    /**
     * Charger la gestion des factures
     */
    loadInvoices() {
        if (this.managers.invoices) {
            this.managers.invoices.render();
        } else {
            this.showError('Le gestionnaire de factures n\'est pas disponible');
        }
    }

    /**
     * Charger la gestion des devis
     */
    loadQuotes() {
        if (this.managers.quotes) {
            this.managers.quotes.render();
        } else {
            this.showError('Le gestionnaire de devis n\'est pas disponible');
        }
    }

    /**
     * Charger la gestion des dépenses
     */
    loadExpenses() {
        if (this.managers.expenses) {
            this.managers.expenses.render();
        } else {
            this.showError('Le gestionnaire de dépenses n\'est pas disponible');
        }
    }

    /**
     * Charger les paramètres
     */
    loadSettings() {
        if (typeof settingsManager !== 'undefined' && settingsManager) {
            settingsManager.showSettingsPage();
        } else {
            this.showError('Le gestionnaire de paramètres n\'est pas disponible');
        }
    }

    /**
     * Fermer toutes les modales
     */
    closeAllModals() {
        const modals = document.querySelectorAll('.modal-overlay');
        modals.forEach(modal => {
            modal.classList.remove('active');
            // Attendre la fin de l'animation avant de supprimer
            setTimeout(() => {
                if (modal.parentNode) {
                    modal.parentNode.removeChild(modal);
                }
            }, 300);
        });
    }

    /**
     * Basculer le menu mobile
     */
    toggleMobileMenu() {
        const sidebar = document.getElementById('sidebar');
        if (sidebar) {
            sidebar.classList.toggle('mobile-open');
        }
    }

    /**
     * Basculer le thème
     */
    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        
        // Mettre à jour l'icône du bouton
        const themeIcon = document.querySelector('#theme-toggle i');
        if (themeIcon) {
            themeIcon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
        }
    }

    /**
     * Afficher une erreur
     */
    showError(message) {
        console.error('❌', message);
        
        // TODO: Implémenter un système de toast/notification
        alert(message);
    }

    /**
     * Afficher un message de succès
     */
    showSuccess(message) {
        console.log('✅', message);
        
        // TODO: Implémenter un système de toast/notification
    }
}

// Variables globales
let app;

// Fonction pour attendre que tous les scripts soient chargés
function waitForScripts() {
    return new Promise((resolve) => {
        const checkScripts = () => {
            const scriptsLoaded = [
                'ClientManager',
                'ProductManager', 
                'InvoiceManager',
                'QuoteManager',
                'ExpenseManager',
                'SettingsManager',
                'DatabaseManager',
                'LicenseManager'
            ].every(className => typeof window[className] !== 'undefined');
            
            if (scriptsLoaded) {
                console.log('✅ Tous les scripts sont chargés');
                resolve();
            } else {
                console.log('⏳ Attente du chargement des scripts...');
                setTimeout(checkScripts, 100);
            }
        };
        checkScripts();
    });
}

// Initialisation de l'application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        console.log('🚀 Initialisation de SamaFacture...');
        
        // Charger le thème sauvegardé
        const savedTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', savedTheme);
        
        // Attendre que tous les scripts soient chargés
        await waitForScripts();
        
        // Initialiser l'application
        app = new SamaFactureApp();
        
        // Exposer l'application globalement
        window.app = app;
        
        // Initialiser l'application de manière asynchrone
        await app.init();
        
        // Les gestionnaires sont maintenant exposés directement dans leurs fichiers respectifs
        
        console.log('✅ SamaFacture initialisé avec succès');
        
        // Masquer le loader et afficher l'interface
        if (typeof window.hideLoader === 'function') {
            window.hideLoader();
        }
        
    } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation:', error);
        // En cas d'erreur, afficher quand même l'interface avec un message d'erreur
        if (typeof window.hideLoader === 'function') {
            window.hideLoader();
        }
    }
});

// Fonction globale pour la compatibilité
function showPage(pageName) {
    if (window.app) {
        window.app.loadModule(pageName);
    } else {
        console.error('❌ Application non initialisée');
    }
}

// Exposer la fonction globalement
window.showPage = showPage;

// Gestion des erreurs globales
window.addEventListener('error', (event) => {
    console.error('❌ Erreur globale:', event.error);
});

window.addEventListener('unhandledrejection', (event) => {
    console.error('❌ Promesse rejetée:', event.reason);
});
