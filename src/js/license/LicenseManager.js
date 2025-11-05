/**
 * SamaFacture - Gestionnaire de Licence
 * Système de licence locale avec chiffrement et validation
 */

class LicenseManager {
    constructor() {
        this.licenseKey = 'samaFacture_license';
        this.machineIdKey = 'samaFacture_machine_id';
        this.trialKey = 'samaFacture_trial';
        this.masterKey = 'SamaFacture2024SecretKey';
        
        this.init();
    }

    /**
     * Initialiser le gestionnaire de licence
     */
    async init() {
        try {
            console.log('🔐 Initialisation du système de licence...');
            
            // Générer ou récupérer l'ID machine
            await this.ensureMachineId();
            
            // Vérifier la licence existante
            await this.checkLicense();
            
            console.log('✅ Système de licence initialisé');
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation de la licence:', error);
        }
    }

    /**
     * Générer ou récupérer l'ID machine
     */
    async ensureMachineId() {
        let machineId = localStorage.getItem(this.machineIdKey);
        
        if (!machineId) {
            machineId = await cryptoUtils.generateMachineId();
            localStorage.setItem(this.machineIdKey, machineId);
            console.log('🆔 Nouvel ID machine généré');
        }
        
        this.machineId = machineId;
        return machineId;
    }

    /**
     * Vérifier la licence actuelle
     */
    async checkLicense() {
        const licenseData = localStorage.getItem(this.licenseKey);
        
        if (!licenseData) {
            console.log('⚠️ Aucune licence trouvée');
            return this.startTrial();
        }

        try {
            const decryptedLicense = await cryptoUtils.decrypt(licenseData, this.masterKey);
            const license = JSON.parse(decryptedLicense);
            
            // Vérifier la validité de la licence
            if (await this.validateLicense(license)) {
                this.currentLicense = license;
                console.log('✅ Licence valide');
                return true;
            } else {
                console.log('❌ Licence invalide ou expirée');
                return this.startTrial();
            }
        } catch (error) {
            console.error('❌ Erreur lors de la vérification de la licence:', error);
            return this.startTrial();
        }
    }

    /**
     * Valider une licence
     */
    async validateLicense(license) {
        try {
            // Vérifier la structure de la licence
            if (!license.id || !license.machineId || !license.expiresAt || !license.checksum) {
                return false;
            }

            // Vérifier l'ID machine
            if (license.machineId !== this.machineId) {
                console.log('❌ ID machine ne correspond pas');
                return false;
            }

            // Vérifier l'expiration
            const now = new Date();
            const expiresAt = new Date(license.expiresAt);
            
            if (now > expiresAt) {
                console.log('❌ Licence expirée');
                return false;
            }

            // Vérifier l'intégrité
            const dataToCheck = `${license.id}|${license.machineId}|${license.expiresAt}|${license.type}`;
            const isValid = await cryptoUtils.verifyChecksum(dataToCheck, license.checksum);
            
            if (!isValid) {
                console.log('❌ Checksum invalide');
                return false;
            }

            return true;
        } catch (error) {
            console.error('Erreur lors de la validation:', error);
            return false;
        }
    }

    /**
     * Démarrer la période d'essai
     */
    async startTrial() {
        const trialData = localStorage.getItem(this.trialKey);
        
        if (trialData) {
            try {
                const trial = JSON.parse(trialData);
                const now = new Date();
                const expiresAt = new Date(trial.expiresAt);
                
                if (now > expiresAt) {
                    console.log('❌ Période d\'essai expirée');
                    this.showLicenseExpiredModal();
                    return false;
                } else {
                    console.log('⏰ Période d\'essai en cours');
                    this.currentLicense = trial;
                    return true;
                }
            } catch (error) {
                console.error('Erreur lors de la vérification de l\'essai:', error);
            }
        }

        // Créer une nouvelle période d'essai
        const trialLicense = await this.createTrialLicense();
        const encryptedTrial = await cryptoUtils.encrypt(JSON.stringify(trialLicense), this.masterKey);
        localStorage.setItem(this.trialKey, JSON.stringify(trialLicense));
        
        this.currentLicense = trialLicense;
        console.log('🆕 Nouvelle période d\'essai créée (30 jours)');
        
        this.showTrialStartedModal();
        return true;
    }

    /**
     * Créer une licence d'essai
     */
    async createTrialLicense() {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + (30 * 24 * 60 * 60 * 1000)); // 30 jours
        
        const license = {
            id: cryptoUtils.generateSecureRandom(16),
            type: 'trial',
            machineId: this.machineId,
            createdAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
            features: ['all'],
            version: '1.0'
        };

        // Créer le checksum
        const dataToCheck = `${license.id}|${license.machineId}|${license.expiresAt}|${license.type}`;
        license.checksum = await cryptoUtils.createChecksum(dataToCheck);

        return license;
    }

    /**
     * Générer une nouvelle clé de licence
     */
    async generateLicenseKey(durationDays = 30) {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + (durationDays * 24 * 60 * 60 * 1000));
        
        const license = {
            id: cryptoUtils.generateSecureRandom(16),
            type: 'full',
            machineId: this.machineId,
            createdAt: now.toISOString(),
            expiresAt: expiresAt.toISOString(),
            features: ['all'],
            version: '1.0'
        };

        // Créer le checksum
        const dataToCheck = `${license.id}|${license.machineId}|${license.expiresAt}|${license.type}`;
        license.checksum = await cryptoUtils.createChecksum(dataToCheck);

        // Chiffrer la licence
        const encryptedLicense = await cryptoUtils.encrypt(JSON.stringify(license), this.masterKey);
        
        // Créer une clé de licence lisible
        const licenseKey = this.formatLicenseKey(encryptedLicense);
        
        return {
            licenseKey,
            license,
            expiresAt: expiresAt.toLocaleDateString('fr-FR')
        };
    }

    /**
     * Formater une clé de licence pour l'affichage
     */
    formatLicenseKey(encryptedData) {
        // Prendre les premiers caractères et les formater
        const key = encryptedData.substring(0, 25).toUpperCase();
        return key.match(/.{1,5}/g).join('-');
    }

    /**
     * Activer une licence avec une clé
     */
    async activateLicense(licenseKey) {
        try {
            // Reconstituer la clé chiffrée
            const cleanKey = licenseKey.replace(/-/g, '');
            
            // Pour la démo, on génère une nouvelle licence
            // En production, on déchiffrerait la clé fournie
            const licenseData = await this.generateLicenseKey(30);
            
            // Sauvegarder la licence
            const encryptedLicense = await cryptoUtils.encrypt(
                JSON.stringify(licenseData.license), 
                this.masterKey
            );
            localStorage.setItem(this.licenseKey, encryptedLicense);
            
            // Supprimer la période d'essai
            localStorage.removeItem(this.trialKey);
            
            this.currentLicense = licenseData.license;
            
            console.log('✅ Licence activée avec succès');
            this.showLicenseActivatedModal();
            
            return true;
        } catch (error) {
            console.error('❌ Erreur lors de l\'activation de la licence:', error);
            return false;
        }
    }

    /**
     * Obtenir le statut de la licence
     */
    getLicenseStatus() {
        if (!this.currentLicense) {
            return {
                isValid: false,
                type: 'none',
                daysRemaining: 0,
                expiresAt: null
            };
        }

        const now = new Date();
        const expiresAt = new Date(this.currentLicense.expiresAt);
        const daysRemaining = Math.ceil((expiresAt - now) / (1000 * 60 * 60 * 24));

        return {
            isValid: daysRemaining > 0,
            type: this.currentLicense.type,
            daysRemaining: Math.max(0, daysRemaining),
            expiresAt: expiresAt.toLocaleDateString('fr-FR'),
            features: this.currentLicense.features || []
        };
    }

    /**
     * Vérifier si une fonctionnalité est disponible
     */
    hasFeature(feature) {
        const status = this.getLicenseStatus();
        return status.isValid && (
            status.features.includes('all') || 
            status.features.includes(feature)
        );
    }

    /**
     * Renouveler la licence (génère une nouvelle clé)
     */
    async renewLicense(durationDays = 30) {
        return await this.generateLicenseKey(durationDays);
    }

    /**
     * Afficher le modal de licence expirée
     */
    showLicenseExpiredModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal license-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-exclamation-triangle"></i> Licence Expirée</h2>
                </div>
                <div class="modal-body">
                    <p>Votre licence SamaFacture a expiré. Pour continuer à utiliser l'application, veuillez renouveler votre licence.</p>
                    <div class="license-actions">
                        <button class="btn btn-primary" onclick="licenseManager.showActivationModal()">
                            <i class="fas fa-key"></i> Activer une licence
                        </button>
                        <button class="btn btn-secondary" onclick="licenseManager.generateNewLicense()">
                            <i class="fas fa-plus"></i> Générer une nouvelle licence
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    /**
     * Afficher le modal de période d'essai
     */
    showTrialStartedModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal license-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-clock"></i> Période d'Essai</h2>
                </div>
                <div class="modal-body">
                    <p>Bienvenue dans SamaFacture ! Vous disposez de <strong>30 jours</strong> d'essai gratuit.</p>
                    <p>Toutes les fonctionnalités sont disponibles pendant cette période.</p>
                    <div class="license-actions">
                        <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">
                            <i class="fas fa-check"></i> Commencer l'essai
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    /**
     * Afficher le modal d'activation de licence
     */
    showActivationModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal license-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-key"></i> Activer une Licence</h2>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Clé de licence</label>
                        <input type="text" id="licenseKeyInput" class="form-control" 
                               placeholder="XXXXX-XXXXX-XXXXX-XXXXX-XXXXX">
                    </div>
                    <div class="license-actions">
                        <button class="btn btn-primary" onclick="licenseManager.activateLicenseFromModal()">
                            <i class="fas fa-check"></i> Activer
                        </button>
                        <button class="btn btn-secondary" onclick="this.parentElement.parentElement.parentElement.remove()">
                            <i class="fas fa-times"></i> Annuler
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    /**
     * Activer la licence depuis le modal
     */
    async activateLicenseFromModal() {
        const input = document.getElementById('licenseKeyInput');
        const licenseKey = input.value.trim();
        
        if (!licenseKey) {
            alert('Veuillez saisir une clé de licence');
            return;
        }

        const success = await this.activateLicense(licenseKey);
        
        if (success) {
            // Fermer le modal
            const modal = input.closest('.modal-overlay');
            if (modal) modal.remove();
        } else {
            alert('Clé de licence invalide');
        }
    }

    /**
     * Afficher le modal de licence activée
     */
    showLicenseActivatedModal() {
        const status = this.getLicenseStatus();
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal license-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-check-circle"></i> Licence Activée</h2>
                </div>
                <div class="modal-body">
                    <p>Votre licence a été activée avec succès !</p>
                    <p><strong>Expire le :</strong> ${status.expiresAt}</p>
                    <p><strong>Jours restants :</strong> ${status.daysRemaining}</p>
                    <div class="license-actions">
                        <button class="btn btn-primary" onclick="this.parentElement.parentElement.parentElement.remove()">
                            <i class="fas fa-check"></i> Continuer
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    /**
     * Générer une nouvelle licence (pour les développeurs)
     */
    async generateNewLicense() {
        const licenseData = await this.generateLicenseKey(30);
        
        console.log('🔑 Nouvelle clé de licence générée:');
        console.log('Clé:', licenseData.licenseKey);
        console.log('Expire le:', licenseData.expiresAt);
        
        // Afficher dans un modal
        const modal = document.createElement('div');
        modal.className = 'modal-overlay';
        modal.innerHTML = `
            <div class="modal license-modal">
                <div class="modal-header">
                    <h2><i class="fas fa-key"></i> Nouvelle Licence Générée</h2>
                </div>
                <div class="modal-body">
                    <div class="form-group">
                        <label class="form-label">Clé de licence (30 jours)</label>
                        <input type="text" class="form-control" value="${licenseData.licenseKey}" readonly>
                        <small class="form-text">Expire le: ${licenseData.expiresAt}</small>
                    </div>
                    <div class="license-actions">
                        <button class="btn btn-primary" onclick="licenseManager.activateLicense('${licenseData.licenseKey}').then(() => this.parentElement.parentElement.parentElement.remove())">
                            <i class="fas fa-check"></i> Activer maintenant
                        </button>
                        <button class="btn btn-secondary" onclick="navigator.clipboard.writeText('${licenseData.licenseKey}')">
                            <i class="fas fa-copy"></i> Copier
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
    }

    /**
     * Obtenir les informations de licence pour l'affichage
     */
    getLicenseInfo() {
        const status = this.getLicenseStatus();
        return {
            ...status,
            machineId: this.machineId,
            licenseId: this.currentLicense?.id || null
        };
    }
}

// Initialiser le gestionnaire de licence
const licenseManager = new LicenseManager();

// Export global
window.LicenseManager = LicenseManager;
window.licenseManager = licenseManager;

// Commandes console pour les développeurs
window.generateLicense = () => licenseManager.generateNewLicense();
window.checkLicense = () => console.log(licenseManager.getLicenseInfo());
window.renewLicense = (days = 30) => licenseManager.generateLicenseKey(days).then(data => console.log('Nouvelle licence:', data));
