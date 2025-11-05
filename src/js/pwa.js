/**
 * SamaFacture - Gestionnaire PWA
 * Gestion des fonctionnalités PWA et Service Worker
 */

class PWAManager {
    constructor() {
        this.swRegistration = null;
        this.isOnline = navigator.onLine;
        this.installPrompt = null;
        
        this.init();
    }

    /**
     * Initialiser le gestionnaire PWA
     */
    async init() {
        console.log('🚀 Initialisation du gestionnaire PWA...');
        
        // Enregistrer le Service Worker
        await this.registerServiceWorker();
        
        // Configurer les événements
        this.setupEventListeners();
        
        // Vérifier les mises à jour
        this.checkForUpdates();
        
        console.log('✅ Gestionnaire PWA initialisé');
    }

    /**
     * Enregistrer le Service Worker
     */
    async registerServiceWorker() {
        if (!('serviceWorker' in navigator)) {
            console.log('❌ Service Worker non supporté');
            return;
        }

        try {
            this.swRegistration = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            console.log('✅ Service Worker enregistré:', this.swRegistration.scope);

            // Écouter les mises à jour
            this.swRegistration.addEventListener('updatefound', () => {
                const newWorker = this.swRegistration.installing;
                
                newWorker.addEventListener('statechange', () => {
                    if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                        this.showUpdateAvailable();
                    }
                });
            });

        } catch (error) {
            console.error('❌ Erreur lors de l\'enregistrement du Service Worker:', error);
        }
    }

    /**
     * Configurer les événements
     */
    setupEventListeners() {
        // Événements de connectivité
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.showConnectivityStatus('online');
            console.log('🌐 Connexion rétablie');
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
            this.showConnectivityStatus('offline');
            console.log('📴 Mode hors ligne activé');
        });

        // Événement d'installation PWA
        window.addEventListener('beforeinstallprompt', (event) => {
            event.preventDefault();
            this.installPrompt = event;
            this.showInstallButton();
        });

        // Événement après installation
        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA installée avec succès');
            this.hideInstallButton();
            this.showToast('Application installée avec succès !', 'success');
        });

        // Messages du Service Worker
        navigator.serviceWorker.addEventListener('message', (event) => {
            this.handleServiceWorkerMessage(event.data);
        });
    }

    /**
     * Vérifier les mises à jour
     */
    async checkForUpdates() {
        if (!this.swRegistration) return;

        try {
            await this.swRegistration.update();
        } catch (error) {
            console.error('❌ Erreur lors de la vérification des mises à jour:', error);
        }
    }

    /**
     * Afficher la notification de mise à jour disponible
     */
    showUpdateAvailable() {
        const updateBanner = document.createElement('div');
        updateBanner.className = 'update-banner';
        updateBanner.innerHTML = `
            <div class="update-content">
                <i class="fas fa-download"></i>
                <span>Une nouvelle version est disponible</span>
                <button class="btn btn-sm btn-primary" onclick="pwaManager.applyUpdate()">
                    Mettre à jour
                </button>
                <button class="btn btn-sm btn-secondary" onclick="this.parentElement.parentElement.remove()">
                    Plus tard
                </button>
            </div>
        `;
        
        document.body.appendChild(updateBanner);
    }

    /**
     * Appliquer la mise à jour
     */
    async applyUpdate() {
        if (!this.swRegistration || !this.swRegistration.waiting) return;

        // Envoyer un message au Service Worker pour qu'il prenne le contrôle
        this.swRegistration.waiting.postMessage({ type: 'SKIP_WAITING' });
        
        // Recharger la page
        window.location.reload();
    }

    /**
     * Afficher le statut de connectivité
     */
    showConnectivityStatus(status) {
        // Supprimer les anciens indicateurs
        const existingIndicator = document.querySelector('.connectivity-indicator');
        if (existingIndicator) {
            existingIndicator.remove();
        }

        const indicator = document.createElement('div');
        indicator.className = `connectivity-indicator ${status}`;
        indicator.innerHTML = `
            <i class="fas fa-${status === 'online' ? 'wifi' : 'wifi-slash'}"></i>
            <span>${status === 'online' ? 'En ligne' : 'Hors ligne'}</span>
        `;
        
        document.body.appendChild(indicator);
        
        // Supprimer après 3 secondes
        setTimeout(() => {
            indicator.remove();
        }, 3000);
    }

    /**
     * Afficher le bouton d'installation
     */
    showInstallButton() {
        // Vérifier si déjà installé
        if (window.matchMedia('(display-mode: standalone)').matches) {
            return;
        }

        const installButton = document.createElement('button');
        installButton.id = 'install-button';
        installButton.className = 'install-button';
        installButton.innerHTML = `
            <i class="fas fa-download"></i>
            <span>Installer l'app</span>
        `;
        
        installButton.addEventListener('click', () => {
            this.installApp();
        });
        
        // Ajouter le bouton dans le header
        const header = document.querySelector('.header-actions');
        if (header) {
            header.appendChild(installButton);
        }
    }

    /**
     * Masquer le bouton d'installation
     */
    hideInstallButton() {
        const installButton = document.getElementById('install-button');
        if (installButton) {
            installButton.remove();
        }
    }

    /**
     * Installer l'application
     */
    async installApp() {
        if (!this.installPrompt) return;

        try {
            const result = await this.installPrompt.prompt();
            console.log('Résultat de l\'installation:', result.outcome);
            
            this.installPrompt = null;
            this.hideInstallButton();
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'installation:', error);
        }
    }

    /**
     * Gérer les messages du Service Worker
     */
    handleServiceWorkerMessage(data) {
        const { type, payload } = data;
        
        switch (type) {
            case 'CACHE_STATUS':
                console.log('📊 Statut du cache:', payload);
                break;
                
            case 'CACHE_CLEARED':
                this.showToast('Cache vidé avec succès', 'success');
                break;
                
            case 'CACHE_UPDATED':
                this.showToast('Cache mis à jour', 'success');
                break;
        }
    }

    /**
     * Obtenir le statut du cache
     */
    async getCacheStatus() {
        if (!navigator.serviceWorker.controller) return null;

        return new Promise((resolve) => {
            const messageChannel = new MessageChannel();
            
            messageChannel.port1.onmessage = (event) => {
                resolve(event.data.payload);
            };
            
            navigator.serviceWorker.controller.postMessage(
                { type: 'GET_CACHE_STATUS' },
                [messageChannel.port2]
            );
        });
    }

    /**
     * Vider le cache
     */
    async clearCache() {
        if (!navigator.serviceWorker.controller) return;

        return new Promise((resolve) => {
            const messageChannel = new MessageChannel();
            
            messageChannel.port1.onmessage = () => {
                resolve();
            };
            
            navigator.serviceWorker.controller.postMessage(
                { type: 'CLEAR_CACHE' },
                [messageChannel.port2]
            );
        });
    }

    /**
     * Mettre à jour le cache
     */
    async updateCache() {
        if (!navigator.serviceWorker.controller) return;

        return new Promise((resolve) => {
            const messageChannel = new MessageChannel();
            
            messageChannel.port1.onmessage = () => {
                resolve();
            };
            
            navigator.serviceWorker.controller.postMessage(
                { type: 'UPDATE_CACHE' },
                [messageChannel.port2]
            );
        });
    }

    /**
     * Vérifier si l'app est installée
     */
    isAppInstalled() {
        return window.matchMedia('(display-mode: standalone)').matches ||
               window.navigator.standalone === true;
    }

    /**
     * Obtenir les informations PWA
     */
    getPWAInfo() {
        return {
            isOnline: this.isOnline,
            isInstalled: this.isAppInstalled(),
            hasServiceWorker: !!this.swRegistration,
            canInstall: !!this.installPrompt,
            swScope: this.swRegistration?.scope || null,
            swState: this.swRegistration?.active?.state || null
        };
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
        toast.innerHTML = `
            <i class="fas fa-${this.getToastIcon(type)}"></i>
            <span>${message}</span>
        `;

        // Ajouter le toast
        toastContainer.appendChild(toast);

        // Supprimer le toast après 3 secondes
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    /**
     * Obtenir l'icône pour le toast
     */
    getToastIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'exclamation-circle',
            warning: 'exclamation-triangle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    /**
     * Enregistrer pour les notifications push (future fonctionnalité)
     */
    async requestNotificationPermission() {
        if (!('Notification' in window)) {
            console.log('❌ Notifications non supportées');
            return false;
        }

        const permission = await Notification.requestPermission();
        console.log('🔔 Permission de notification:', permission);
        
        return permission === 'granted';
    }

    /**
     * Partager l'application
     */
    async shareApp() {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'SamaFacture',
                    text: 'Application de gestion de facturation pour TPE sénégalaises',
                    url: window.location.href
                });
            } catch (error) {
                console.log('❌ Erreur lors du partage:', error);
            }
        } else {
            // Fallback: copier l'URL
            await navigator.clipboard.writeText(window.location.href);
            this.showToast('Lien copié dans le presse-papiers', 'success');
        }
    }
}

// Initialiser le gestionnaire PWA
const pwaManager = new PWAManager();

// Commandes console pour les développeurs
window.getPWAInfo = () => console.log(pwaManager.getPWAInfo());
window.clearPWACache = () => pwaManager.clearCache();
window.updatePWACache = () => pwaManager.updateCache();
