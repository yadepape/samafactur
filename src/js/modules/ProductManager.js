/**
 * ProductManager - Gestionnaire des produits pour SamaFacture
 * Gestion complète des produits avec catégories, stocks et tarification
 */

class ProductManager {
    constructor() {
        this.products = [];
        this.categories = [];
        this.currentProduct = null;
        this.filters = {
            search: '',
            category: '',
            status: 'all',
            sortBy: 'name',
            sortOrder: 'asc'
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
     * Initialisation du gestionnaire de produits
     */
    init() {
        this.loadSampleData();
        this.updatePagination();
    }

    /**
     * Chargement des données d'exemple
     */
    loadSampleData() {
        // Catégories d'exemple
        this.categories = [
            {
                id: 1,
                name: 'Électronique',
                description: 'Appareils électroniques et accessoires',
                color: '#3b82f6',
                icon: 'fas fa-laptop',
                parentId: null,
                createdAt: '2024-01-15'
            },
            {
                id: 2,
                name: 'Vêtements',
                description: 'Vêtements et accessoires de mode',
                color: '#10b981',
                icon: 'fas fa-tshirt',
                parentId: null,
                createdAt: '2024-01-20'
            },
            {
                id: 3,
                name: 'Alimentation',
                description: 'Produits alimentaires et boissons',
                color: '#f59e0b',
                icon: 'fas fa-utensils',
                parentId: null,
                createdAt: '2024-01-25'
            }
        ];

        // Produits d'exemple
        this.products = [
            {
                id: 1,
                name: 'Smartphone Samsung Galaxy A54',
                description: 'Smartphone Android avec écran 6.4" et appareil photo 50MP',
                sku: 'SAMS-A54-128',
                barcode: '8806094937329',
                categoryId: 1,
                purchasePrice: 180000,
                sellingPrice: 220000,
                margin: 22.22,
                stock: 15,
                minStock: 5,
                maxStock: 50,
                unit: 'pièce',
                weight: 0.202,
                dimensions: '15.8 x 7.7 x 0.8 cm',
                supplier: 'Samsung Sénégal',
                status: 'active',
                images: [],
                tags: ['smartphone', 'android', 'samsung'],
                createdAt: '2024-01-15',
                updatedAt: '2024-01-15'
            },
            {
                id: 2,
                name: 'T-shirt Coton Bio',
                description: 'T-shirt en coton biologique, disponible en plusieurs couleurs',
                sku: 'TSHIRT-BIO-M',
                barcode: '2000000000021',
                categoryId: 2,
                purchasePrice: 8000,
                sellingPrice: 12000,
                margin: 33.33,
                stock: 45,
                minStock: 10,
                maxStock: 100,
                unit: 'pièce',
                weight: 0.15,
                dimensions: 'Taille M',
                supplier: 'Textile Dakar',
                status: 'active',
                images: [],
                tags: ['vêtement', 'coton', 'bio'],
                createdAt: '2024-01-20',
                updatedAt: '2024-01-20'
            },
            {
                id: 3,
                name: 'Riz Parfumé 25kg',
                description: 'Riz parfumé de qualité supérieure, sac de 25kg',
                sku: 'RIZ-PARF-25KG',
                barcode: '3000000000031',
                categoryId: 3,
                purchasePrice: 15000,
                sellingPrice: 18000,
                margin: 16.67,
                stock: 8,
                minStock: 5,
                maxStock: 30,
                unit: 'sac',
                weight: 25,
                dimensions: '60 x 40 x 15 cm',
                supplier: 'Import Céréales',
                status: 'low_stock',
                images: [],
                tags: ['riz', 'céréale', '25kg'],
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
        const filteredProducts = this.getFilteredProducts();
        this.pagination.totalItems = filteredProducts.length;
        this.pagination.totalPages = Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage);
        
        if (this.pagination.currentPage > this.pagination.totalPages) {
            this.pagination.currentPage = Math.max(1, this.pagination.totalPages);
        }
    }

    /**
     * Obtenir les produits filtrés
     */
    getFilteredProducts() {
        let filtered = [...this.products];

        // Filtre par recherche
        if (this.filters.search) {
            const searchTerm = this.filters.search.toLowerCase();
            filtered = filtered.filter(product => 
                product.name.toLowerCase().includes(searchTerm) ||
                product.description.toLowerCase().includes(searchTerm) ||
                product.sku.toLowerCase().includes(searchTerm) ||
                product.barcode.includes(searchTerm) ||
                product.tags.some(tag => tag.toLowerCase().includes(searchTerm))
            );
        }

        // Filtre par catégorie
        if (this.filters.category) {
            filtered = filtered.filter(product => product.categoryId == this.filters.category);
        }

        // Filtre par statut
        if (this.filters.status !== 'all') {
            filtered = filtered.filter(product => product.status === this.filters.status);
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
     * Obtenir les produits paginés
     */
    getPaginatedProducts() {
        const filtered = this.getFilteredProducts();
        const startIndex = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
        const endIndex = startIndex + this.pagination.itemsPerPage;
        return filtered.slice(startIndex, endIndex);
    }

    /**
     * Obtenir les statistiques des produits
     */
    getStats() {
        const totalProducts = this.products.length;
        const activeProducts = this.products.filter(p => p.status === 'active').length;
        const lowStockProducts = this.products.filter(p => p.stock <= p.minStock).length;
        const outOfStockProducts = this.products.filter(p => p.stock === 0).length;
        const totalValue = this.products.reduce((sum, p) => sum + (p.sellingPrice * p.stock), 0);

        return {
            totalProducts,
            activeProducts,
            lowStockProducts,
            outOfStockProducts,
            totalValue
        };
    }

    /**
     * Obtenir une catégorie par ID
     */
    getCategoryById(id) {
        return this.categories.find(cat => cat.id == id);
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
            month: 'short',
            day: 'numeric'
        });
    }

    /**
     * Générer le HTML principal de la page produits
     */
    generateHTML() {
        const stats = this.getStats();
        
        return `
            <div class="page-header">
                <div class="page-title">
                    <h1><i class="fas fa-box"></i> Gestion des Produits</h1>
                    <p>Gérez votre catalogue de produits et catégories</p>
                </div>
                <div class="page-actions">
                    <button class="btn btn-secondary" onclick="productManager.exportData()">
                        <i class="fas fa-download"></i> Exporter
                    </button>
                    <button class="btn btn-secondary" onclick="productManager.importData()">
                        <i class="fas fa-upload"></i> Importer
                    </button>
                    <button class="btn btn-primary" onclick="productManager.showProductModal()">
                        <i class="fas fa-plus"></i> Nouveau Produit
                    </button>
                </div>
            </div>

            ${this.generateStatsCards(stats)}
            ${this.generateFiltersSection()}
            ${this.generateProductsList()}
            ${this.generatePagination()}
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
                        <i class="fas fa-box"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.totalProducts}</div>
                        <div class="stat-label">Total Produits</div>
                    </div>
                </div>
                
                <div class="stat-card active">
                    <div class="stat-icon">
                        <i class="fas fa-check-circle"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.activeProducts}</div>
                        <div class="stat-label">Produits Actifs</div>
                    </div>
                </div>
                
                <div class="stat-card warning">
                    <div class="stat-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${stats.lowStockProducts}</div>
                        <div class="stat-label">Stock Faible</div>
                    </div>
                </div>
                
                <div class="stat-card value">
                    <div class="stat-icon">
                        <i class="fas fa-coins"></i>
                    </div>
                    <div class="stat-content">
                        <div class="stat-number">${this.formatPrice(stats.totalValue)}</div>
                        <div class="stat-label">Valeur Stock</div>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Générer la section des filtres
     */
    generateFiltersSection() {
        const categoryOptions = this.categories.map(cat => 
            `<option value="${cat.id}" ${this.filters.category == cat.id ? 'selected' : ''}>${cat.name}</option>`
        ).join('');

        return `
            <div class="filters-section">
                <div class="search-container">
                    <div class="search-box">
                        <i class="fas fa-search"></i>
                        <input type="text" 
                               id="productSearch" 
                               placeholder="Rechercher par nom, SKU, code-barres..." 
                               value="${this.filters.search}"
                               oninput="productManager.handleSearch(this.value)">
                        <button class="search-clear" onclick="productManager.clearSearch()" ${!this.filters.search ? 'style="display: none;"' : ''}>
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
                
                <div class="filters-row">
                    <div class="filter-group">
                        <label>Catégorie</label>
                        <select id="categoryFilter" onchange="productManager.handleCategoryFilter(this.value)">
                            <option value="">Toutes les catégories</option>
                            ${categoryOptions}
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label>Statut</label>
                        <select id="statusFilter" onchange="productManager.handleStatusFilter(this.value)">
                            <option value="all" ${this.filters.status === 'all' ? 'selected' : ''}>Tous</option>
                            <option value="active" ${this.filters.status === 'active' ? 'selected' : ''}>Actif</option>
                            <option value="low_stock" ${this.filters.status === 'low_stock' ? 'selected' : ''}>Stock faible</option>
                            <option value="out_of_stock" ${this.filters.status === 'out_of_stock' ? 'selected' : ''}>Rupture</option>
                            <option value="inactive" ${this.filters.status === 'inactive' ? 'selected' : ''}>Inactif</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label>Trier par</label>
                        <select id="sortFilter" onchange="productManager.handleSort(this.value)">
                            <option value="name" ${this.filters.sortBy === 'name' ? 'selected' : ''}>Nom</option>
                            <option value="sku" ${this.filters.sortBy === 'sku' ? 'selected' : ''}>SKU</option>
                            <option value="sellingPrice" ${this.filters.sortBy === 'sellingPrice' ? 'selected' : ''}>Prix</option>
                            <option value="stock" ${this.filters.sortBy === 'stock' ? 'selected' : ''}>Stock</option>
                            <option value="createdAt" ${this.filters.sortBy === 'createdAt' ? 'selected' : ''}>Date création</option>
                        </select>
                    </div>
                    
                    <div class="filter-group">
                        <label>Ordre</label>
                        <select id="orderFilter" onchange="productManager.handleOrder(this.value)">
                            <option value="asc" ${this.filters.sortOrder === 'asc' ? 'selected' : ''}>Croissant</option>
                            <option value="desc" ${this.filters.sortOrder === 'desc' ? 'selected' : ''}>Décroissant</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    /**
     * Générer la liste des produits
     */
    generateProductsList() {
        const products = this.getPaginatedProducts();
        
        if (products.length === 0) {
            return this.generateEmptyState();
        }

        const productRows = products.map(product => this.generateProductRow(product)).join('');

        return `
            <div class="products-table-container">
                <table class="products-table">
                    <thead>
                        <tr>
                            <th>Produit</th>
                            <th>SKU</th>
                            <th>Catégorie</th>
                            <th>Prix Vente</th>
                            <th>Stock</th>
                            <th>Statut</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${productRows}
                    </tbody>
                </table>
            </div>
        `;
    }

    /**
     * Générer une ligne de produit
     */
    generateProductRow(product) {
        const category = this.getCategoryById(product.categoryId);
        const stockStatus = this.getStockStatus(product);
        const statusClass = this.getStatusClass(product.status);

        return `
            <tr class="product-row" data-product-id="${product.id}">
                <td class="product-info">
                    <div class="product-main">
                        <div class="product-name">${product.name}</div>
                        <div class="product-description">${product.description}</div>
                    </div>
                </td>
                <td class="product-sku">
                    <span class="sku-code">${product.sku}</span>
                    ${product.barcode ? `<div class="barcode">${product.barcode}</div>` : ''}
                </td>
                <td class="product-category">
                    ${category ? `
                        <span class="category-badge" style="background-color: ${category.color}20; color: ${category.color};">
                            <i class="${category.icon}"></i> ${category.name}
                        </span>
                    ` : '<span class="no-category">Sans catégorie</span>'}
                </td>
                <td class="product-price">
                    <div class="selling-price">${this.formatPrice(product.sellingPrice)}</div>
                    <div class="purchase-price">Achat: ${this.formatPrice(product.purchasePrice)}</div>
                    <div class="margin">Marge: ${product.margin.toFixed(1)}%</div>
                </td>
                <td class="product-stock">
                    <div class="stock-info ${stockStatus.class}">
                        <span class="stock-number">${product.stock}</span>
                        <span class="stock-unit">${product.unit}</span>
                    </div>
                    ${stockStatus.warning ? `<div class="stock-warning">${stockStatus.warning}</div>` : ''}
                </td>
                <td class="product-status">
                    <span class="status-badge ${statusClass}">${this.getStatusLabel(product.status)}</span>
                </td>
                <td class="product-actions">
                    <div class="action-buttons">
                        <button class="btn-icon" onclick="productManager.viewProduct(${product.id})" title="Voir détails">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-icon" onclick="productManager.editProduct(${product.id})" title="Modifier">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-icon" onclick="productManager.duplicateProduct(${product.id})" title="Dupliquer">
                            <i class="fas fa-copy"></i>
                        </button>
                        <button class="btn-icon danger" onclick="productManager.deleteProduct(${product.id})" title="Supprimer">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            </tr>
        `;
    }

    /**
     * Obtenir le statut du stock
     */
    getStockStatus(product) {
        if (product.stock === 0) {
            return {
                class: 'out-of-stock',
                warning: 'Rupture de stock'
            };
        } else if (product.stock <= product.minStock) {
            return {
                class: 'low-stock',
                warning: 'Stock faible'
            };
        } else if (product.stock >= product.maxStock) {
            return {
                class: 'high-stock',
                warning: 'Stock élevé'
            };
        }
        return {
            class: 'normal-stock',
            warning: null
        };
    }

    /**
     * Obtenir la classe CSS du statut
     */
    getStatusClass(status) {
        const statusClasses = {
            'active': 'active',
            'inactive': 'inactive',
            'low_stock': 'warning',
            'out_of_stock': 'danger'
        };
        return statusClasses[status] || 'active';
    }

    /**
     * Obtenir le libellé du statut
     */
    getStatusLabel(status) {
        const statusLabels = {
            'active': 'Actif',
            'inactive': 'Inactif',
            'low_stock': 'Stock faible',
            'out_of_stock': 'Rupture'
        };
        return statusLabels[status] || 'Actif';
    }

    /**
     * Générer l'état vide
     */
    generateEmptyState() {
        return `
            <div class="empty-state">
                <div class="empty-icon">
                    <i class="fas fa-box-open"></i>
                </div>
                <h3>Aucun produit trouvé</h3>
                <p>Aucun produit ne correspond à vos critères de recherche.</p>
                <button class="btn btn-primary" onclick="productManager.showProductModal()">
                    <i class="fas fa-plus"></i> Ajouter un produit
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
                    Affichage de ${startItem} à ${endItem} sur ${this.pagination.totalItems} produits
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
            pages.push(`<button class="page-btn" onclick="productManager.goToPage(1)">
                <i class="fas fa-angle-double-left"></i>
            </button>`);
            pages.push(`<button class="page-btn" onclick="productManager.goToPage(${current - 1})">
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
                onclick="productManager.goToPage(${i})">${i}</button>`);
        }

        // Bouton dernière page
        if (current < total) {
            pages.push(`<button class="page-btn" onclick="productManager.goToPage(${current + 1})">
                <i class="fas fa-angle-right"></i>
            </button>`);
            pages.push(`<button class="page-btn" onclick="productManager.goToPage(${total})">
                <i class="fas fa-angle-double-right"></i>
            </button>`);
        }

        return pages.join('');
    }

    /**
     * Générer la modale de produit (création/édition)
     */
    generateProductModal(product = null) {
        const isEdit = product !== null;
        const title = isEdit ? 'Modifier le produit' : 'Nouveau produit';
        const categoryOptions = this.categories.map(cat => 
            `<option value="${cat.id}" ${product && product.categoryId == cat.id ? 'selected' : ''}>${cat.name}</option>`
        ).join('');

        return `
            <div class="modal-content large">
                <div class="modal-header">
                    <h2><i class="fas fa-box"></i> ${title}</h2>
                    <button class="modal-close" onclick="productManager.closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <form class="modal-body" id="productForm" onsubmit="productManager.saveProduct(event)">
                    <div class="form-grid">
                        <!-- Informations générales -->
                        <div class="form-section">
                            <h3><i class="fas fa-info-circle"></i> Informations générales</h3>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="productName">Nom du produit *</label>
                                    <input type="text" id="productName" name="name" required 
                                           value="${product ? product.name : ''}"
                                           placeholder="Ex: Smartphone Samsung Galaxy A54">
                                </div>
                                
                                <div class="form-group">
                                    <label for="productSku">SKU (Référence) *</label>
                                    <input type="text" id="productSku" name="sku" required 
                                           value="${product ? product.sku : ''}"
                                           placeholder="Ex: SAMS-A54-128">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="productDescription">Description</label>
                                <textarea id="productDescription" name="description" rows="3"
                                          placeholder="Description détaillée du produit...">${product ? product.description : ''}</textarea>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="productCategory">Catégorie</label>
                                    <select id="productCategory" name="categoryId">
                                        <option value="">Sélectionner une catégorie</option>
                                        ${categoryOptions}
                                    </select>
                                </div>
                                
                                <div class="form-group">
                                    <label for="productBarcode">Code-barres</label>
                                    <input type="text" id="productBarcode" name="barcode" 
                                           value="${product ? product.barcode : ''}"
                                           placeholder="Code-barres du produit">
                                </div>
                            </div>
                        </div>

                        <!-- Tarification -->
                        <div class="form-section">
                            <h3><i class="fas fa-coins"></i> Tarification</h3>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="purchasePrice">Prix d'achat (FCFA) *</label>
                                    <input type="number" id="purchasePrice" name="purchasePrice" required min="0" step="1"
                                           value="${product ? product.purchasePrice : ''}"
                                           placeholder="0"
                                           oninput="productManager.calculateMargin()">
                                </div>
                                
                                <div class="form-group">
                                    <label for="sellingPrice">Prix de vente (FCFA) *</label>
                                    <input type="number" id="sellingPrice" name="sellingPrice" required min="0" step="1"
                                           value="${product ? product.sellingPrice : ''}"
                                           placeholder="0"
                                           oninput="productManager.calculateMargin()">
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label>Marge bénéficiaire</label>
                                <div class="margin-display" id="marginDisplay">
                                    <span class="margin-value">0%</span>
                                    <span class="margin-amount">0 FCFA</span>
                                </div>
                            </div>
                        </div>

                        <!-- Gestion des stocks -->
                        <div class="form-section">
                            <h3><i class="fas fa-warehouse"></i> Gestion des stocks</h3>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="currentStock">Stock actuel *</label>
                                    <input type="number" id="currentStock" name="stock" required min="0" step="1"
                                           value="${product ? product.stock : '0'}"
                                           placeholder="0">
                                </div>
                                
                                <div class="form-group">
                                    <label for="stockUnit">Unité</label>
                                    <select id="stockUnit" name="unit">
                                        <option value="pièce" ${product && product.unit === 'pièce' ? 'selected' : ''}>Pièce</option>
                                        <option value="kg" ${product && product.unit === 'kg' ? 'selected' : ''}>Kilogramme</option>
                                        <option value="litre" ${product && product.unit === 'litre' ? 'selected' : ''}>Litre</option>
                                        <option value="mètre" ${product && product.unit === 'mètre' ? 'selected' : ''}>Mètre</option>
                                        <option value="sac" ${product && product.unit === 'sac' ? 'selected' : ''}>Sac</option>
                                        <option value="carton" ${product && product.unit === 'carton' ? 'selected' : ''}>Carton</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="minStock">Stock minimum</label>
                                    <input type="number" id="minStock" name="minStock" min="0" step="1"
                                           value="${product ? product.minStock : '5'}"
                                           placeholder="5">
                                </div>
                                
                                <div class="form-group">
                                    <label for="maxStock">Stock maximum</label>
                                    <input type="number" id="maxStock" name="maxStock" min="0" step="1"
                                           value="${product ? product.maxStock : '100'}"
                                           placeholder="100">
                                </div>
                            </div>
                        </div>

                        <!-- Informations supplémentaires -->
                        <div class="form-section">
                            <h3><i class="fas fa-cog"></i> Informations supplémentaires</h3>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="productWeight">Poids (kg)</label>
                                    <input type="number" id="productWeight" name="weight" min="0" step="0.001"
                                           value="${product ? product.weight : ''}"
                                           placeholder="0.000">
                                </div>
                                
                                <div class="form-group">
                                    <label for="productDimensions">Dimensions</label>
                                    <input type="text" id="productDimensions" name="dimensions"
                                           value="${product ? product.dimensions : ''}"
                                           placeholder="L x l x h (cm)">
                                </div>
                            </div>
                            
                            <div class="form-row">
                                <div class="form-group">
                                    <label for="productSupplier">Fournisseur</label>
                                    <input type="text" id="productSupplier" name="supplier"
                                           value="${product ? product.supplier : ''}"
                                           placeholder="Nom du fournisseur">
                                </div>
                                
                                <div class="form-group">
                                    <label for="productStatus">Statut</label>
                                    <select id="productStatus" name="status">
                                        <option value="active" ${product && product.status === 'active' ? 'selected' : ''}>Actif</option>
                                        <option value="inactive" ${product && product.status === 'inactive' ? 'selected' : ''}>Inactif</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div class="form-group">
                                <label for="productTags">Tags (séparés par des virgules)</label>
                                <input type="text" id="productTags" name="tags"
                                       value="${product && product.tags ? product.tags.join(', ') : ''}"
                                       placeholder="smartphone, android, samsung">
                            </div>
                        </div>
                    </div>
                    
                    <input type="hidden" name="id" value="${product ? product.id : ''}">
                </form>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="productManager.closeModal()">
                        Annuler
                    </button>
                    <button type="submit" form="productForm" class="btn btn-primary">
                        <i class="fas fa-save"></i> ${isEdit ? 'Modifier' : 'Créer'} le produit
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Générer la modale de détails du produit
     */
    generateProductDetailsModal(product) {
        const category = this.getCategoryById(product.categoryId);
        const stockStatus = this.getStockStatus(product);

        return `
            <div class="modal-content large">
                <div class="modal-header">
                    <h2><i class="fas fa-eye"></i> Détails du produit</h2>
                    <button class="modal-close" onclick="productManager.closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <div class="product-details">
                        <!-- En-tête du produit -->
                        <div class="product-header">
                            <div class="product-title">
                                <h3>${product.name}</h3>
                                <span class="product-sku">${product.sku}</span>
                            </div>
                            <div class="product-status">
                                <span class="status-badge ${this.getStatusClass(product.status)}">
                                    ${this.getStatusLabel(product.status)}
                                </span>
                            </div>
                        </div>

                        <!-- Informations principales -->
                        <div class="details-grid">
                            <div class="detail-section">
                                <h4><i class="fas fa-info-circle"></i> Informations générales</h4>
                                <div class="detail-items">
                                    <div class="detail-item">
                                        <label>Description</label>
                                        <span>${product.description || 'Aucune description'}</span>
                                    </div>
                                    <div class="detail-item">
                                        <label>Catégorie</label>
                                        <span>
                                            ${category ? `
                                                <span class="category-badge" style="background-color: ${category.color}20; color: ${category.color};">
                                                    <i class="${category.icon}"></i> ${category.name}
                                                </span>
                                            ` : 'Sans catégorie'}
                                        </span>
                                    </div>
                                    <div class="detail-item">
                                        <label>Code-barres</label>
                                        <span>${product.barcode || 'Non défini'}</span>
                                    </div>
                                    <div class="detail-item">
                                        <label>Tags</label>
                                        <span>
                                            ${product.tags && product.tags.length > 0 
                                                ? product.tags.map(tag => `<span class="tag">${tag}</span>`).join(' ')
                                                : 'Aucun tag'
                                            }
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="detail-section">
                                <h4><i class="fas fa-coins"></i> Tarification</h4>
                                <div class="detail-items">
                                    <div class="detail-item">
                                        <label>Prix d'achat</label>
                                        <span class="price">${this.formatPrice(product.purchasePrice)}</span>
                                    </div>
                                    <div class="detail-item">
                                        <label>Prix de vente</label>
                                        <span class="price selling">${this.formatPrice(product.sellingPrice)}</span>
                                    </div>
                                    <div class="detail-item">
                                        <label>Marge bénéficiaire</label>
                                        <span class="margin">
                                            ${product.margin.toFixed(1)}% 
                                            (${this.formatPrice(product.sellingPrice - product.purchasePrice)})
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div class="detail-section">
                                <h4><i class="fas fa-warehouse"></i> Stock</h4>
                                <div class="detail-items">
                                    <div class="detail-item">
                                        <label>Stock actuel</label>
                                        <span class="stock ${stockStatus.class}">
                                            ${product.stock} ${product.unit}
                                            ${stockStatus.warning ? `<span class="warning">(${stockStatus.warning})</span>` : ''}
                                        </span>
                                    </div>
                                    <div class="detail-item">
                                        <label>Stock minimum</label>
                                        <span>${product.minStock} ${product.unit}</span>
                                    </div>
                                    <div class="detail-item">
                                        <label>Stock maximum</label>
                                        <span>${product.maxStock} ${product.unit}</span>
                                    </div>
                                    <div class="detail-item">
                                        <label>Valeur du stock</label>
                                        <span class="price">${this.formatPrice(product.sellingPrice * product.stock)}</span>
                                    </div>
                                </div>
                            </div>

                            <div class="detail-section">
                                <h4><i class="fas fa-cog"></i> Informations supplémentaires</h4>
                                <div class="detail-items">
                                    <div class="detail-item">
                                        <label>Poids</label>
                                        <span>${product.weight ? product.weight + ' kg' : 'Non défini'}</span>
                                    </div>
                                    <div class="detail-item">
                                        <label>Dimensions</label>
                                        <span>${product.dimensions || 'Non définies'}</span>
                                    </div>
                                    <div class="detail-item">
                                        <label>Fournisseur</label>
                                        <span>${product.supplier || 'Non défini'}</span>
                                    </div>
                                    <div class="detail-item">
                                        <label>Date de création</label>
                                        <span>${this.formatDate(product.createdAt)}</span>
                                    </div>
                                    <div class="detail-item">
                                        <label>Dernière modification</label>
                                        <span>${this.formatDate(product.updatedAt)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="productManager.closeModal()">
                        Fermer
                    </button>
                    <button type="button" class="btn btn-primary" onclick="productManager.editProduct(${product.id})">
                        <i class="fas fa-edit"></i> Modifier
                    </button>
                </div>
            </div>
        `;
    }

    /**
     * Générer la modale de confirmation de suppression
     */
    generateDeleteModal(product) {
        return `
            <div class="modal-content small">
                <div class="modal-header">
                    <h2><i class="fas fa-exclamation-triangle"></i> Confirmer la suppression</h2>
                    <button class="modal-close" onclick="productManager.closeModal()">
                        <i class="fas fa-times"></i>
                    </button>
                </div>
                
                <div class="modal-body">
                    <div class="delete-confirmation">
                        <p>Êtes-vous sûr de vouloir supprimer ce produit ?</p>
                        <div class="product-info">
                            <strong>${product.name}</strong><br>
                            <span class="sku">${product.sku}</span>
                        </div>
                        <div class="warning">
                            <i class="fas fa-exclamation-triangle"></i>
                            Cette action est irréversible.
                        </div>
                    </div>
                </div>
                
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" onclick="productManager.closeModal()">
                        Annuler
                    </button>
                    <button type="button" class="btn btn-danger" onclick="productManager.confirmDelete(${product.id})">
                        <i class="fas fa-trash"></i> Supprimer
                    </button>
                </div>
            </div>
        `;
    }

    // ==========================================
    // MÉTHODES D'ACTIONS ET ÉVÉNEMENTS
    // ==========================================

    /**
     * Afficher la modale de création de produit
     */
    showProductModal(productId = null) {
        const product = productId ? this.products.find(p => p.id == productId) : null;
        const modalHTML = this.generateProductModal(product);
        
        document.getElementById('modal-overlay').innerHTML = modalHTML;
        document.getElementById('modal-overlay').style.display = 'flex';
        
        // Focus sur le premier champ
        setTimeout(() => {
            document.getElementById('productName').focus();
            if (product) {
                this.calculateMargin();
            }
        }, 100);
    }

    /**
     * Fermer la modale
     */
    closeModal() {
        document.getElementById('modal-overlay').style.display = 'none';
        document.getElementById('modal-overlay').innerHTML = '';
    }

    /**
     * Calculer la marge bénéficiaire
     */
    calculateMargin() {
        const purchasePrice = parseFloat(document.getElementById('purchasePrice').value) || 0;
        const sellingPrice = parseFloat(document.getElementById('sellingPrice').value) || 0;
        
        if (purchasePrice > 0 && sellingPrice > 0) {
            const margin = ((sellingPrice - purchasePrice) / purchasePrice) * 100;
            const marginAmount = sellingPrice - purchasePrice;
            
            document.getElementById('marginDisplay').innerHTML = `
                <span class="margin-value">${margin.toFixed(1)}%</span>
                <span class="margin-amount">${this.formatPrice(marginAmount)}</span>
            `;
        } else {
            document.getElementById('marginDisplay').innerHTML = `
                <span class="margin-value">0%</span>
                <span class="margin-amount">0 FCFA</span>
            `;
        }
    }

    /**
     * Sauvegarder un produit (création ou modification)
     */
    saveProduct(event) {
        event.preventDefault();
        
        const formData = new FormData(event.target);
        const productData = {
            name: formData.get('name').trim(),
            description: formData.get('description').trim(),
            sku: formData.get('sku').trim().toUpperCase(),
            barcode: formData.get('barcode').trim(),
            categoryId: parseInt(formData.get('categoryId')) || null,
            purchasePrice: parseFloat(formData.get('purchasePrice')) || 0,
            sellingPrice: parseFloat(formData.get('sellingPrice')) || 0,
            stock: parseInt(formData.get('stock')) || 0,
            minStock: parseInt(formData.get('minStock')) || 5,
            maxStock: parseInt(formData.get('maxStock')) || 100,
            unit: formData.get('unit') || 'pièce',
            weight: parseFloat(formData.get('weight')) || null,
            dimensions: formData.get('dimensions').trim(),
            supplier: formData.get('supplier').trim(),
            status: formData.get('status') || 'active',
            tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag) : []
        };

        // Validation
        if (!productData.name) {
            this.showToast('Le nom du produit est requis', 'error');
            return;
        }

        if (!productData.sku) {
            this.showToast('Le SKU est requis', 'error');
            return;
        }

        if (productData.purchasePrice <= 0 || productData.sellingPrice <= 0) {
            this.showToast('Les prix d\'achat et de vente doivent être supérieurs à 0', 'error');
            return;
        }

        // Calcul de la marge
        productData.margin = ((productData.sellingPrice - productData.purchasePrice) / productData.purchasePrice) * 100;

        // Déterminer le statut selon le stock
        if (productData.stock === 0) {
            productData.status = 'out_of_stock';
        } else if (productData.stock <= productData.minStock) {
            productData.status = 'low_stock';
        }

        const productId = formData.get('id');
        
        if (productId) {
            // Modification
            const index = this.products.findIndex(p => p.id == productId);
            if (index !== -1) {
                productData.id = parseInt(productId);
                productData.createdAt = this.products[index].createdAt;
                productData.updatedAt = new Date().toISOString().split('T')[0];
                productData.images = this.products[index].images || [];
                
                this.products[index] = productData;
                this.showToast('Produit modifié avec succès', 'success');
            }
        } else {
            // Création
            productData.id = Math.max(...this.products.map(p => p.id), 0) + 1;
            productData.createdAt = new Date().toISOString().split('T')[0];
            productData.updatedAt = productData.createdAt;
            productData.images = [];
            
            this.products.push(productData);
            this.showToast('Produit créé avec succès', 'success');
        }

        this.updatePagination();
        this.render();
        this.closeModal();
    }

    /**
     * Voir les détails d'un produit
     */
    viewProduct(productId) {
        const product = this.products.find(p => p.id == productId);
        if (!product) {
            this.showToast('Produit non trouvé', 'error');
            return;
        }

        const modalHTML = this.generateProductDetailsModal(product);
        document.getElementById('modal-overlay').innerHTML = modalHTML;
        document.getElementById('modal-overlay').style.display = 'flex';
    }

    /**
     * Modifier un produit
     */
    editProduct(productId) {
        this.closeModal();
        setTimeout(() => {
            this.showProductModal(productId);
        }, 100);
    }

    /**
     * Dupliquer un produit
     */
    duplicateProduct(productId) {
        const product = this.products.find(p => p.id == productId);
        if (!product) {
            this.showToast('Produit non trouvé', 'error');
            return;
        }

        const duplicatedProduct = {
            ...product,
            id: Math.max(...this.products.map(p => p.id), 0) + 1,
            name: product.name + ' (Copie)',
            sku: product.sku + '-COPY',
            createdAt: new Date().toISOString().split('T')[0],
            updatedAt: new Date().toISOString().split('T')[0]
        };

        this.products.push(duplicatedProduct);
        this.updatePagination();
        this.render();
        this.showToast('Produit dupliqué avec succès', 'success');
    }

    /**
     * Supprimer un produit
     */
    deleteProduct(productId) {
        const product = this.products.find(p => p.id == productId);
        if (!product) {
            this.showToast('Produit non trouvé', 'error');
            return;
        }

        const modalHTML = this.generateDeleteModal(product);
        document.getElementById('modal-overlay').innerHTML = modalHTML;
        document.getElementById('modal-overlay').style.display = 'flex';
    }

    /**
     * Confirmer la suppression
     */
    confirmDelete(productId) {
        const index = this.products.findIndex(p => p.id == productId);
        if (index !== -1) {
            this.products.splice(index, 1);
            this.updatePagination();
            this.render();
            this.closeModal();
            this.showToast('Produit supprimé avec succès', 'success');
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
            
            // Afficher/masquer le bouton de nettoyage
            const clearBtn = document.querySelector('.search-clear');
            if (clearBtn) {
                clearBtn.style.display = searchTerm ? 'block' : 'none';
            }
        }, 300);
    }

    /**
     * Nettoyer la recherche
     */
    clearSearch() {
        this.filters.search = '';
        document.getElementById('productSearch').value = '';
        document.querySelector('.search-clear').style.display = 'none';
        this.pagination.currentPage = 1;
        this.updatePagination();
        this.render();
    }

    /**
     * Filtrer par catégorie
     */
    handleCategoryFilter(categoryId) {
        this.filters.category = categoryId;
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
            products: this.products,
            categories: this.categories,
            exportDate: new Date().toISOString(),
            version: '1.0'
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `samafacture-produits-${new Date().toISOString().split('T')[0]}.json`;
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
                        if (data.products && Array.isArray(data.products)) {
                            this.products = data.products;
                            if (data.categories && Array.isArray(data.categories)) {
                                this.categories = data.categories;
                            }
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
        // Cette méthode sera implémentée dans le système global de toast
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
