/**
 * SamaFacture - Main Electron Process
 * Point d'entrée principal pour l'application Electron
 */

const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const Store = require('electron-store');
const path = require('path');
const fs = require('fs');

// Configuration des logs
log.transports.file.level = 'info';
autoUpdater.logger = log;

// Store pour les préférences
const store = new Store();

// Variables globales
let mainWindow;
let splashWindow;
const isDev = process.env.NODE_ENV === 'development';
const isMac = process.platform === 'darwin';

/**
 * Créer la fenêtre de splash
 */
function createSplashWindow() {
    splashWindow = new BrowserWindow({
        width: 400,
        height: 300,
        frame: false,
        alwaysOnTop: true,
        transparent: true,
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        }
    });

    const splashHtml = `
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {
                    margin: 0;
                    padding: 0;
                    background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
                    color: white;
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100vh;
                    border-radius: 10px;
                }
                .logo {
                    font-size: 48px;
                    margin-bottom: 20px;
                    animation: pulse 2s infinite;
                }
                .title {
                    font-size: 24px;
                    font-weight: 600;
                    margin-bottom: 10px;
                }
                .subtitle {
                    font-size: 14px;
                    opacity: 0.8;
                }
                .loader {
                    width: 40px;
                    height: 40px;
                    border: 3px solid rgba(255,255,255,0.3);
                    border-top: 3px solid white;
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin-top: 20px;
                }
                @keyframes pulse {
                    0%, 100% { transform: scale(1); }
                    50% { transform: scale(1.1); }
                }
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            </style>
        </head>
        <body>
            <div class="logo">📊</div>
            <div class="title">SamaFacture</div>
            <div class="subtitle">Gestion de facturation pour TPE</div>
            <div class="loader"></div>
        </body>
        </html>
    `;

    splashWindow.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(splashHtml)}`);

    splashWindow.on('closed', () => {
        splashWindow = null;
    });
}

/**
 * Créer la fenêtre principale
 */
function createMainWindow() {
    // Récupérer les dimensions sauvegardées
    const windowBounds = store.get('windowBounds', {
        width: 1200,
        height: 800,
        x: undefined,
        y: undefined
    });

    mainWindow = new BrowserWindow({
        ...windowBounds,
        minWidth: 800,
        minHeight: 600,
        show: false, // Ne pas afficher immédiatement
        icon: path.join(__dirname, 'build-resources', 'icon.png'),
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true,
            enableRemoteModule: false,
            webSecurity: true,
            preload: path.join(__dirname, 'preload.js')
        },
        titleBarStyle: isMac ? 'hiddenInset' : 'default'
    });

    // Charger l'application
    const startUrl = isDev 
        ? 'http://localhost:8000' 
        : `file://${path.join(__dirname, 'src', 'index.html')}`;
    
    mainWindow.loadURL(startUrl);

    // Afficher la fenêtre quand elle est prête
    mainWindow.once('ready-to-show', () => {
        if (splashWindow) {
            splashWindow.close();
        }
        mainWindow.show();
        
        // Focus sur la fenêtre
        if (isDev) {
            mainWindow.webContents.openDevTools();
        }
    });

    // Sauvegarder les dimensions de la fenêtre
    mainWindow.on('close', () => {
        store.set('windowBounds', mainWindow.getBounds());
    });

    mainWindow.on('closed', () => {
        mainWindow = null;
    });

    // Gérer les liens externes
    mainWindow.webContents.setWindowOpenHandler(({ url }) => {
        shell.openExternal(url);
        return { action: 'deny' };
    });

    // Empêcher la navigation vers des sites externes
    mainWindow.webContents.on('will-navigate', (event, navigationUrl) => {
        const parsedUrl = new URL(navigationUrl);
        
        if (parsedUrl.origin !== startUrl && !navigationUrl.startsWith('file://')) {
            event.preventDefault();
            shell.openExternal(navigationUrl);
        }
    });
}

/**
 * Créer le menu de l'application
 */
function createMenu() {
    const template = [
        ...(isMac ? [{
            label: app.getName(),
            submenu: [
                { role: 'about', label: 'À propos de SamaFacture' },
                { type: 'separator' },
                { role: 'services', label: 'Services' },
                { type: 'separator' },
                { role: 'hide', label: 'Masquer SamaFacture' },
                { role: 'hideothers', label: 'Masquer les autres' },
                { role: 'unhide', label: 'Tout afficher' },
                { type: 'separator' },
                { role: 'quit', label: 'Quitter SamaFacture' }
            ]
        }] : []),
        {
            label: 'Fichier',
            submenu: [
                {
                    label: 'Nouveau',
                    submenu: [
                        {
                            label: 'Nouvelle facture',
                            accelerator: 'CmdOrCtrl+N',
                            click: () => {
                                mainWindow.webContents.send('menu-action', 'new-invoice');
                            }
                        },
                        {
                            label: 'Nouveau client',
                            accelerator: 'CmdOrCtrl+Shift+N',
                            click: () => {
                                mainWindow.webContents.send('menu-action', 'new-client');
                            }
                        },
                        {
                            label: 'Nouveau produit',
                            click: () => {
                                mainWindow.webContents.send('menu-action', 'new-product');
                            }
                        }
                    ]
                },
                { type: 'separator' },
                {
                    label: 'Exporter',
                    submenu: [
                        {
                            label: 'Exporter en PDF',
                            click: () => {
                                mainWindow.webContents.send('menu-action', 'export-pdf');
                            }
                        },
                        {
                            label: 'Exporter en Excel',
                            click: () => {
                                mainWindow.webContents.send('menu-action', 'export-excel');
                            }
                        }
                    ]
                },
                {
                    label: 'Importer',
                    click: async () => {
                        const result = await dialog.showOpenDialog(mainWindow, {
                            properties: ['openFile'],
                            filters: [
                                { name: 'Fichiers JSON', extensions: ['json'] },
                                { name: 'Fichiers CSV', extensions: ['csv'] },
                                { name: 'Tous les fichiers', extensions: ['*'] }
                            ]
                        });
                        
                        if (!result.canceled) {
                            mainWindow.webContents.send('menu-action', 'import-file', result.filePaths[0]);
                        }
                    }
                },
                { type: 'separator' },
                ...(isMac ? [] : [{ role: 'quit', label: 'Quitter' }])
            ]
        },
        {
            label: 'Édition',
            submenu: [
                { role: 'undo', label: 'Annuler' },
                { role: 'redo', label: 'Rétablir' },
                { type: 'separator' },
                { role: 'cut', label: 'Couper' },
                { role: 'copy', label: 'Copier' },
                { role: 'paste', label: 'Coller' },
                { role: 'selectall', label: 'Tout sélectionner' }
            ]
        },
        {
            label: 'Affichage',
            submenu: [
                { role: 'reload', label: 'Actualiser' },
                { role: 'forceReload', label: 'Actualiser (force)' },
                { role: 'toggleDevTools', label: 'Outils de développement' },
                { type: 'separator' },
                { role: 'resetZoom', label: 'Zoom normal' },
                { role: 'zoomin', label: 'Zoom avant' },
                { role: 'zoomout', label: 'Zoom arrière' },
                { type: 'separator' },
                { role: 'togglefullscreen', label: 'Plein écran' }
            ]
        },
        {
            label: 'Navigation',
            submenu: [
                {
                    label: 'Tableau de bord',
                    accelerator: 'CmdOrCtrl+1',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'navigate', 'dashboard');
                    }
                },
                {
                    label: 'Clients',
                    accelerator: 'CmdOrCtrl+2',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'navigate', 'clients');
                    }
                },
                {
                    label: 'Produits',
                    accelerator: 'CmdOrCtrl+3',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'navigate', 'products');
                    }
                },
                {
                    label: 'Factures',
                    accelerator: 'CmdOrCtrl+4',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'navigate', 'invoices');
                    }
                },
                {
                    label: 'Devis',
                    accelerator: 'CmdOrCtrl+5',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'navigate', 'quotes');
                    }
                },
                {
                    label: 'Dépenses',
                    accelerator: 'CmdOrCtrl+6',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'navigate', 'expenses');
                    }
                },
                {
                    label: 'Paramètres',
                    accelerator: 'CmdOrCtrl+,',
                    click: () => {
                        mainWindow.webContents.send('menu-action', 'navigate', 'settings');
                    }
                }
            ]
        },
        {
            label: 'Fenêtre',
            submenu: [
                { role: 'minimize', label: 'Réduire' },
                { role: 'close', label: 'Fermer' },
                ...(isMac ? [
                    { type: 'separator' },
                    { role: 'front', label: 'Tout ramener au premier plan' }
                ] : [])
            ]
        },
        {
            label: 'Aide',
            submenu: [
                {
                    label: 'À propos de SamaFacture',
                    click: () => {
                        dialog.showMessageBox(mainWindow, {
                            type: 'info',
                            title: 'À propos de SamaFacture',
                            message: 'SamaFacture v1.0.0',
                            detail: 'Application complète de gestion de facturation pour TPE sénégalaises.\n\nDéveloppé avec Electron et technologies web modernes.',
                            buttons: ['OK']
                        });
                    }
                },
                {
                    label: 'Vérifier les mises à jour',
                    click: () => {
                        autoUpdater.checkForUpdatesAndNotify();
                    }
                },
                { type: 'separator' },
                {
                    label: 'Site web',
                    click: () => {
                        shell.openExternal('https://samafacture.com');
                    }
                },
                {
                    label: 'Support',
                    click: () => {
                        shell.openExternal('mailto:support@samafacture.com');
                    }
                }
            ]
        }
    ];

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
}

/**
 * Configuration des mises à jour automatiques
 */
function setupAutoUpdater() {
    autoUpdater.checkForUpdatesAndNotify();

    autoUpdater.on('checking-for-update', () => {
        log.info('Vérification des mises à jour...');
    });

    autoUpdater.on('update-available', (info) => {
        log.info('Mise à jour disponible:', info);
    });

    autoUpdater.on('update-not-available', (info) => {
        log.info('Aucune mise à jour disponible:', info);
    });

    autoUpdater.on('error', (err) => {
        log.error('Erreur lors de la mise à jour:', err);
    });

    autoUpdater.on('download-progress', (progressObj) => {
        let logMessage = `Vitesse de téléchargement: ${progressObj.bytesPerSecond}`;
        logMessage += ` - Téléchargé ${progressObj.percent}%`;
        logMessage += ` (${progressObj.transferred}/${progressObj.total})`;
        log.info(logMessage);
    });

    autoUpdater.on('update-downloaded', (info) => {
        log.info('Mise à jour téléchargée:', info);
        autoUpdater.quitAndInstall();
    });
}

/**
 * Gestionnaires d'événements IPC
 */
function setupIpcHandlers() {
    // Gestionnaire pour sauvegarder un fichier
    ipcMain.handle('save-file', async (event, data, filename) => {
        const result = await dialog.showSaveDialog(mainWindow, {
            defaultPath: filename,
            filters: [
                { name: 'Fichiers PDF', extensions: ['pdf'] },
                { name: 'Fichiers Excel', extensions: ['xlsx'] },
                { name: 'Fichiers JSON', extensions: ['json'] },
                { name: 'Tous les fichiers', extensions: ['*'] }
            ]
        });

        if (!result.canceled) {
            fs.writeFileSync(result.filePath, data);
            return result.filePath;
        }
        return null;
    });

    // Gestionnaire pour lire un fichier
    ipcMain.handle('read-file', async (event, filePath) => {
        try {
            return fs.readFileSync(filePath, 'utf8');
        } catch (error) {
            throw error;
        }
    });

    // Gestionnaire pour les préférences
    ipcMain.handle('get-store-value', (event, key) => {
        return store.get(key);
    });

    ipcMain.handle('set-store-value', (event, key, value) => {
        store.set(key, value);
    });

    // Gestionnaire pour ouvrir des liens externes
    ipcMain.handle('open-external', (event, url) => {
        shell.openExternal(url);
    });
}

/**
 * Événements de l'application
 */
app.whenReady().then(() => {
    createSplashWindow();
    
    setTimeout(() => {
        createMainWindow();
        createMenu();
        setupAutoUpdater();
        setupIpcHandlers();
    }, 2000); // Afficher le splash pendant 2 secondes

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createMainWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (!isMac) {
        app.quit();
    }
});

app.on('before-quit', () => {
    // Sauvegarder les données avant de quitter
    if (mainWindow) {
        mainWindow.webContents.send('app-before-quit');
    }
});

// Sécurité : empêcher la création de nouvelles fenêtres
app.on('web-contents-created', (event, contents) => {
    contents.on('new-window', (event, navigationUrl) => {
        event.preventDefault();
        shell.openExternal(navigationUrl);
    });
});

// Gestion des erreurs non capturées
process.on('uncaughtException', (error) => {
    log.error('Erreur non capturée:', error);
});

process.on('unhandledRejection', (reason, promise) => {
    log.error('Promesse rejetée non gérée:', reason);
});
