/**
 * SamaFacture - Gestionnaire de Base de Données
 * Gestion de la base de données SQLite locale avec SQL.js
 */

class DatabaseManager {
    constructor() {
        this.db = null;
        this.isInitialized = false;
        this.sqlJs = null;
        this.dbName = 'samaFacture.db';
        
        this.init();
    }

    /**
     * Initialiser la base de données
     */
    async init() {
        try {
            console.log('🔄 Initialisation de la base de données...');
            
            // Charger SQL.js depuis CDN
            await this.loadSQLJs();
            
            // Initialiser la base de données
            await this.initDatabase();
            
            // Migrer les données existantes du localStorage si nécessaire
            await this.migrateFromLocalStorage();
            
            this.isInitialized = true;
            console.log('✅ Base de données initialisée avec succès');
            
        } catch (error) {
            console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
            // Fallback vers localStorage en cas d'erreur
            this.isInitialized = false;
        }
    }

    /**
     * Charger SQL.js depuis CDN
     */
    async loadSQLJs() {
        return new Promise((resolve, reject) => {
            if (window.SQL) {
                this.sqlJs = window.SQL;
                resolve();
                return;
            }

            // Charger SQL.js depuis CDN
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js';
            script.onload = async () => {
                try {
                    this.sqlJs = await window.initSqlJs({
                        locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/${file}`
                    });
                    resolve();
                } catch (error) {
                    reject(error);
                }
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Initialiser la base de données SQLite
     */
    async initDatabase() {
        try {
            // Charger la base de données existante ou créer une nouvelle
            const savedDb = localStorage.getItem('samaFacture_database');
            
            if (savedDb) {
                // Restaurer la base de données existante
                const dbData = new Uint8Array(JSON.parse(savedDb));
                this.db = new this.sqlJs.Database(dbData);
                console.log('📂 Base de données existante chargée');
            } else {
                // Créer une nouvelle base de données
                this.db = new this.sqlJs.Database();
                console.log('🆕 Nouvelle base de données créée');
            }

            // Exécuter le schéma de base de données
            await this.executeSchema();
            
            // Sauvegarder la base de données
            this.saveDatabase();
            
        } catch (error) {
            console.error('Erreur lors de l\'initialisation de la base de données:', error);
            throw error;
        }
    }

    /**
     * Exécuter le schéma de base de données
     */
    async executeSchema() {
        try {
            // Charger le schéma SQL
            const response = await fetch('js/database/schema.sql');
            const schema = await response.text();
            
            // Exécuter le schéma
            this.db.exec(schema);
            console.log('📋 Schéma de base de données exécuté');
            
        } catch (error) {
            console.error('Erreur lors de l\'exécution du schéma:', error);
            // Fallback: créer les tables manuellement
            this.createTablesManually();
        }
    }

    /**
     * Créer les tables manuellement (fallback)
     */
    createTablesManually() {
        const tables = [
            `CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                key TEXT UNIQUE NOT NULL,
                value TEXT,
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS clients (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                email TEXT,
                phone TEXT,
                address TEXT,
                city TEXT,
                status TEXT DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`,
            `CREATE TABLE IF NOT EXISTS products (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                description TEXT,
                category TEXT,
                sku TEXT UNIQUE,
                price DECIMAL(10,2) NOT NULL DEFAULT 0,
                cost DECIMAL(10,2) DEFAULT 0,
                stock_quantity INTEGER DEFAULT 0,
                min_stock INTEGER DEFAULT 0,
                status TEXT DEFAULT 'active',
                created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
            )`
        ];

        tables.forEach(sql => {
            try {
                this.db.exec(sql);
            } catch (error) {
                console.error('Erreur lors de la création de table:', error);
            }
        });
    }

    /**
     * Sauvegarder la base de données dans localStorage
     */
    saveDatabase() {
        if (!this.db) return;
        
        try {
            const data = this.db.export();
            const dataArray = Array.from(data);
            localStorage.setItem('samaFacture_database', JSON.stringify(dataArray));
        } catch (error) {
            console.error('Erreur lors de la sauvegarde de la base de données:', error);
        }
    }

    /**
     * Migrer les données du localStorage vers la base de données
     */
    async migrateFromLocalStorage() {
        if (!this.isInitialized) return;

        try {
            // Migrer les paramètres
            const settings = localStorage.getItem('samaFacture_settings');
            if (settings) {
                const settingsData = JSON.parse(settings);
                for (const [key, value] of Object.entries(settingsData)) {
                    this.setSetting(key, value);
                }
                console.log('✅ Paramètres migrés');
            }

            // Migrer les clients
            const clients = localStorage.getItem('samaFacture_clients');
            if (clients) {
                const clientsData = JSON.parse(clients);
                for (const client of clientsData) {
                    this.insertClient(client);
                }
                console.log('✅ Clients migrés');
            }

            // Migrer les produits
            const products = localStorage.getItem('samaFacture_products');
            if (products) {
                const productsData = JSON.parse(products);
                for (const product of productsData) {
                    this.insertProduct(product);
                }
                console.log('✅ Produits migrés');
            }

            // Sauvegarder après migration
            this.saveDatabase();
            
        } catch (error) {
            console.error('Erreur lors de la migration:', error);
        }
    }

    /**
     * Exécuter une requête SQL
     */
    query(sql, params = []) {
        if (!this.isInitialized || !this.db) {
            throw new Error('Base de données non initialisée');
        }

        try {
            const stmt = this.db.prepare(sql);
            const result = stmt.getAsObject(params);
            stmt.free();
            return result;
        } catch (error) {
            console.error('Erreur lors de l\'exécution de la requête:', error);
            throw error;
        }
    }

    /**
     * Exécuter une requête qui retourne plusieurs résultats
     */
    queryAll(sql, params = []) {
        if (!this.isInitialized || !this.db) {
            throw new Error('Base de données non initialisée');
        }

        try {
            const stmt = this.db.prepare(sql);
            const results = [];
            
            while (stmt.step()) {
                results.push(stmt.getAsObject());
            }
            
            stmt.free();
            return results;
        } catch (error) {
            console.error('Erreur lors de l\'exécution de la requête:', error);
            throw error;
        }
    }

    /**
     * Exécuter une requête de modification (INSERT, UPDATE, DELETE)
     */
    execute(sql, params = []) {
        if (!this.isInitialized || !this.db) {
            throw new Error('Base de données non initialisée');
        }

        try {
            const stmt = this.db.prepare(sql);
            stmt.run(params);
            stmt.free();
            
            // Sauvegarder après modification
            this.saveDatabase();
            
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'exécution de la requête:', error);
            throw error;
        }
    }

    // ==========================================
    // MÉTHODES POUR LES PARAMÈTRES
    // ==========================================

    /**
     * Obtenir un paramètre
     */
    getSetting(key) {
        try {
            const result = this.query(
                'SELECT value FROM settings WHERE key = ?',
                [key]
            );
            return result.value || null;
        } catch (error) {
            console.error('Erreur lors de la récupération du paramètre:', error);
            return null;
        }
    }

    /**
     * Définir un paramètre
     */
    setSetting(key, value) {
        try {
            this.execute(
                'INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)',
                [key, value]
            );
            return true;
        } catch (error) {
            console.error('Erreur lors de la définition du paramètre:', error);
            return false;
        }
    }

    /**
     * Obtenir tous les paramètres
     */
    getAllSettings() {
        try {
            const results = this.queryAll('SELECT key, value FROM settings');
            const settings = {};
            results.forEach(row => {
                settings[row.key] = row.value;
            });
            return settings;
        } catch (error) {
            console.error('Erreur lors de la récupération des paramètres:', error);
            return {};
        }
    }

    // ==========================================
    // MÉTHODES POUR LES CLIENTS
    // ==========================================

    /**
     * Obtenir tous les clients
     */
    getAllClients() {
        try {
            return this.queryAll(`
                SELECT * FROM clients 
                ORDER BY created_at DESC
            `);
        } catch (error) {
            console.error('Erreur lors de la récupération des clients:', error);
            return [];
        }
    }

    /**
     * Obtenir un client par ID
     */
    getClientById(id) {
        try {
            return this.query('SELECT * FROM clients WHERE id = ?', [id]);
        } catch (error) {
            console.error('Erreur lors de la récupération du client:', error);
            return null;
        }
    }

    /**
     * Insérer un nouveau client
     */
    insertClient(client) {
        try {
            this.execute(`
                INSERT INTO clients (name, email, phone, address, city, status)
                VALUES (?, ?, ?, ?, ?, ?)
            `, [
                client.name,
                client.email || '',
                client.phone || '',
                client.address || '',
                client.city || '',
                client.status || 'active'
            ]);
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'insertion du client:', error);
            return false;
        }
    }

    /**
     * Mettre à jour un client
     */
    updateClient(id, client) {
        try {
            this.execute(`
                UPDATE clients 
                SET name = ?, email = ?, phone = ?, address = ?, city = ?, status = ?
                WHERE id = ?
            `, [
                client.name,
                client.email || '',
                client.phone || '',
                client.address || '',
                client.city || '',
                client.status || 'active',
                id
            ]);
            return true;
        } catch (error) {
            console.error('Erreur lors de la mise à jour du client:', error);
            return false;
        }
    }

    /**
     * Supprimer un client
     */
    deleteClient(id) {
        try {
            this.execute('DELETE FROM clients WHERE id = ?', [id]);
            return true;
        } catch (error) {
            console.error('Erreur lors de la suppression du client:', error);
            return false;
        }
    }

    // ==========================================
    // MÉTHODES POUR LES PRODUITS
    // ==========================================

    /**
     * Obtenir tous les produits
     */
    getAllProducts() {
        try {
            return this.queryAll(`
                SELECT * FROM products 
                ORDER BY created_at DESC
            `);
        } catch (error) {
            console.error('Erreur lors de la récupération des produits:', error);
            return [];
        }
    }

    /**
     * Insérer un nouveau produit
     */
    insertProduct(product) {
        try {
            this.execute(`
                INSERT INTO products (name, description, category, sku, price, cost, stock_quantity, min_stock, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            `, [
                product.name,
                product.description || '',
                product.category || '',
                product.sku || '',
                product.price || 0,
                product.cost || 0,
                product.stock || 0,
                product.minStock || 0,
                product.status || 'active'
            ]);
            return true;
        } catch (error) {
            console.error('Erreur lors de l\'insertion du produit:', error);
            return false;
        }
    }

    // ==========================================
    // MÉTHODES DE SAUVEGARDE ET RESTAURATION
    // ==========================================

    /**
     * Exporter toutes les données
     */
    exportAllData() {
        try {
            const data = {
                settings: this.getAllSettings(),
                clients: this.getAllClients(),
                products: this.getAllProducts(),
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            
            return JSON.stringify(data, null, 2);
        } catch (error) {
            console.error('Erreur lors de l\'export des données:', error);
            return null;
        }
    }

    /**
     * Importer des données
     */
    importAllData(jsonData) {
        try {
            const data = JSON.parse(jsonData);
            
            // Vider les tables existantes
            this.execute('DELETE FROM settings');
            this.execute('DELETE FROM clients');
            this.execute('DELETE FROM products');
            
            // Importer les paramètres
            if (data.settings) {
                for (const [key, value] of Object.entries(data.settings)) {
                    this.setSetting(key, value);
                }
            }
            
            // Importer les clients
            if (data.clients) {
                for (const client of data.clients) {
                    this.insertClient(client);
                }
            }
            
            // Importer les produits
            if (data.products) {
                for (const product of data.products) {
                    this.insertProduct(product);
                }
            }
            
            this.saveDatabase();
            return true;
            
        } catch (error) {
            console.error('Erreur lors de l\'import des données:', error);
            return false;
        }
    }

    /**
     * Créer une sauvegarde automatique
     */
    createBackup() {
        try {
            const data = this.exportAllData();
            const filename = `samaFacture_backup_${new Date().toISOString().split('T')[0]}.json`;
            
            // Sauvegarder dans localStorage comme backup
            localStorage.setItem('samaFacture_last_backup', data);
            localStorage.setItem('samaFacture_last_backup_date', new Date().toISOString());
            
            return { filename, data };
        } catch (error) {
            console.error('Erreur lors de la création de la sauvegarde:', error);
            return null;
        }
    }

    /**
     * Vérifier l'état de la base de données
     */
    getStatus() {
        return {
            isInitialized: this.isInitialized,
            hasDatabase: !!this.db,
            clientsCount: this.isInitialized ? this.getAllClients().length : 0,
            productsCount: this.isInitialized ? this.getAllProducts().length : 0,
            lastBackup: localStorage.getItem('samaFacture_last_backup_date')
        };
    }

    /**
     * Nettoyer et optimiser la base de données
     */
    optimize() {
        if (!this.isInitialized || !this.db) return;
        
        try {
            this.db.exec('VACUUM');
            this.db.exec('ANALYZE');
            this.saveDatabase();
            console.log('✅ Base de données optimisée');
        } catch (error) {
            console.error('Erreur lors de l\'optimisation:', error);
        }
    }
}

// Initialiser le gestionnaire de base de données
const databaseManager = new DatabaseManager();
