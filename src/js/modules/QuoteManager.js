/**
 * QuoteManager - Gestionnaire des devis pour SamaFacture
 * Gestion complète des devis avec conversion en factures
 */

class QuoteManager {
    constructor() {
        this.quotes = [];
        this.currentQuote = null;
        this.filters = {
            search: '',
            status: 'all',
            client: '',
            dateFrom: '',
            dateTo: '',
            sortBy: 'quoteDate',
            sortOrder: 'desc'
        };
        this.pagination = {
            currentPage: 1,
            itemsPerPage: 10,
            totalItems: 0,
            totalPages: 0
        };
        
        this.init();
    }

    /**
     * Initialisation du gestionnaire de devis
     */
    init() {
        this.loadSampleData();
        this.updatePagination();
    }

    /**
     * Chargement des données d'exemple
     */
    loadSampleData() {
        this.quotes = [
            {
                id: 1,
                quoteNumber: 'DEVIS-2024-001',
                clientId: 1,
                clientName: 'Amadou Diallo',
                clientEmail: 'amadou.diallo@email.com',
                clientPhone: '+221 77 123 45 67',
                clientAddress: 'Dakar, Sénégal',
                quoteDate: '2024-01-10',
                validUntil: '2024-02-09',
                status: 'accepted',
                items: [
                    {
                        id: 1,
                        productId: 1,
                        productName: 'Smartphone Samsung Galaxy A54',
                        quantity: 3,
                        unitPrice: 220000,
                        total: 660000
                    },
                    {
                        id: 2,
                        productId: 2,
                        productName: 'T-shirt Coton Bio',
                        quantity: 10,
                        unitPrice: 12000,
                        total: 120000
                    }
                ],
                subtotal: 780000,
                taxRate: 18,
                taxAmount: 140400,
                discount: 20000,
                total: 900400,
                notes: 'Remise de fidélité appliquée',
                terms: 'Devis valable 30 jours. Livraison sous 7 jours.',
                createdAt: '2024-01-10',
                updatedAt: '2024-01-15'
            },
            {
                id: 2,
                quoteNumber: 'DEVIS-2024-002',
                clientId: 2,
                clientName: 'Fatou Sall',
                clientEmail: 'fatou.sall@email.com',
                clientPhone: '+221 76 987 65 43',
                clientAddress: 'Thiès, Sénégal',
                quoteDate: '2024-01-18',
                validUntil: '2024-02-17',
                status: 'pending',
                items: [
                    {
                        id: 1,
                        productId: 3,
                        productName: 'Riz Parfumé 25kg',
                        quantity: 20,
                        unitPrice: 18000,
                        total: 360000
                    }
                ],
                subtotal: 360000,
                taxRate: 18,
                taxAmount: 64800,
                discount: 0,
                total: 424800,
                notes: 'Commande en gros',
                terms: 'Paiement à la livraison. Transport inclus.',
                createdAt: '2024-01-18',
                updatedAt: '2024-01-18'
            },
            {
                id: 3,
                quoteNumber: 'DEVIS-2024-003',
                clientId: 3,
                clientName: 'Moussa Ba',
                clientEmail: 'moussa.ba@email.com',
                clientPhone: '+221 78 456 78 90',
                clientAddress: 'Saint-Louis, Sénégal',
                quoteDate: '2024-01-22',
                validUntil: '2024-02-21',
                status: 'expired',
                items: [
                    {
                        id: 1,
                        productId: 1,
                        productName: 'Smartphone Samsung Galaxy A54',
                        quantity: 1,
                        unitPrice: 220000,
                        total: 220000
                    }
                ],
                subtotal: 220000,
                taxRate: 18,
                taxAmount: 39600,
                discount: 0,
                total: 259600,
                notes: '',
                terms: 'Garantie 2 ans constructeur.',
                createdAt: '2024-01-22',
                updatedAt: '2024-01-22'
            }
        ];

        this.updatePagination();
    }

    /**
     * Mise à jour de la pagination
     */
    updatePagination() {
        const filteredQuotes = this.getFilteredQuotes();
        this.pagination.totalItems = filteredQuotes.length;
        this.pagination.totalPages = Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage);
        
        if (this.pagination.currentPage > this.pagination.totalPages) {
            this.pagination.currentPage = Math.max(1, this.pagination.totalPages);
        }
    }

    /**
     * Obtenir les devis filtrés
     */
    getFilteredQuotes() {
        let filtered = [...this.quotes];

        // Filtre par recherche
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(quote => 
                quote.quoteNumber.toLowerCase().includes(searchTerm) ||
                quote.clientName.toLowerCase().includes(searchTerm) ||
                quote.clientEmail.toLowerCase().includes(searchTerm)
            );
        }

        // Filtre par statut
        if (this.filters.status !== 'all') {
            filtered = filtered.filter(quote => quote.status === this.filters.status);
        }

        // Filtre par client
        if (this.filters.client) {
            filtered = filtered.filter(quote => quote.clientId == this.filters.client);
        }

        // Filtre par date
        if (this.filters.dateFrom) {
            filtered = filtered.filter(quote => quote.quoteDate >= this.filters.dateFrom);
        }
        if (this.filters.dateTo) {
            filtered = filtered.filter(quote => quote.quoteDate <= this.filters.dateTo);
        }

        // Tri
        filtered.sort((a, b) => {
            let aValue = a[this.filters.sortBy];
            let bValue = b[this.filters.sortBy];

            if (typeof aValue === 'string') {
                aValue = aValue.toLowerCase();
                bValue = bValue.toLowerCase();
            }

            if (this.filters.sortOrder === 'asc') {
                return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
            } else {
                return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
            }
        });

        return filtered;
    }

    /**
     * Obtenir les devis paginés
     */
    getPaginatedQuotes() {
        const filtered = this.getFilteredQuotes();
        const startIndex = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
        const endIndex = startIndex + this.pagination.itemsPerPage;
        return filtered.slice(startIndex, endIndex);
    }

    /**
     * Obtenir les statistiques des devis
     */
    getStats() {
        const totalQuotes = this.quotes.length;
        const pendingQuotes = this.quotes.filter(q => q.status === 'pending').length;
        const acceptedQuotes = this.quotes.filter(q => q.status === 'accepted').length;
        const rejectedQuotes = this.quotes.filter(q => q.status === 'rejected').length;
        const expiredQuotes = this.quotes.filter(q => q.status === 'expired').length;
        const totalValue = this.quotes.reduce((sum, q) => sum + q.total, 0);
        const acceptedValue = this.quotes
            .filter(q => q.status === 'accepted')
            .reduce((sum, q) => sum + q.total, 0);

        return {
            totalQuotes,
            pendingQuotes,
            acceptedQuotes,
            rejectedQuotes,
            expiredQuotes,
            totalValue,
            acceptedValue
        };
    }

    /**
     * Générer le prochain numéro de devis
     */
    generateQuoteNumber() {
        const year = new Date().getFullYear();
        const maxNumber = Math.max(...this.quotes.map(q => {
            const match = q.quoteNumber.match(/DEVIS-(\d{4})-(\d{3})/);
            return match && match[1] == year ? parseInt(match[2]) : 0;
        }), 0);
        
        return `DEVIS-${year}-${String(maxNumber + 1).padStart(3, '0')}`;
    }

    /**
     * Calculer les totaux d'un devis
     */
    calculateQuoteTotals(items, taxRate = 18, discount = 0) {
        const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.unitPrice), 0);
        const taxAmount = (subtotal * taxRate) / 100;
        const total = subtotal + taxAmount - discount;

        return {
            subtotal,
            taxAmount,
            total
        };
    }

    /**
     * Convertir un devis en facture
     */
    convertToInvoice(quoteId) {
        const quote = this.quotes.find(q => q.id == quoteId);
        if (!quote) {
            this.showToast('Devis non trouvé', 'error');
            return;
        }

        if (quote.status !== 'accepted') {
            this.showToast('Seuls les devis acceptés peuvent être convertis en facture', 'error');
            return;
        }

        // Créer une nouvelle facture basée sur le devis
        const invoice = {
            id: Math.max(...(window.app?.managers?.invoices?.invoices?.map(i => i.id) || [0]), 0) + 1,
            invoiceNumber: this.generateInvoiceNumber(),
            clientId: quote.clientId,
            clientName: quote.clientName,
            clientEmail: quote.clientEmail,
            clientPhone: quote.clientPhone,
            clientAddress: quote.clientAddress,
            invoiceDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: 'pending',
            items: [...quote.items],
            subtotal: quote.subtotal,
            taxRate: quote.taxRate,
            taxAmount: quote.taxAmount,
            discount: quote.discount,
            total: quote.total,
            notes: quote.notes,
            paymentMethod: '',
            quoteId: quote.id,
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };

        // Ajouter la facture au gestionnaire de factures si disponible
        if (window.app?.managers?.invoices) {
            window.app.managers.invoices.invoices.push(invoice);
            window.app.managers.invoices.updatePagination();
        }

        this.showToast('Devis converti en facture avec succès', 'success');
        
        // Optionnel : naviguer vers les factures
        if (window.app) {
            window.app.loadModule('invoices');
        }
    }

    /**
     * Générer un numéro de facture
     */
    generateInvoiceNumber() {
        const year = new Date().getFullYear();
        const invoices = window.app?.managers?.invoices?.invoices || [];
        const maxNumber = Math.max(...invoices.map(i => {
            const match = i.invoiceNumber.match(/FACT-(\d{4})-(\d{3})/);
            return match && match[1] == year ? parseInt(match[2]) : 0;
        }), 0);
        
        return `FACT-${year}-${String(maxNumber + 1).padStart(3, '0')}`;
    }

    /**
     * Formater le prix en FCFA
     */
    formatPrice(price) {
        return new Intl.NumberFormat('fr-SN', {
            style: 'currency',
            currency: 'XOF',
            minimumFractionDigits: 0
        }).format(price);
    }

    /**
     * Formater la date
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-SN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    /**
     * Obtenir le libellé du statut
     */
    getStatusLabel(status) {
        const statusLabels = {
            'draft': 'Brouillon',
            'pending': 'En attente',
            'accepted': 'Accepté',
            'rejected': 'Refusé',
            'expired': 'Expiré'
        };
        return statusLabels[status] || 'Inconnu';
    }

    /**
     * Obtenir la classe CSS du statut
     */
    getStatusClass(status) {
        const statusClasses = {
            'draft': 'secondary',
            'pending': 'warning',
            'accepted': 'success',
            'rejected': 'danger',
            'expired': 'secondary'
        };
        return statusClasses[status] || 'secondary';
    }

    /**
     * Vérifier si un devis est expiré
     */
    isExpired(quote) {
        const today = new Date();
        const validUntil = new Date(quote.validUntil);
        return today > validUntil && quote.status === 'pending';
    }

    /**
     * Mettre à jour les statuts expirés
     */
    updateExpiredQuotes() {
        let updated = false;
        this.quotes.forEach(quote => {
            if (this.isExpired(quote)) {
                quote.status = 'expired';
                quote.updatedAt = new Date().toISOString().split('T')[0];
                updated = true;
            }
        });
        
        if (updated) {
            this.updatePagination();
        }
        
        return updated;
    }

    /**
     * Générer le HTML principal de la page devis
     */
    generateHTML() {
        // Mettre à jour les devis expirés
        this.updateExpiredQuotes();
        
        const stats = this.getStats();
        
        return `
            <div class="quotes-container">
                <div class="page-header">
                    <div class="page-title">
                        <h1><i class="fas fa-file-alt"></i> Gestion des Devis</h1>
                        <p>Créez et gérez vos devis clients</p>
                    </div>
                    <div class="page-actions">
                        <button class="btn btn-secondary" onclick="quoteManager.exportData()">
                            <i class="fas fa-download"></i> Exporter
                        </button>
                        <button class="btn btn-secondary" onclick="quoteManager.importData()">
                            <i class="fas fa-upload"></i> Importer
                        </button>
                        <button class="btn btn-primary" onclick="quoteManager.showQuoteModal()">
                            <i class="fas fa-plus"></i> Nouveau Devis
                        </button>
                    </div>
                </div>

                ${this.generateStatsCards(stats)}
                ${this.generateFiltersSection()}
                ${this.generateQuotesList()}
                ${this.generatePagination()}
            </div>
        `;
    }

    /**
     * Générer les cartes de statistiques
     */
    generateStatsCards(stats) {
        return `
            <div class="stats-grid">
                <div class="stat-card total">
                    <div class="stat-icon">
                        <i class="fas fa-file-alt"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.totalQuotes}</div>
                        <div class="stat-label">Total Devis</div>
                    </div>
                </div>
                
                <div class="stat-card warning">
                    <div class="stat-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.pendingQuotes}</div>
                        <div class="stat-label">En Attente</div>
                    </div>
                </div>
                
                <div class="stat-card success">
                    <div class="stat-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.acceptedQuotes}</div>
                        <div class="stat-label">Acceptés</div>
                    </div>
                </div>
                
                <div class="stat-card danger">
                    <div class="stat-icon">
                        <i class="fas fa-times-circle"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.rejectedQuotes}</div>
                        <div class="stat-label">Refusés</div>
                    </div>
                </div>
                
                <div class="stat-card secondary">
                    <div class="stat-icon">
                        <i class="fas fa-calendar-times"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.expiredQuotes}</div>
                        <div class="stat-label">Expirés</div>
                    </div>
                </div>
                
                <div class="stat-card value">
                    <div class="stat-icon">
                        <i class="fas fa-coins"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${this.formatPrice(stats.acceptedValue)}</div>
                        <div class="stat-label">Valeur Acceptée</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Générer la section des filtres
     */
    generateFiltersSection() {
        // Récupérer la liste des clients (simulation)
        const clients = [
            { id: 1, name: 'Amadou Diallo' },
            { id: 2, name: 'Fatou Sall' },
            { id: 3, name: 'Moussa Ba' }
        ];

        const clientOptions = clients.map(client => 
            `<option value="${client.id}" ${this.filters.client == client.id ? 'selected' : ''}>${client.name}</option>`
        ).join('');

        return `
            <div class="filters-section">
                <div class="search-container">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" 
                               id="quoteSearch" 
                               placeholder="Rechercher par numéro, client..." 
                               value="${this.filters.search}"
                               oninput="quoteManager.handleSearch(this.value)">
                        <button class="search-clear" onclick="quoteManager.clearSearch()" ${!this.filters.search ? 'style="display: none;"' : ''}>
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div class="filters-row">
                    <div class="filter-group">
                        <label>Statut</label>
                        <select id="statusFilter" onchange="quoteManager.handleStatusFilter(this.value)">
                            <option value="all" ${this.filters.status === 'all' ? 'selected' : ''}>Tous</option>
                            <option value="draft" ${this.filters.status === 'draft' ? 'selected' : ''}>Brouillon</option>
                            <option value="pending" ${this.filters.status === 'pending' ? 'selected' : ''}>En attente</option>
                            <option value="accepted" ${this.filters.status === 'accepted' ? 'selected' : ''}>Accepté</option>
                            <option value="rejected" ${this.filters.status === 'rejected' ? 'selected' : ''}>Refusé</option>
                            <option value="expired" ${this.filters.status === 'expired' ? 'selected' : ''}>Expiré</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label>Client</label>
                        <select id="clientFilter" onchange="quoteManager.handleClientFilter(this.value)">
                            <option value="">Tous les clients</option>
                            ${clientOptions}
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label>Date de</label>
                        <input type="date" id="dateFromFilter" value="${this.filters.dateFrom}" 
                               onchange="quoteManager.handleDateFromFilter(this.value)">
                    </div>
                    
                    <div class="filter-group">
                        <label>Date à</label>
                        <input type="date" id="dateToFilter" value="${this.filters.dateTo}" 
                               onchange="quoteManager.handleDateToFilter(this.value)">
                    </div>
                    
                    <div class="filter-group">
                        <label>Trier par</label>
                        <select id="sortFilter" onchange="quoteManager.handleSort(this.value)">
                            <option value="quoteDate" ${this.filters.sortBy === 'quoteDate' ? 'selected' : ''}>Date devis</option>
                            <option value="validUntil" ${this.filters.sortBy === 'validUntil' ? 'selected' : ''}>Date validité</option>
                            <option value="quoteNumber" ${this.filters.sortBy === 'quoteNumber' ? 'selected' : ''}>Numéro</option>
                            <option value="clientName" ${this.filters.sortBy === 'clientName' ? 'selected' : ''}>Client</option>
                            <option value="total" ${this.filters.sortBy === 'total' ? 'selected' : ''}>Montant</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label>Ordre</label>
                        <select id="orderFilter" onchange="quoteManager.handleOrder(this.value)">
                            <option value="desc" ${this.filters.sortOrder === 'desc' ? 'selected' : ''}>Décroissant</option>
                            <option value="asc" ${this.filters.sortOrder === 'asc' ? 'selected' : ''}>Croissant</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Rendre l'interface
     */
    render() {
        const container = document.getElementById('main-content');
        if (container) {
            container.innerHTML = this.generateHTML();
        }
    }
}
