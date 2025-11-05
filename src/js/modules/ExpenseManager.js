/**
 * ExpenseManager - Gestionnaire des dépenses pour SamaFacture
 * Gestion complète des dépenses avec catégories et rapports
 */

class ExpenseManager {
    constructor() {
        this.expenses = [];
        this.expenseCategories = [];
        this.currentExpense = null;
        this.filters = {
            search: '',
            category: '',
            dateFrom: '',
            dateTo: '',
            sortBy: 'expenseDate',
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
     * Initialisation du gestionnaire de dépenses
     */
    init() {
        this.loadSampleData();
        this.updatePagination();
    }

    /**
     * Chargement des données d'exemple
     */
    loadSampleData() {
        // Catégories de dépenses
        this.expenseCategories = [
            {
                id: 1,
                name: 'Fournitures de bureau',
                description: 'Papeterie, matériel de bureau',
                color: '#3b82f6',
                icon: 'fas fa-paperclip',
                createdAt: '2024-01-01'
            },
            {
                id: 2,
                name: 'Transport',
                description: 'Carburant, transport, livraisons',
                color: '#10b981',
                icon: 'fas fa-car',
                createdAt: '2024-01-01'
            },
            {
                id: 3,
                name: 'Marketing',
                description: 'Publicité, communication',
                color: '#f59e0b',
                icon: 'fas fa-bullhorn',
                createdAt: '2024-01-01'
            },
            {
                id: 4,
                name: 'Équipement',
                description: 'Matériel, équipements',
                color: '#ef4444',
                icon: 'fas fa-tools',
                createdAt: '2024-01-01'
            },
            {
                id: 5,
                name: 'Services',
                description: 'Prestations externes, consultants',
                color: '#8b5cf6',
                icon: 'fas fa-handshake',
                createdAt: '2024-01-01'
            },
            {
                id: 6,
                name: 'Autres',
                description: 'Dépenses diverses',
                color: '#6b7280',
                icon: 'fas fa-ellipsis-h',
                createdAt: '2024-01-01'
            }
        ];

        // Dépenses d'exemple
        this.expenses = [
            {
                id: 1,
                title: 'Achat papier A4 et stylos',
                description: 'Fournitures pour le bureau - 10 ramettes A4 + stylos',
                amount: 25000,
                categoryId: 1,
                expenseDate: '2024-01-15',
                paymentMethod: 'Espèces',
                supplier: 'Papeterie Moderne',
                receiptNumber: 'REC-001',
                isRecurring: false,
                tags: ['bureau', 'papeterie'],
                createdAt: '2024-01-15',
                updatedAt: '2024-01-15'
            },
            {
                id: 2,
                title: 'Carburant véhicule livraison',
                description: 'Plein d\'essence pour les livraisons de la semaine',
                amount: 45000,
                categoryId: 2,
                expenseDate: '2024-01-18',
                paymentMethod: 'Carte bancaire',
                supplier: 'Station Total',
                receiptNumber: 'REC-002',
                isRecurring: true,
                recurringFrequency: 'weekly',
                tags: ['carburant', 'livraison'],
                createdAt: '2024-01-18',
                updatedAt: '2024-01-18'
            },
            {
                id: 3,
                title: 'Publicité Facebook Ads',
                description: 'Campagne publicitaire pour promotion produits',
                amount: 75000,
                categoryId: 3,
                expenseDate: '2024-01-20',
                paymentMethod: 'Virement bancaire',
                supplier: 'Meta (Facebook)',
                receiptNumber: 'FB-2024-001',
                isRecurring: true,
                recurringFrequency: 'monthly',
                tags: ['publicité', 'facebook', 'marketing'],
                createdAt: '2024-01-20',
                updatedAt: '2024-01-20'
            },
            {
                id: 4,
                title: 'Réparation imprimante',
                description: 'Maintenance et réparation imprimante HP',
                amount: 35000,
                categoryId: 4,
                expenseDate: '2024-01-22',
                paymentMethod: 'Mobile Money',
                supplier: 'TechService Dakar',
                receiptNumber: 'TS-2024-015',
                isRecurring: false,
                tags: ['réparation', 'imprimante', 'maintenance'],
                createdAt: '2024-01-22',
                updatedAt: '2024-01-22'
            },
            {
                id: 5,
                title: 'Consultation comptable',
                description: 'Conseil comptable et fiscal mensuel',
                amount: 50000,
                categoryId: 5,
                expenseDate: '2024-01-25',
                paymentMethod: 'Virement bancaire',
                supplier: 'Cabinet Comptable Sall',
                receiptNumber: 'CCS-2024-001',
                isRecurring: true,
                recurringFrequency: 'monthly',
                tags: ['comptabilité', 'conseil', 'fiscal'],
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
        const filteredExpenses = this.getFilteredExpenses();
        this.pagination.totalItems = filteredExpenses.length;
        this.pagination.totalPages = Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage);
        
        if (this.pagination.currentPage > this.pagination.totalPages) {
            this.pagination.currentPage = Math.max(1, this.pagination.totalPages);
        }
    }

    /**
     * Obtenir les dépenses filtrées
     */
    getFilteredExpenses() {
        let filtered = [...this.expenses];

        // Filtre par recherche
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(expense => 
                expense.title.toLowerCase().includes(searchTerm) ||
                expense.description.toLowerCase().includes(searchTerm) ||
                expense.supplier.toLowerCase().includes(searchTerm) ||
                expense.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        // Filtre par catégorie
        if (this.filters.category) {
            filtered = filtered.filter(expense => expense.categoryId == this.filters.category);
        }

        // Filtre par date
        if (this.filters.dateFrom) {
            filtered = filtered.filter(expense => expense.expenseDate >= this.filters.dateFrom);
        }
        if (this.filters.dateTo) {
            filtered = filtered.filter(expense => expense.expenseDate <= this.filters.dateTo);
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
     * Obtenir les dépenses paginées
     */
    getPaginatedExpenses() {
        const filtered = this.getFilteredExpenses();
        const startIndex = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
        const endIndex = startIndex + this.pagination.itemsPerPage;
        return filtered.slice(startIndex, endIndex);
    }

    /**
     * Obtenir les statistiques des dépenses
     */
    getStats() {
        const totalExpenses = this.expenses.length;
        const totalAmount = this.expenses.reduce((sum, e) => sum + e.amount, 0);
        const recurringExpenses = this.expenses.filter(e => e.isRecurring).length;
        const thisMonthExpenses = this.expenses.filter(e => {
            const expenseDate = new Date(e.expenseDate);
            const now = new Date();
            return expenseDate.getMonth() === now.getMonth() && 
                   expenseDate.getFullYear() === now.getFullYear();
        });
        const thisMonthAmount = thisMonthExpenses.reduce((sum, e) => sum + e.amount, 0);
        
        // Dépenses par catégorie
        const expensesByCategory = this.expenseCategories.map(category => {
            const categoryExpenses = this.expenses.filter(e => e.categoryId === category.id);
            const categoryAmount = categoryExpenses.reduce((sum, e) => sum + e.amount, 0);
            return {
                category: category.name,
                amount: categoryAmount,
                count: categoryExpenses.length,
                color: category.color
            };
        }).filter(item => item.amount > 0);

        return {
            totalExpenses,
            totalAmount,
            recurringExpenses,
            thisMonthExpenses: thisMonthExpenses.length,
            thisMonthAmount,
            expensesByCategory,
            averageExpense: totalExpenses > 0 ? totalAmount / totalExpenses : 0
        };
    }

    /**
     * Obtenir une catégorie par ID
     */
    getCategoryById(id) {
        return this.expenseCategories.find(cat => cat.id == id);
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
     * Obtenir le libellé de la fréquence
     */
    getFrequencyLabel(frequency) {
        const frequencyLabels = {
            'weekly': 'Hebdomadaire',
            'monthly': 'Mensuelle',
            'quarterly': 'Trimestrielle',
            'yearly': 'Annuelle'
        };
        return frequencyLabels[frequency] || '';
    }

    /**
     * Générer le HTML principal de la page dépenses
     */
    generateHTML() {
        const stats = this.getStats();
        
        return `
            <div class="expenses-container">
                <div class="page-header">
                    <div class="page-title">
                        <h1><i class="fas fa-receipt"></i> Gestion des Dépenses</h1>
                        <p>Suivez et analysez vos dépenses d'entreprise</p>
                    </div>
                    <div class="page-actions">
                        <button class="btn btn-secondary" onclick="expenseManager.exportData()">
                            <i class="fas fa-download"></i> Exporter
                        </button>
                        <button class="btn btn-secondary" onclick="expenseManager.generateReport()">
                            <i class="fas fa-chart-bar"></i> Rapport
                        </button>
                        <button class="btn btn-primary" onclick="expenseManager.showExpenseModal()">
                            <i class="fas fa-plus"></i> Nouvelle Dépense
                        </button>
                    </div>
                </div>

                ${this.generateStatsCards(stats)}
                ${this.generateCategoryChart(stats)}
                ${this.generateFiltersSection()}
                ${this.generateExpensesList()}
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
                        <i class="fas fa-receipt"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.totalExpenses}</div>
                        <div class="stat-label">Total Dépenses</div>
                    </div>
                </div>
                
                <div class="stat-card amount">
                    <div class="stat-icon">
                        <i class="fas fa-coins"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${this.formatPrice(stats.totalAmount)}</div>
                        <div class="stat-label">Montant Total</div>
                    </div>
                </div>
                
                <div class="stat-card month">
                    <div class="stat-icon">
                        <i class="fas fa-calendar-alt"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${this.formatPrice(stats.thisMonthAmount)}</div>
                        <div class="stat-label">Ce Mois</div>
                    </div>
                </div>
                
                <div class="stat-card recurring">
                    <div class="stat-icon">
                        <i class="fas fa-sync-alt"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.recurringExpenses}</div>
                        <div class="stat-label">Récurrentes</div>
                    </div>
                </div>
                
                <div class="stat-card average">
                    <div class="stat-icon">
                        <i class="fas fa-calculator"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${this.formatPrice(stats.averageExpense)}</div>
                        <div class="stat-label">Moyenne</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Générer le graphique des catégories
     */
    generateCategoryChart(stats) {
        if (stats.expensesByCategory.length === 0) {
            return '';
        }

        const categoryItems = stats.expensesByCategory.map(item => `
            <div class="category-item">
                <div class="category-info">
                    <div class="category-color" style="background-color: ${item.color}"></div>
                    <div class="category-details">
                        <div class="category-name">${item.category}</div>
                        <div class="category-count">${item.count} dépense${item.count > 1 ? 's' : ''}</div>
                    </div>
                </div>
                <div class="category-amount">${this.formatPrice(item.amount)}</div>
            </div>
        `).join('');

        return `
            <div class="category-chart-section">
                <h2><i class="fas fa-chart-pie"></i> Dépenses par Catégorie</h2>
                <div class="category-chart">
                    ${categoryItems}
                </div>
            </div>
        `;
    }

    /**
     * Générer la section des filtres
     */
    generateFiltersSection() {
        const categoryOptions = this.expenseCategories.map(cat => 
            `<option value="${cat.id}" ${this.filters.category == cat.id ? 'selected' : ''}>${cat.name}</option>`
        ).join('');

        return `
            <div class="filters-section">
                <div class="search-container">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" 
                               id="expenseSearch" 
                               placeholder="Rechercher par titre, fournisseur, tags..." 
                               value="${this.filters.search}"
                               oninput="expenseManager.handleSearch(this.value)">
                        <button class="search-clear" onclick="expenseManager.clearSearch()" ${!this.filters.search ? 'style="display: none;"' : ''}>
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div class="filters-row">
                    <div class="filter-group">
                        <label>Catégorie</label>
                        <select id="categoryFilter" onchange="expenseManager.handleCategoryFilter(this.value)">
                            <option value="">Toutes les catégories</option>
                            ${categoryOptions}
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label>Date de</label>
                        <input type="date" id="dateFromFilter" value="${this.filters.dateFrom}" 
                               onchange="expenseManager.handleDateFromFilter(this.value)">
                    </div>
                    
                    <div class="filter-group">
                        <label>Date à</label>
                        <input type="date" id="dateToFilter" value="${this.filters.dateTo}" 
                               onchange="expenseManager.handleDateToFilter(this.value)">
                    </div>
                    
                    <div class="filter-group">
                        <label>Trier par</label>
                        <select id="sortFilter" onchange="expenseManager.handleSort(this.value)">
                            <option value="expenseDate" ${this.filters.sortBy === 'expenseDate' ? 'selected' : ''}>Date</option>
                            <option value="amount" ${this.filters.sortBy === 'amount' ? 'selected' : ''}>Montant</option>
                            <option value="title" ${this.filters.sortBy === 'title' ? 'selected' : ''}>Titre</option>
                            <option value="supplier" ${this.filters.sortBy === 'supplier' ? 'selected' : ''}>Fournisseur</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label>Ordre</label>
                        <select id="orderFilter" onchange="expenseManager.handleOrder(this.value)">
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

// Instanciation et exposition globale
const expenseManager = new ExpenseManager();
window.ExpenseManager = ExpenseManager;
window.expenseManager = expenseManager;
