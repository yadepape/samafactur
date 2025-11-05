/**
 * InvoiceManager - Gestionnaire des factures pour SamaFacture
 * Gestion complète des factures avec calculs automatiques et impression
 */

class InvoiceManager {
    constructor() {
        this.invoices = [];
        this.currentInvoice = null;
        this.filters = {
            search: '',
            status: 'all',
            client: '',
            dateFrom: '',
            dateTo: '',
            sortBy: 'invoiceDate',
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
     * Initialisation du gestionnaire de factures
     */
    init() {
        this.loadSampleData();
        this.updatePagination();
    }

    /**
     * Chargement des données d'exemple
     */
    loadSampleData() {
        this.invoices = [
            {
                id: 1,
                invoiceNumber: 'FACT-2024-001',
                clientId: 1,
                clientName: 'Amadou Diallo',
                clientEmail: 'amadou.diallo@email.com',
                clientPhone: '+221 77 123 45 67',
                clientAddress: 'Dakar, Sénégal',
                invoiceDate: '2024-01-15',
                dueDate: '2024-02-14',
                status: 'paid',
                items: [
                    {
                        id: 1,
                        productId: 1,
                        productName: 'Smartphone Samsung Galaxy A54',
                        quantity: 2,
                        unitPrice: 220000,
                        total: 440000
                    },
                    {
                        id: 2,
                        productId: 2,
                        productName: 'T-shirt Coton Bio',
                        quantity: 5,
                        unitPrice: 12000,
                        total: 60000
                    }
                ],
                subtotal: 500000,
                taxRate: 18,
                taxAmount: 90000,
                discount: 0,
                total: 590000,
                notes: 'Merci pour votre confiance',
                paymentMethod: 'Virement bancaire',
                createdAt: '2024-01-15',
                updatedAt: '2024-01-15'
            },
            {
                id: 2,
                invoiceNumber: 'FACT-2024-002',
                clientId: 2,
                clientName: 'Fatou Sall',
                clientEmail: 'fatou.sall@email.com',
                clientPhone: '+221 76 987 65 43',
                clientAddress: 'Thiès, Sénégal',
                invoiceDate: '2024-01-20',
                dueDate: '2024-02-19',
                status: 'pending',
                items: [
                    {
                        id: 1,
                        productId: 3,
                        productName: 'Riz Parfumé 25kg',
                        quantity: 10,
                        unitPrice: 18000,
                        total: 180000
                    }
                ],
                subtotal: 180000,
                taxRate: 18,
                taxAmount: 32400,
                discount: 5000,
                total: 207400,
                notes: 'Livraison gratuite',
                paymentMethod: 'Espèces',
                createdAt: '2024-01-20',
                updatedAt: '2024-01-20'
            },
            {
                id: 3,
                invoiceNumber: 'FACT-2024-003',
                clientId: 1,
                clientName: 'Amadou Diallo',
                clientEmail: 'amadou.diallo@email.com',
                clientPhone: '+221 77 123 45 67',
                clientAddress: 'Dakar, Sénégal',
                invoiceDate: '2024-01-25',
                dueDate: '2024-02-24',
                status: 'overdue',
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
                paymentMethod: 'Mobile Money',
                createdAt: '2024-01-25',
                updatedAt: '2024-01-25'
            }
        ];

        this.updatePagination();
    }

    /**
     * Mise à jour de la pagination
     */
    updatePagination() {
        const filteredInvoices = this.getFilteredInvoices();
        this.pagination.totalItems = filteredInvoices.length;
        this.pagination.totalPages = Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage);
        
        if (this.pagination.currentPage > this.pagination.totalPages) {
            this.pagination.currentPage = Math.max(1, this.pagination.totalPages);
        }
    }

    /**
     * Obtenir les factures filtrées
     */
    getFilteredInvoices() {
        let filtered = [...this.invoices];

        // Filtre par recherche
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(invoice => 
                invoice.invoiceNumber.toLowerCase().includes(searchTerm) ||
                invoice.clientName.toLowerCase().includes(searchTerm) ||
                invoice.clientEmail.toLowerCase().includes(searchTerm)
            );
        }

        // Filtre par statut
        if (this.filters.status !== 'all') {
            filtered = filtered.filter(invoice => invoice.status === this.filters.status);
        }

        // Filtre par client
        if (this.filters.client) {
            filtered = filtered.filter(invoice => invoice.clientId == this.filters.client);
        }

        // Filtre par date
        if (this.filters.dateFrom) {
            filtered = filtered.filter(invoice => invoice.invoiceDate >= this.filters.dateFrom);
        }
        if (this.filters.dateTo) {
            filtered = filtered.filter(invoice => invoice.invoiceDate <= this.filters.dateTo);
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
     * Obtenir les factures paginées
     */
    getPaginatedInvoices() {
        const filtered = this.getFilteredInvoices();
        const startIndex = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
        const endIndex = startIndex + this.pagination.itemsPerPage;
        return filtered.slice(startIndex, endIndex);
    }

    /**
     * Obtenir les statistiques des factures
     */
    getStats() {
        const totalInvoices = this.invoices.length;
        const paidInvoices = this.invoices.filter(i => i.status === 'paid').length;
        const pendingInvoices = this.invoices.filter(i => i.status === 'pending').length;
        const overdueInvoices = this.invoices.filter(i => i.status === 'overdue').length;
        const totalRevenue = this.invoices
            .filter(i => i.status === 'paid')
            .reduce((sum, i) => sum + i.total, 0);
        const pendingAmount = this.invoices
            .filter(i => i.status === 'pending' || i.status === 'overdue')
            .reduce((sum, i) => sum + i.total, 0);

        return {
            totalInvoices,
            paidInvoices,
            pendingInvoices,
            overdueInvoices,
            totalRevenue,
            pendingAmount
        };
    }

    /**
     * Générer le prochain numéro de facture
     */
    generateInvoiceNumber() {
        const year = new Date().getFullYear();
        const maxNumber = Math.max(...this.invoices.map(i => {
            const match = i.invoiceNumber.match(/FACT-(\d{4})-(\d{3})/);
            return match && match[1] == year ? parseInt(match[2]) : 0;
        }), 0);
        
        return `FACT-${year}-${String(maxNumber + 1).padStart(3, '0')}`;
    }

    /**
     * Calculer les totaux d'une facture
     */
    calculateInvoiceTotals(items, taxRate = 18, discount = 0) {
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
            'paid': 'Payée',
            'overdue': 'En retard',
            'cancelled': 'Annulée'
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
            'paid': 'success',
            'overdue': 'danger',
            'cancelled': 'secondary'
        };
        return statusClasses[status] || 'secondary';
    }

    /**
     * Générer le HTML principal de la page factures
     */
    generateHTML() {
        const stats = this.getStats();
        
        return `
            <div class="invoices-container">
                <div class="page-header">
                    <div class="page-title">
                        <h1><i class="fas fa-file-invoice"></i> Gestion des Factures</h1>
                        <p>Créez et gérez vos factures clients</p>
                    </div>
                    <div class="page-actions">
                        <button class="btn btn-secondary" onclick="invoiceManager.exportData()">
                            <i class="fas fa-download"></i> Exporter
                        </button>
                        <button class="btn btn-secondary" onclick="invoiceManager.importData()">
                            <i class="fas fa-upload"></i> Importer
                        </button>
                        <button class="btn btn-primary" onclick="invoiceManager.showInvoiceModal()">
                            <i class="fas fa-plus"></i> Nouvelle Facture
                        </button>
                    </div>
                </div>

                ${this.generateStatsCards(stats)}
                ${this.generateFiltersSection()}
                ${this.generateInvoicesList()}
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
                        <i class="fas fa-file-invoice"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.totalInvoices}</div>
                        <div class="stat-label">Total Factures</div>
                    </div>
                </div>
                
                <div class="stat-card success">
                    <div class="stat-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.paidInvoices}</div>
                        <div class="stat-label">Factures Payées</div>
                    </div>
                </div>
                
                <div class="stat-card warning">
                    <div class="stat-icon">
                        <i class="fas fa-clock"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.pendingInvoices}</div>
                        <div class="stat-label">En Attente</div>
                    </div>
                </div>
                
                <div class="stat-card danger">
                    <div class="stat-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.overdueInvoices}</div>
                        <div class="stat-label">En Retard</div>
                    </div>
                </div>
                
                <div class="stat-card revenue">
                    <div class="stat-icon">
                        <i class="fas fa-coins"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${this.formatPrice(stats.totalRevenue)}</div>
                        <div class="stat-label">Chiffre d'Affaires</div>
                    </div>
                </div>
                
                <div class="stat-card pending-amount">
                    <div class="stat-icon">
                        <i class="fas fa-hourglass-half"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${this.formatPrice(stats.pendingAmount)}</div>
                        <div class="stat-label">Montant en Attente</div>
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
                               id="invoiceSearch" 
                               placeholder="Rechercher par numéro, client..." 
                               value="${this.filters.search}"
                               oninput="invoiceManager.handleSearch(this.value)">
                        <button class="search-clear" onclick="invoiceManager.clearSearch()" ${!this.filters.search ? 'style="display: none;"' : ''}>
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div class="filters-row">
                    <div class="filter-group">
                        <label>Statut</label>
                        <select id="statusFilter" onchange="invoiceManager.handleStatusFilter(this.value)">
                            <option value="all" ${this.filters.status === 'all' ? 'selected' : ''}>Tous</option>
                            <option value="draft" ${this.filters.status === 'draft' ? 'selected' : ''}>Brouillon</option>
                            <option value="pending" ${this.filters.status === 'pending' ? 'selected' : ''}>En attente</option>
                            <option value="paid" ${this.filters.status === 'paid' ? 'selected' : ''}>Payée</option>
                            <option value="overdue" ${this.filters.status === 'overdue' ? 'selected' : ''}>En retard</option>
                            <option value="cancelled" ${this.filters.status === 'cancelled' ? 'selected' : ''}>Annulée</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label>Client</label>
                        <select id="clientFilter" onchange="invoiceManager.handleClientFilter(this.value)">
                            <option value="">Tous les clients</option>
                            ${clientOptions}
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label>Date de</label>
                        <input type="date" id="dateFromFilter" value="${this.filters.dateFrom}" 
                               onchange="invoiceManager.handleDateFromFilter(this.value)">
                    </div>
                    
                    <div class="filter-group">
                        <label>Date à</label>
                        <input type="date" id="dateToFilter" value="${this.filters.dateTo}" 
                               onchange="invoiceManager.handleDateToFilter(this.value)">
                    </div>
                    
                    <div class="filter-group">
                        <label>Trier par</label>
                        <select id="sortFilter" onchange="invoiceManager.handleSort(this.value)">
                            <option value="invoiceDate" ${this.filters.sortBy === 'invoiceDate' ? 'selected' : ''}>Date facture</option>
                            <option value="dueDate" ${this.filters.sortBy === 'dueDate' ? 'selected' : ''}>Date échéance</option>
                            <option value="invoiceNumber" ${this.filters.sortBy === 'invoiceNumber' ? 'selected' : ''}>Numéro</option>
                            <option value="clientName" ${this.filters.sortBy === 'clientName' ? 'selected' : ''}>Client</option>
                            <option value="total" ${this.filters.sortBy === 'total' ? 'selected' : ''}>Montant</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label>Ordre</label>
                        <select id="orderFilter" onchange="invoiceManager.handleOrder(this.value)">
                            <option value="desc" ${this.filters.sortOrder === 'desc' ? 'selected' : ''}>Décroissant</option>
                            <option value="asc" ${this.filters.sortOrder === 'asc' ? 'selected' : ''}>Croissant</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Générer la liste des factures
     */
    generateInvoicesList() {
        const invoices = this.getPaginatedInvoices();
        
        if (invoices.length === 0) {
            return this.generateEmptyState();
        }

        const invoiceRows = invoices.map(invoice => this.generateInvoiceRow(invoice)).join('');

        return `
            <div class="invoices-table-container">
                <table class="invoices-table">
                    <thead>
                        <tr>
                            <th>Numéro</th>
                            <th>Client</th>
                            <th>Date</th>
                            <th>Échéance</th>
                            <th>Montant</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${invoiceRows}
                    </tbody>
                </table>
            </div>
        `;
    }

    /**
     * Générer une ligne de facture
     */
    generateInvoiceRow(invoice) {
        const statusClass = this.getStatusClass(invoice.status);
        const isOverdue = invoice.status === 'overdue';
        const daysDiff = Math.ceil((new Date(invoice.dueDate) - new Date()) / (1000 * 60 * 60 * 24));

        return `
            <tr class="invoice-row" data-invoice-id="${invoice.id}">
                <td class="invoice-number">
                    <span class="invoice-number-text">${invoice.invoiceNumber}</span>
                </td>
                <td class="invoice-client">
                    <div class="client-info">
                        <div class="client-name">${invoice.clientName}</div>
                        <div class="client-email">${invoice.clientEmail}</div>
                    </div>
                </td>
                <td class="invoice-date">
                    <div class="date-info">
                        <div class="date-main">${this.formatDate(invoice.invoiceDate)}</div>
                    </div>
                </td>
                <td class="invoice-due-date">
                    <div class="due-date-info ${isOverdue ? 'overdue' : ''}">
                        <div class="date-main">${this.formatDate(invoice.dueDate)}</div>
                        ${isOverdue ? `<div class="overdue-text">${Math.abs(daysDiff)} jours de retard</div>` : ''}
                    </div>
                </td>
                <td class="invoice-amount">
                    <div class="amount-info">
                        <div class="amount-main">${this.formatPrice(invoice.total)}</div>
                        <div class="amount-details">${invoice.items.length} article${invoice.items.length > 1 ? 's' : ''}</div>
                    </div>
                </td>
                <td class="invoice-status">
                    <span class="status-badge ${statusClass}">${this.getStatusLabel(invoice.status)}</span>
                </td>
                <td class="invoice-actions">
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="invoiceManager.viewInvoice(${invoice.id})" title="Voir détails">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="invoiceManager.editInvoice(${invoice.id})" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="invoiceManager.printInvoice(${invoice.id})" title="Imprimer">
                            <i class="fas fa-print"></i>
                        </button>
                        <button class="btn-icon" onclick="invoiceManager.duplicateInvoice(${invoice.id})" title="Dupliquer">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn-icon danger" onclick="invoiceManager.deleteInvoice(${invoice.id})" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    /**
     * Générer l'état vide
     */
    generateEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-file-invoice"></i>
                </div>
                <h3>Aucune facture trouvée</h3>
                <p>Aucune facture ne correspond à vos critères de recherche.</p>
                <button class="btn btn-primary" onclick="invoiceManager.showInvoiceModal()">
                    <i class="fas fa-plus"></i> Créer une facture
                </button>
            </div>
        `;
    }

    /**
     * Générer la pagination
     */
    generatePagination() {
        if (this.pagination.totalPages <= 1) {
            return '';
        }

        const startItem = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage + 1;
        const endItem = Math.min(startItem + this.pagination.itemsPerPage - 1, this.pagination.totalItems);

        return `
            <div class="pagination-container">
                <div class="pagination-info">
                    Affichage de ${startItem} à ${endItem} sur ${this.pagination.totalItems} factures
                </div>
                <div class="pagination-controls">
                    ${this.generatePageNumbers()}
                </div>
            </div>
        `;
    }

    /**
     * Générer les numéros de pages
     */
    generatePageNumbers() {
        const current = this.pagination.currentPage;
        const total = this.pagination.totalPages;
        let pages = [];

        // Bouton première page
        if (current > 1) {
            pages.push(`<button class="page-btn" onclick="invoiceManager.goToPage(1)">
                <i class="fas fa-angle-double-left"></i>
            </button>`);
            pages.push(`<button class="page-btn" onclick="invoiceManager.goToPage(${current - 1})">
                <i class="fas fa-angle-left"></i>
            </button>`);
        }

        // Numéros de pages (max 5 visibles)
        let startPage = Math.max(1, current - 2);
        let endPage = Math.min(total, current + 2);

        if (endPage - startPage < 4) {
            if (startPage === 1) {
                endPage = Math.min(total, startPage + 4);
            } else {
                startPage = Math.max(1, endPage - 4);
            }
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(`<button class="page-btn ${i === current ? 'active' : ''}" 
                onclick="invoiceManager.goToPage(${i})">${i}</button>`);
        }

        // Bouton dernière page
        if (current < total) {
            pages.push(`<button class="page-btn" onclick="invoiceManager.goToPage(${current + 1})">
                <i class="fas fa-angle-right"></i>
            </button>`);
            pages.push(`<button class="page-btn" onclick="invoiceManager.goToPage(${total})">
                <i class="fas fa-angle-double-right"></i>
            </button>`);
        }

        return pages.join('');
    }

    // ==========================================
    // MÉTHODES D'ACTIONS ET ÉVÉNEMENTS
    // ==========================================

    /**
     * Afficher la modale de création de facture
     */
    showInvoiceModal(invoiceId = null) {
        const invoice = invoiceId ? this.invoices.find(i => i.id == invoiceId) : null;
        const modalHTML = this.generateInvoiceModal(invoice);
        
        document.getElementById('modal-overlay').innerHTML = modalHTML;
        document.getElementById('modal-overlay').style.display = 'flex';
        
        // Initialiser les événements de la modale
        this.initInvoiceModalEvents();
    }

    /**
     * Fermer la modale
     */
    closeModal() {
        document.getElementById('modal-overlay').style.display = 'none';
        document.getElementById('modal-overlay').innerHTML = '';
    }

    /**
     * Voir les détails d'une facture
     */
    viewInvoice(invoiceId) {
        const invoice = this.invoices.find(i => i.id == invoiceId);
        if (!invoice) {
            this.showToast('Facture non trouvée', 'error');
            return;
        }

        const modalHTML = this.generateInvoiceDetailsModal(invoice);
        document.getElementById('modal-overlay').innerHTML = modalHTML;
        document.getElementById('modal-overlay').style.display = 'flex';
    }

    /**
     * Modifier une facture
     */
    editInvoice(invoiceId) {
        this.showInvoiceModal(invoiceId);
    }

    /**
     * Imprimer une facture
     */
    printInvoice(invoiceId) {
        const invoice = this.invoices.find(i => i.id == invoiceId);
        if (!invoice) {
            this.showToast('Facture non trouvée', 'error');
            return;
        }

        // Générer le HTML d'impression
        const printHTML = this.generatePrintableInvoice(invoice);
        
        // Ouvrir dans une nouvelle fenêtre pour impression
        const printWindow = window.open('', '_blank');
        printWindow.document.write(printHTML);
        printWindow.document.close();
        printWindow.focus();
        printWindow.print();
    }

    /**
     * Dupliquer une facture
     */
    duplicateInvoice(invoiceId) {
        const invoice = this.invoices.find(i => i.id == invoiceId);
        if (!invoice) {
            this.showToast('Facture non trouvée', 'error');
            return;
        }

        const duplicatedInvoice = {
            ...invoice,
            id: Math.max(...this.invoices.map(i => i.id), 0) + 1,
            invoiceNumber: this.generateInvoiceNumber(),
            status: 'draft',
            invoiceDate: new Date().toISOString().split('T')[0],
            dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };

        this.invoices.push(duplicatedInvoice);
        this.updatePagination();
        this.render();
        this.showToast('Facture dupliquée avec succès', 'success');
    }

    /**
     * Supprimer une facture
     */
    deleteInvoice(invoiceId) {
        const invoice = this.invoices.find(i => i.id == invoiceId);
        if (!invoice) {
            this.showToast('Facture non trouvée', 'error');
            return;
        }

        const modalHTML = this.generateDeleteModal(invoice);
        document.getElementById('modal-overlay').innerHTML = modalHTML;
        document.getElementById('modal-overlay').style.display = 'flex';
    }

    /**
     * Confirmer la suppression
     */
    confirmDelete(invoiceId) {
        const index = this.invoices.findIndex(i => i.id == invoiceId);
        if (index !== -1) {
            this.invoices.splice(index, 1);
            this.updatePagination();
            this.render();
            this.closeModal();
            this.showToast('Facture supprimée avec succès', 'success');
        }
    }

    // ==========================================
    // MÉTHODES DE FILTRAGE ET NAVIGATION
    // ==========================================

    /**
     * Gérer la recherche avec debounce
     */
    handleSearch(searchTerm) {
        clearTimeout(this.searchTimeout);
        this.searchTimeout = setTimeout(() => {
            this.filters.search = searchTerm;
            this.pagination.currentPage = 1;
            this.updatePagination();
            this.render();
        }, 300);
    }

    /**
     * Nettoyer la recherche
     */
    clearSearch() {
        this.filters.search = '';
        document.getElementById('invoiceSearch').value = '';
        this.pagination.currentPage = 1;
        this.updatePagination();
        this.render();
    }

    /**
     * Filtrer par statut
     */
    handleStatusFilter(status) {
        this.filters.status = status;
        this.pagination.currentPage = 1;
        this.updatePagination();
        this.render();
    }

    /**
     * Filtrer par client
     */
    handleClientFilter(clientId) {
        this.filters.client = clientId;
        this.pagination.currentPage = 1;
        this.updatePagination();
        this.render();
    }

    /**
     * Filtrer par date de début
     */
    handleDateFromFilter(dateFrom) {
        this.filters.dateFrom = dateFrom;
        this.pagination.currentPage = 1;
        this.updatePagination();
        this.render();
    }

    /**
     * Filtrer par date de fin
     */
    handleDateToFilter(dateTo) {
        this.filters.dateTo = dateTo;
        this.pagination.currentPage = 1;
        this.updatePagination();
        this.render();
    }

    /**
     * Gérer le tri
     */
    handleSort(sortBy) {
        this.filters.sortBy = sortBy;
        this.updatePagination();
        this.render();
    }

    /**
     * Gérer l'ordre de tri
     */
    handleOrder(sortOrder) {
        this.filters.sortOrder = sortOrder;
        this.updatePagination();
        this.render();
    }

    /**
     * Aller à une page spécifique
     */
    goToPage(page) {
        if (page >= 1 && page <= this.pagination.totalPages) {
            this.pagination.currentPage = page;
            this.render();
        }
    }

    // ==========================================
    // MÉTHODES D'IMPORT/EXPORT
    // ==========================================

    /**
     * Exporter les données
     */
    exportData() {
        const data = {
            invoices: this.invoices,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `samafacture-factures-${new Date().toISOString().split('T')[0]}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        this.showToast('Données exportées avec succès', 'success');
    }

    /**
     * Importer les données
     */
    importData() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        input.onchange = (event) => {
            const file = event.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    try {
                        const data = JSON.parse(e.target.result);
                        if (data.invoices && Array.isArray(data.invoices)) {
                            this.invoices = data.invoices;
                            this.updatePagination();
                            this.render();
                            this.showToast('Données importées avec succès', 'success');
                        } else {
                            this.showToast('Format de fichier invalide', 'error');
                        }
                    } catch (error) {
                        this.showToast('Erreur lors de l\'importation', 'error');
                    }
                };
                reader.readAsText(file);
            }
        };
        input.click();
    }

    // ==========================================
    // MÉTHODES UTILITAIRES
    // ==========================================

    /**
     * Afficher un toast
     */
    showToast(message, type = 'info') {
        console.log(`Toast ${type}: ${message}`);
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
