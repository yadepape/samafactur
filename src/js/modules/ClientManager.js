// Gestionnaire de clients pour SamaFacture
class ClientManager {
  constructor() {
    this.clients = [];
    this.currentClient = null;
    this.filters = {
      search: '',
      status: 'all', // all, active, inactive
      sortBy: 'name',
      sortOrder: 'asc'
    };
    this.pagination = {
      currentPage: 1,
      itemsPerPage: 10,
      totalItems: 0,
      totalPages: 0
    };
  }

  async init() {
    await this.loadClients();
    console.log('ClientManager initialisé');
  }

  async render() {
    try {
      await this.loadClients();
      return this.generateHTML();
    } catch (error) {
      console.error('Erreur lors du rendu des clients:', error);
      return this.generateErrorHTML(error.message);
    }
  }

  async loadClients() {
    try {
      // Simulation de données pour le moment
      this.clients = [
        {
          id: 1,
          name: 'Amadou Diallo',
          email: 'amadou.diallo@email.com',
          phone: '+221 77 123 45 67',
          address: 'Rue 10, Plateau',
          city: 'Dakar',
          postal_code: '12000',
          country: 'Sénégal',
          tax_number: 'SN123456789',
          notes: 'Client fidèle depuis 2020',
          is_active: true,
          created_at: '2023-01-15T10:30:00Z'
        },
        {
          id: 2,
          name: 'Fatou Sall',
          email: 'fatou.sall@email.com',
          phone: '+221 78 987 65 43',
          address: 'Avenue Bourguiba',
          city: 'Thiès',
          postal_code: '21000',
          country: 'Sénégal',
          tax_number: 'SN987654321',
          notes: 'Commandes régulières',
          is_active: true,
          created_at: '2023-03-20T14:15:00Z'
        },
        {
          id: 3,
          name: 'Ousmane Ba',
          email: '',
          phone: '+221 70 555 44 33',
          address: 'Quartier Médina',
          city: 'Saint-Louis',
          postal_code: '32000',
          country: 'Sénégal',
          tax_number: '',
          notes: '',
          is_active: false,
          created_at: '2023-02-10T09:45:00Z'
        }
      ];
      this.updatePagination();
    } catch (error) {
      console.error('Erreur lors du chargement des clients:', error);
      throw error;
    }
  }

  generateHTML() {
    return `
      <div class="clients-page">
        <!-- En-tête -->
        <div class="page-header">
          <div class="page-title">
            <h1>
              <i class="fas fa-users"></i>
              Gestion des Clients
            </h1>
            <p class="page-subtitle">Gérez vos clients et leurs informations</p>
          </div>
          <div class="page-actions">
            <button id="add-client-btn" class="btn btn-primary">
              <i class="fas fa-plus"></i>
              Nouveau Client
            </button>
            <button id="import-clients-btn" class="btn btn-secondary">
              <i class="fas fa-upload"></i>
              Importer
            </button>
            <button id="export-clients-btn" class="btn btn-secondary">
              <i class="fas fa-download"></i>
              Exporter
            </button>
          </div>
        </div>

        <!-- Filtres et recherche -->
        <div class="filters-section">
          <div class="search-box">
            <div class="search-input-group">
              <i class="fas fa-search"></i>
              <input 
                type="text" 
                id="client-search" 
                placeholder="Rechercher par nom, email ou téléphone..."
                value="${this.filters.search}"
              >
              <button id="clear-search" class="clear-btn" ${!this.filters.search ? 'style="display: none;"' : ''}>
                <i class="fas fa-times"></i>
              </button>
            </div>
          </div>
          
          <div class="filter-controls">
            <select id="status-filter" class="form-select">
              <option value="all" ${this.filters.status === 'all' ? 'selected' : ''}>Tous les clients</option>
              <option value="active" ${this.filters.status === 'active' ? 'selected' : ''}>Clients actifs</option>
              <option value="inactive" ${this.filters.status === 'inactive' ? 'selected' : ''}>Clients inactifs</option>
            </select>
            
            <select id="sort-filter" class="form-select">
              <option value="name" ${this.filters.sortBy === 'name' ? 'selected' : ''}>Trier par nom</option>
              <option value="created_at" ${this.filters.sortBy === 'created_at' ? 'selected' : ''}>Trier par date</option>
              <option value="email" ${this.filters.sortBy === 'email' ? 'selected' : ''}>Trier par email</option>
            </select>
            
            <button id="sort-order-btn" class="btn btn-icon" title="Ordre de tri">
              <i class="fas fa-sort-${this.filters.sortOrder === 'asc' ? 'up' : 'down'}"></i>
            </button>
          </div>
        </div>

        <!-- Statistiques rapides -->
        <div class="stats-cards">
          ${this.generateStatsCards()}
        </div>

        <!-- Liste des clients -->
        <div class="clients-content">
          ${this.clients.length > 0 ? this.generateClientsList() : this.generateEmptyState()}
        </div>

        <!-- Pagination -->
        ${this.generatePagination()}
      </div>

      <!-- Modal d'ajout/modification -->
      ${this.generateClientModal()}

      <!-- Modal de détails -->
      ${this.generateClientDetailsModal()}

      <!-- Modal de confirmation de suppression -->
      ${this.generateDeleteModal()}
    `;
  }

  generateStatsCards() {
    const totalClients = this.clients.length;
    const activeClients = this.clients.filter(c => c.is_active).length;
    const inactiveClients = totalClients - activeClients;
    
    return `
      <div class="stats-grid">
        <div class="stat-card stat-primary">
          <div class="stat-icon">
            <i class="fas fa-users"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">${totalClients}</div>
            <div class="stat-label">Total Clients</div>
          </div>
        </div>
        
        <div class="stat-card stat-success">
          <div class="stat-icon">
            <i class="fas fa-user-check"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">${activeClients}</div>
            <div class="stat-label">Clients Actifs</div>
          </div>
        </div>
        
        <div class="stat-card stat-warning">
          <div class="stat-icon">
            <i class="fas fa-user-times"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">${inactiveClients}</div>
            <div class="stat-label">Clients Inactifs</div>
          </div>
        </div>
        
        <div class="stat-card stat-info">
          <div class="stat-icon">
            <i class="fas fa-user-plus"></i>
          </div>
          <div class="stat-content">
            <div class="stat-number">+${this.getNewClientsThisMonth()}</div>
            <div class="stat-label">Ce Mois</div>
          </div>
        </div>
      </div>
    `;
  }

  generateClientsList() {
    const startIndex = (this.pagination.currentPage - 1) * this.pagination.itemsPerPage;
    const endIndex = startIndex + this.pagination.itemsPerPage;
    const paginatedClients = this.clients.slice(startIndex, endIndex);

    return `
      <div class="clients-table-container">
        <table class="clients-table">
          <thead>
            <tr>
              <th>
                <input type="checkbox" id="select-all-clients">
              </th>
              <th>Client</th>
              <th>Contact</th>
              <th>Ville</th>
              <th>Statut</th>
              <th>Créé le</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            ${paginatedClients.map(client => this.generateClientRow(client)).join('')}
          </tbody>
        </table>
      </div>
    `;
  }

  generateClientRow(client) {
    const initials = client.name.split(' ').map(n => n[0]).join('').toUpperCase();
    const createdDate = new Date(client.created_at).toLocaleDateString('fr-FR');

    return `
      <tr class="client-row" data-client-id="${client.id}">
        <td>
          <input type="checkbox" class="client-checkbox" value="${client.id}">
        </td>
        <td>
          <div class="client-info">
            <div class="client-avatar ${client.is_active ? '' : 'inactive'}">${initials}</div>
            <div class="client-details">
              <div class="client-name">${client.name}</div>
              <div class="client-email">${client.email || 'Pas d\'email'}</div>
            </div>
          </div>
        </td>
        <td>
          <div class="contact-info">
            <div class="phone">${client.phone || 'Pas de téléphone'}</div>
            <div class="address">${client.address || 'Pas d\'adresse'}</div>
          </div>
        </td>
        <td>
          <span class="city">${client.city || '-'}</span>
        </td>
        <td>
          <span class="status-badge ${client.is_active ? 'active' : 'inactive'}">
            <i class="fas fa-circle"></i>
            ${client.is_active ? 'Actif' : 'Inactif'}
          </span>
        </td>
        <td>
          <span class="date">${createdDate}</span>
        </td>
        <td>
          <div class="action-buttons">
            <button class="btn-icon btn-view" onclick="clientManager.viewClient(${client.id})" title="Voir détails">
              <i class="fas fa-eye"></i>
            </button>
            <button class="btn-icon btn-edit" onclick="clientManager.editClient(${client.id})" title="Modifier">
              <i class="fas fa-edit"></i>
            </button>
            <button class="btn-icon btn-delete" onclick="clientManager.confirmDeleteClient(${client.id})" title="Supprimer">
              <i class="fas fa-trash"></i>
            </button>
            <div class="dropdown">
              <button class="btn-icon btn-more" title="Plus d'actions">
                <i class="fas fa-ellipsis-v"></i>
              </button>
              <div class="dropdown-menu">
                <a href="#" onclick="clientManager.toggleClientStatus(${client.id})">
                  <i class="fas fa-${client.is_active ? 'pause' : 'play'}"></i>
                  ${client.is_active ? 'Désactiver' : 'Activer'}
                </a>
                <a href="#" onclick="clientManager.duplicateClient(${client.id})">
                  <i class="fas fa-copy"></i>
                  Dupliquer
                </a>
                <a href="#" onclick="clientManager.exportClient(${client.id})">
                  <i class="fas fa-download"></i>
                  Exporter
                </a>
              </div>
            </div>
          </div>
        </td>
      </tr>
    `;
  }

  generateEmptyState() {
    return `
      <div class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-users"></i>
        </div>
        <h3>Aucun client trouvé</h3>
        <p>Commencez par ajouter votre premier client pour gérer votre base de données clients.</p>
        <button class="btn btn-primary" onclick="clientManager.showAddClientModal()">
          <i class="fas fa-plus"></i>
          Ajouter un Client
        </button>
      </div>
    `;
  }

  generatePagination() {
    if (this.pagination.totalPages <= 1) return '';

    const currentPage = this.pagination.currentPage;
    const totalPages = this.pagination.totalPages;
    const startItem = (currentPage - 1) * this.pagination.itemsPerPage + 1;
    const endItem = Math.min(currentPage * this.pagination.itemsPerPage, this.pagination.totalItems);

    return `
      <div class="pagination-container">
        <div class="pagination-info">
          Affichage de ${startItem} à ${endItem} sur ${this.pagination.totalItems} clients
        </div>
        <div class="pagination-controls">
          <button 
            class="btn btn-icon" 
            onclick="clientManager.goToPage(1)"
            ${currentPage === 1 ? 'disabled' : ''}
          >
            <i class="fas fa-angle-double-left"></i>
          </button>
          <button 
            class="btn btn-icon" 
            onclick="clientManager.goToPage(${currentPage - 1})"
            ${currentPage === 1 ? 'disabled' : ''}
          >
            <i class="fas fa-angle-left"></i>
          </button>
          
          ${this.generatePageNumbers()}
          
          <button 
            class="btn btn-icon" 
            onclick="clientManager.goToPage(${currentPage + 1})"
            ${currentPage === totalPages ? 'disabled' : ''}
          >
            <i class="fas fa-angle-right"></i>
          </button>
          <button 
            class="btn btn-icon" 
            onclick="clientManager.goToPage(${totalPages})"
            ${currentPage === totalPages ? 'disabled' : ''}
          >
            <i class="fas fa-angle-double-right"></i>
          </button>
        </div>
      </div>
    `;
  }

  generatePageNumbers() {
    const currentPage = this.pagination.currentPage;
    const totalPages = this.pagination.totalPages;
    const maxVisible = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisible / 2));
    let endPage = Math.min(totalPages, startPage + maxVisible - 1);

    if (endPage - startPage + 1 < maxVisible) {
      startPage = Math.max(1, endPage - maxVisible + 1);
    }

    let pages = '';
    for (let i = startPage; i <= endPage; i++) {
      pages += `
        <button 
          class="btn btn-page ${i === currentPage ? 'active' : ''}" 
          onclick="clientManager.goToPage(${i})"
        >
          ${i}
        </button>
      `;
    }
    return pages;
  }

  generateClientModal() {
    return `
      <div id="client-modal" class="modal">
        <div class="modal-content modal-large">
          <div class="modal-header">
            <h2 id="client-modal-title">Nouveau Client</h2>
            <button class="modal-close" onclick="clientManager.closeModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <form id="client-form" class="modal-body">
            <div class="form-grid">
              <!-- Informations de base -->
              <div class="form-section">
                <h3>Informations de base</h3>
                
                <div class="form-group">
                  <label for="client-name" class="required">Nom du client</label>
                  <input type="text" id="client-name" name="name" required>
                  <div class="field-error" id="name-error"></div>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="client-email">Email</label>
                    <input type="email" id="client-email" name="email">
                    <div class="field-error" id="email-error"></div>
                  </div>
                  
                  <div class="form-group">
                    <label for="client-phone">Téléphone</label>
                    <input type="tel" id="client-phone" name="phone" placeholder="+221 77 123 45 67">
                    <div class="field-error" id="phone-error"></div>
                  </div>
                </div>
              </div>

              <!-- Adresse -->
              <div class="form-section">
                <h3>Adresse</h3>
                
                <div class="form-group">
                  <label for="client-address">Adresse</label>
                  <textarea id="client-address" name="address" rows="2" placeholder="Adresse complète"></textarea>
                </div>
                
                <div class="form-row">
                  <div class="form-group">
                    <label for="client-city">Ville</label>
                    <input type="text" id="client-city" name="city" placeholder="Dakar">
                  </div>
                  
                  <div class="form-group">
                    <label for="client-postal-code">Code postal</label>
                    <input type="text" id="client-postal-code" name="postal_code" placeholder="12345">
                  </div>
                </div>
                
                <div class="form-group">
                  <label for="client-country">Pays</label>
                  <input type="text" id="client-country" name="country" value="Sénégal">
                </div>
              </div>

              <!-- Informations fiscales -->
              <div class="form-section">
                <h3>Informations fiscales</h3>
                
                <div class="form-group">
                  <label for="client-tax-number">Numéro fiscal (NINEA)</label>
                  <input type="text" id="client-tax-number" name="tax_number" placeholder="123456789">
                </div>
              </div>

              <!-- Notes -->
              <div class="form-section full-width">
                <h3>Notes</h3>
                
                <div class="form-group">
                  <label for="client-notes">Notes internes</label>
                  <textarea id="client-notes" name="notes" rows="3" placeholder="Notes sur le client..."></textarea>
                </div>
                
                <div class="form-group">
                  <label class="checkbox-label">
                    <input type="checkbox" id="client-active" name="is_active" checked>
                    <span class="checkmark"></span>
                    Client actif
                  </label>
                </div>
              </div>
            </div>
          </form>
          
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" onclick="clientManager.closeModal()">
              Annuler
            </button>
            <button type="submit" form="client-form" class="btn btn-primary" id="save-client-btn">
              <i class="fas fa-save"></i>
              Enregistrer
            </button>
          </div>
        </div>
      </div>
    `;
  }

  generateClientDetailsModal() {
    return `
      <div id="client-details-modal" class="modal">
        <div class="modal-content modal-large">
          <div class="modal-header">
            <h2>Détails du Client</h2>
            <button class="modal-close" onclick="clientManager.closeDetailsModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body" id="client-details-content">
            <!-- Contenu généré dynamiquement -->
          </div>
          
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="clientManager.closeDetailsModal()">
              Fermer
            </button>
            <button class="btn btn-primary" onclick="clientManager.editCurrentClient()">
              <i class="fas fa-edit"></i>
              Modifier
            </button>
          </div>
        </div>
      </div>
    `;
  }

  generateDeleteModal() {
    return `
      <div id="delete-client-modal" class="modal">
        <div class="modal-content modal-small">
          <div class="modal-header">
            <h2>Confirmer la suppression</h2>
            <button class="modal-close" onclick="clientManager.closeDeleteModal()">
              <i class="fas fa-times"></i>
            </button>
          </div>
          
          <div class="modal-body">
            <div class="warning-content">
              <div class="warning-icon">
                <i class="fas fa-exclamation-triangle"></i>
              </div>
              <p>Êtes-vous sûr de vouloir supprimer ce client ?</p>
              <p class="warning-text">Cette action est irréversible et supprimera également toutes les factures et devis associés.</p>
            </div>
          </div>
          
          <div class="modal-footer">
            <button class="btn btn-secondary" onclick="clientManager.closeDeleteModal()">
              Annuler
            </button>
            <button class="btn btn-danger" id="confirm-delete-btn">
              <i class="fas fa-trash"></i>
              Supprimer
            </button>
          </div>
        </div>
      </div>
    `;
  }

  generateErrorHTML(message) {
    return `
      <div class="error-state">
        <div class="error-icon">
          <i class="fas fa-exclamation-triangle"></i>
        </div>
        <h3>Erreur de chargement</h3>
        <p>${message}</p>
        <button class="btn btn-primary" onclick="clientManager.reload()">
          Réessayer
        </button>
      </div>
    `;
  }

  // Méthodes utilitaires
  updatePagination() {
    this.pagination.totalItems = this.clients.length;
    this.pagination.totalPages = Math.ceil(this.pagination.totalItems / this.pagination.itemsPerPage);
    
    if (this.pagination.currentPage > this.pagination.totalPages) {
      this.pagination.currentPage = Math.max(1, this.pagination.totalPages);
    }
  }

  getNewClientsThisMonth() {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return this.clients.filter(client => {
      const createdDate = new Date(client.created_at);
      return createdDate >= startOfMonth;
    }).length;
  }

  // Méthodes d'événements (à implémenter dans ClientActions)
  setupEventListeners() {
    console.log('ClientManager: setupEventListeners appelé');
  }

  // Méthodes d'actions (stubs pour éviter les erreurs)
  async showAddClientModal() {
    console.log('showAddClientModal appelé');
  }

  async editClient(id) {
    console.log('editClient appelé avec id:', id);
  }

  async viewClient(id) {
    console.log('viewClient appelé avec id:', id);
  }

  async confirmDeleteClient(id) {
    console.log('confirmDeleteClient appelé avec id:', id);
  }

  async toggleClientStatus(id) {
    console.log('toggleClientStatus appelé avec id:', id);
  }

  async duplicateClient(id) {
    console.log('duplicateClient appelé avec id:', id);
  }

  async exportClient(id) {
    console.log('exportClient appelé avec id:', id);
  }

  closeModal() {
    console.log('closeModal appelé');
  }

  closeDetailsModal() {
    console.log('closeDetailsModal appelé');
  }

  closeDeleteModal() {
    console.log('closeDeleteModal appelé');
  }

  editCurrentClient() {
    console.log('editCurrentClient appelé');
  }

  // Méthodes de navigation
  async goToPage(page) {
    if (page >= 1 && page <= this.pagination.totalPages) {
      this.pagination.currentPage = page;
      await this.refresh();
    }
  }

  async refresh() {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      mainContent.innerHTML = await this.render();
      this.setupEventListeners();
    }
  }

  async reload() {
    await this.refresh();
  }
}

// Instance singleton
const clientManager = new ClientManager();

// Export global
window.ClientManager = clientManager;
window.clientManager = clientManager;

export default clientManager;

