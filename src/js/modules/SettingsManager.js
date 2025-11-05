/**
 * SamaFacture - Gestionnaire des Paramètres
 * Gestion des paramètres de boutique, logo, nom, et configuration utilisateur
 */

class SettingsManager {
    constructor() {
        this.settings = {
            shopName: 'Ma Boutique',
            shopLogo: null,
            shopAddress: '',
            shopPhone: '',
            shopEmail: '',
            currency: 'FCFA',
            taxRate: 18,
            language: 'fr',
            theme: 'light',
            invoicePrefix: 'FACT',
            quotePrefix: 'DEVIS',
            autoBackup: true,
            backupFrequency: 'daily'
        };
        
        this.init();
    }

    /**
     * Initialisation du gestionnaire
     */
    init() {
        this.loadSettings();
        this.bindEvents();
        this.applySettings();
    }

    /**
     * Charger les paramètres depuis le localStorage
     */
    loadSettings() {
        try {
            const savedSettings = localStorage.getItem('samaFacture_settings');
            if (savedSettings) {
                this.settings = { ...this.settings, ...JSON.parse(savedSettings) };
            }
        } catch (error) {
            console.error('Erreur lors du chargement des paramètres:', error);
        }
    }

    /**
     * Sauvegarder les paramètres dans le localStorage
     */
    saveSettings() {
        try {
            localStorage.setItem('samaFacture_settings', JSON.stringify(this.settings));
            this.applySettings();
            this.showToast('Paramètres sauvegardés avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de la sauvegarde des paramètres:', error);
            this.showToast('Erreur lors de la sauvegarde', 'danger');
        }
    }

    /**
     * Appliquer les paramètres à l'interface
     */
    applySettings() {
        // Appliquer le nom de boutique dans le header
        const logoElement = document.querySelector('.logo .logo-text');
        if (logoElement) {
            logoElement.textContent = this.settings.shopName;
        }

        // Appliquer le logo si disponible
        const logoIcon = document.querySelector('.logo i');
        if (this.settings.shopLogo && logoIcon) {
            logoIcon.style.backgroundImage = `url(${this.settings.shopLogo})`;
            logoIcon.style.backgroundSize = 'cover';
            logoIcon.style.backgroundPosition = 'center';
            logoIcon.innerHTML = '';
        }

        // Appliquer le thème
        document.documentElement.setAttribute('data-theme', this.settings.theme);

        // Mettre à jour le titre de la page
        document.title = `${this.settings.shopName} - SamaFacture`;
    }

    /**
     * Lier les événements
     */
    bindEvents() {
        // Événement pour le changement de thème
        document.addEventListener('click', (e) => {
            if (e.target.matches('.theme-toggle')) {
                this.toggleTheme();
            }
        });
    }

    /**
     * Basculer entre thème clair et sombre
     */
    toggleTheme() {
        this.settings.theme = this.settings.theme === 'light' ? 'dark' : 'light';
        this.saveSettings();
    }

    /**
     * Afficher la page des paramètres
     */
    showSettingsPage() {
        const content = `
            <div class="settings-container">
                <div class="page-header">
                    <div class="page-title">
                        <h1><i class="fas fa-cog"></i> Paramètres</h1>
                        <p>Configurez votre boutique et vos préférences</p>
                    </div>
                    <div class="page-actions">
                        <button class="btn btn-primary" onclick="settingsManager.saveAllSettings()">
                            <i class="fas fa-save"></i>
                            <span class="btn-text">Sauvegarder</span>
                        </button>
                        <button class="btn btn-secondary" onclick="settingsManager.resetSettings()">
                            <i class="fas fa-undo"></i>
                            <span class="btn-text">Réinitialiser</span>
                        </button>
                    </div>
                </div>

                <div class="settings-content">
                    <div class="settings-grid">
                        <!-- Informations de la boutique -->
                        <div class="settings-section">
                            <div class="card">
                                <div class="card-header">
                                    <h3><i class="fas fa-store"></i> Informations de la boutique</h3>
                                </div>
                                <div class="card-body">
                                    <div class="form-group">
                                        <label class="form-label">Nom de la boutique</label>
                                        <input type="text" class="form-control" id="shopName" 
                                               value="${this.settings.shopName}" placeholder="Nom de votre boutique">
                                    </div>
                                    
                                    <div class="form-group">
                                        <label class="form-label">Logo de la boutique</label>
                                        <div class="logo-upload-container">
                                            <input type="file" id="shopLogo" accept="image/*" style="display: none;">
                                            <div class="logo-preview" onclick="document.getElementById('shopLogo').click()">
                                                ${this.settings.shopLogo ? 
                                                    `<img src="${this.settings.shopLogo}" alt="Logo">` : 
                                                    '<i class="fas fa-image"></i><span>Cliquez pour ajouter un logo</span>'
                                                }
                                            </div>
                                            <button type="button" class="btn btn-sm btn-secondary mt-sm" 
                                                    onclick="settingsManager.removeLogo()">
                                                <i class="fas fa-trash"></i> Supprimer le logo
                                            </button>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label">Adresse</label>
                                        <textarea class="form-control" id="shopAddress" rows="3" 
                                                  placeholder="Adresse complète de votre boutique">${this.settings.shopAddress}</textarea>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group">
                                            <label class="form-label">Téléphone</label>
                                            <input type="tel" class="form-control" id="shopPhone" 
                                                   value="${this.settings.shopPhone}" placeholder="+221 XX XXX XX XX">
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">Email</label>
                                            <input type="email" class="form-control" id="shopEmail" 
                                                   value="${this.settings.shopEmail}" placeholder="contact@boutique.com">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Paramètres de facturation -->
                        <div class="settings-section">
                            <div class="card">
                                <div class="card-header">
                                    <h3><i class="fas fa-file-invoice"></i> Paramètres de facturation</h3>
                                </div>
                                <div class="card-body">
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label class="form-label">Devise</label>
                                            <select class="form-control" id="currency">
                                                <option value="FCFA" ${this.settings.currency === 'FCFA' ? 'selected' : ''}>FCFA</option>
                                                <option value="EUR" ${this.settings.currency === 'EUR' ? 'selected' : ''}>Euro (€)</option>
                                                <option value="USD" ${this.settings.currency === 'USD' ? 'selected' : ''}>Dollar ($)</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">Taux de TVA (%)</label>
                                            <input type="number" class="form-control" id="taxRate" 
                                                   value="${this.settings.taxRate}" min="0" max="100" step="0.1">
                                        </div>
                                    </div>

                                    <div class="form-row">
                                        <div class="form-group">
                                            <label class="form-label">Préfixe des factures</label>
                                            <input type="text" class="form-control" id="invoicePrefix" 
                                                   value="${this.settings.invoicePrefix}" placeholder="FACT">
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">Préfixe des devis</label>
                                            <input type="text" class="form-control" id="quotePrefix" 
                                                   value="${this.settings.quotePrefix}" placeholder="DEVIS">
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Préférences utilisateur -->
                        <div class="settings-section">
                            <div class="card">
                                <div class="card-header">
                                    <h3><i class="fas fa-user-cog"></i> Préférences utilisateur</h3>
                                </div>
                                <div class="card-body">
                                    <div class="form-row">
                                        <div class="form-group">
                                            <label class="form-label">Langue</label>
                                            <select class="form-control" id="language">
                                                <option value="fr" ${this.settings.language === 'fr' ? 'selected' : ''}>Français</option>
                                                <option value="en" ${this.settings.language === 'en' ? 'selected' : ''}>English</option>
                                            </select>
                                        </div>
                                        <div class="form-group">
                                            <label class="form-label">Thème</label>
                                            <select class="form-control" id="theme">
                                                <option value="light" ${this.settings.theme === 'light' ? 'selected' : ''}>Clair</option>
                                                <option value="dark" ${this.settings.theme === 'dark' ? 'selected' : ''}>Sombre</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <div class="form-check">
                                            <input type="checkbox" class="form-check-input" id="autoBackup" 
                                                   ${this.settings.autoBackup ? 'checked' : ''}>
                                            <label class="form-check-label" for="autoBackup">
                                                Sauvegarde automatique
                                            </label>
                                        </div>
                                    </div>

                                    <div class="form-group">
                                        <label class="form-label">Fréquence de sauvegarde</label>
                                        <select class="form-control" id="backupFrequency">
                                            <option value="daily" ${this.settings.backupFrequency === 'daily' ? 'selected' : ''}>Quotidienne</option>
                                            <option value="weekly" ${this.settings.backupFrequency === 'weekly' ? 'selected' : ''}>Hebdomadaire</option>
                                            <option value="monthly" ${this.settings.backupFrequency === 'monthly' ? 'selected' : ''}>Mensuelle</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Actions de sauvegarde -->
                        <div class="settings-section">
                            <div class="card">
                                <div class="card-header">
                                    <h3><i class="fas fa-database"></i> Sauvegarde et restauration</h3>
                                </div>
                                <div class="card-body">
                                    <div class="backup-actions">
                                        <button class="btn btn-success" onclick="settingsManager.exportData()">
                                            <i class="fas fa-download"></i>
                                            Exporter les données
                                        </button>
                                        <button class="btn btn-warning" onclick="settingsManager.importData()">
                                            <i class="fas fa-upload"></i>
                                            Importer les données
                                        </button>
                                        <button class="btn btn-danger" onclick="settingsManager.clearAllData()">
                                            <i class="fas fa-trash-alt"></i>
                                            Effacer toutes les données
                                        </button>
                                    </div>
                                    <input type="file" id="importFile" accept=".json" style="display: none;">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.getElementById('content-area').innerHTML = content;
        this.bindSettingsEvents();
    }

    /**
     * Lier les événements de la page des paramètres
     */
    bindSettingsEvents() {
        // Upload du logo
        const logoInput = document.getElementById('shopLogo');
        if (logoInput) {
            logoInput.addEventListener('change', (e) => {
                this.handleLogoUpload(e);
            });
        }

        // Import de données
        const importInput = document.getElementById('importFile');
        if (importInput) {
            importInput.addEventListener('change', (e) => {
                this.handleDataImport(e);
            });
        }
    }

    /**
     * Gérer l'upload du logo
     */
    handleLogoUpload(event) {
        const file = event.target.files[0];
        if (file) {
            if (file.size > 2 * 1024 * 1024) { // 2MB max
                this.showToast('Le fichier est trop volumineux (max 2MB)', 'danger');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                this.settings.shopLogo = e.target.result;
                const preview = document.querySelector('.logo-preview');
                if (preview) {
                    preview.innerHTML = `<img src="${e.target.result}" alt="Logo">`;
                }
            };
            reader.readAsDataURL(file);
        }
    }

    /**
     * Supprimer le logo
     */
    removeLogo() {
        this.settings.shopLogo = null;
        const preview = document.querySelector('.logo-preview');
        if (preview) {
            preview.innerHTML = '<i class="fas fa-image"></i><span>Cliquez pour ajouter un logo</span>';
        }
    }

    /**
     * Sauvegarder tous les paramètres depuis le formulaire
     */
    saveAllSettings() {
        try {
            // Récupérer les valeurs du formulaire
            this.settings.shopName = document.getElementById('shopName')?.value || this.settings.shopName;
            this.settings.shopAddress = document.getElementById('shopAddress')?.value || this.settings.shopAddress;
            this.settings.shopPhone = document.getElementById('shopPhone')?.value || this.settings.shopPhone;
            this.settings.shopEmail = document.getElementById('shopEmail')?.value || this.settings.shopEmail;
            this.settings.currency = document.getElementById('currency')?.value || this.settings.currency;
            this.settings.taxRate = parseFloat(document.getElementById('taxRate')?.value) || this.settings.taxRate;
            this.settings.invoicePrefix = document.getElementById('invoicePrefix')?.value || this.settings.invoicePrefix;
            this.settings.quotePrefix = document.getElementById('quotePrefix')?.value || this.settings.quotePrefix;
            this.settings.language = document.getElementById('language')?.value || this.settings.language;
            this.settings.theme = document.getElementById('theme')?.value || this.settings.theme;
            this.settings.autoBackup = document.getElementById('autoBackup')?.checked || false;
            this.settings.backupFrequency = document.getElementById('backupFrequency')?.value || this.settings.backupFrequency;

            this.saveSettings();
        } catch (error) {
            console.error('Erreur lors de la sauvegarde:', error);
            this.showToast('Erreur lors de la sauvegarde des paramètres', 'danger');
        }
    }

    /**
     * Réinitialiser les paramètres
     */
    resetSettings() {
        if (confirm('Êtes-vous sûr de vouloir réinitialiser tous les paramètres ?')) {
            localStorage.removeItem('samaFacture_settings');
            this.settings = {
                shopName: 'Ma Boutique',
                shopLogo: null,
                shopAddress: '',
                shopPhone: '',
                shopEmail: '',
                currency: 'FCFA',
                taxRate: 18,
                language: 'fr',
                theme: 'light',
                invoicePrefix: 'FACT',
                quotePrefix: 'DEVIS',
                autoBackup: true,
                backupFrequency: 'daily'
            };
            this.applySettings();
            this.showSettingsPage();
            this.showToast('Paramètres réinitialisés', 'success');
        }
    }

    /**
     * Exporter toutes les données
     */
    exportData() {
        try {
            const data = {
                settings: this.settings,
                clients: JSON.parse(localStorage.getItem('samaFacture_clients') || '[]'),
                products: JSON.parse(localStorage.getItem('samaFacture_products') || '[]'),
                invoices: JSON.parse(localStorage.getItem('samaFacture_invoices') || '[]'),
                quotes: JSON.parse(localStorage.getItem('samaFacture_quotes') || '[]'),
                expenses: JSON.parse(localStorage.getItem('samaFacture_expenses') || '[]'),
                exportDate: new Date().toISOString()
            };

            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `samaFacture_backup_${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);

            this.showToast('Données exportées avec succès', 'success');
        } catch (error) {
            console.error('Erreur lors de l\'export:', error);
            this.showToast('Erreur lors de l\'export des données', 'danger');
        }
    }

    /**
     * Importer les données
     */
    importData() {
        document.getElementById('importFile').click();
    }

    /**
     * Gérer l'import des données
     */
    handleDataImport(event) {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const data = JSON.parse(e.target.result);
                    
                    if (confirm('Cette action remplacera toutes vos données actuelles. Continuer ?')) {
                        // Restaurer les données
                        if (data.settings) {
                            this.settings = { ...this.settings, ...data.settings };
                            localStorage.setItem('samaFacture_settings', JSON.stringify(this.settings));
                        }
                        if (data.clients) localStorage.setItem('samaFacture_clients', JSON.stringify(data.clients));
                        if (data.products) localStorage.setItem('samaFacture_products', JSON.stringify(data.products));
                        if (data.invoices) localStorage.setItem('samaFacture_invoices', JSON.stringify(data.invoices));
                        if (data.quotes) localStorage.setItem('samaFacture_quotes', JSON.stringify(data.quotes));
                        if (data.expenses) localStorage.setItem('samaFacture_expenses', JSON.stringify(data.expenses));

                        this.applySettings();
                        this.showToast('Données importées avec succès', 'success');
                        
                        // Recharger la page pour appliquer tous les changements
                        setTimeout(() => {
                            window.location.reload();
                        }, 1500);
                    }
                } catch (error) {
                    console.error('Erreur lors de l\'import:', error);
                    this.showToast('Fichier de sauvegarde invalide', 'danger');
                }
            };
            reader.readAsText(file);
        }
    }

    /**
     * Effacer toutes les données
     */
    clearAllData() {
        if (confirm('ATTENTION: Cette action supprimera définitivement toutes vos données. Cette action est irréversible. Continuer ?')) {
            if (confirm('Êtes-vous absolument certain ? Toutes les données seront perdues !')) {
                localStorage.clear();
                this.showToast('Toutes les données ont été supprimées', 'warning');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        }
    }

    /**
     * Obtenir un paramètre
     */
    getSetting(key) {
        return this.settings[key];
    }

    /**
     * Définir un paramètre
     */
    setSetting(key, value) {
        this.settings[key] = value;
        this.saveSettings();
    }

    /**
     * Afficher une notification toast
     */
    showToast(message, type = 'info') {
        // Créer le conteneur de toast s'il n'existe pas
        let toastContainer = document.getElementById('toast-container');
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toast-container';
            toastContainer.className = 'toast-container';
            document.body.appendChild(toastContainer);
        }

        // Créer le toast
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.textContent = message;

        // Ajouter le toast
        toastContainer.appendChild(toast);

        // Supprimer le toast après 3 secondes
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }
}

// Initialiser le gestionnaire des paramètres
const settingsManager = new SettingsManager();
