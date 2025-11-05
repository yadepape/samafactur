/**
 * SamaFacture - Preload Script
 * Script de préchargement pour Electron
 */

const { contextBridge, ipcRenderer } = require('electron');

// Exposer les APIs sécurisées au renderer process
contextBridge.exposeInMainWorld('electronAPI', {
    // Gestion des fichiers
    saveFile: (data, filename) => ipcRenderer.invoke('save-file', data, filename),
    readFile: (filePath) => ipcRenderer.invoke('read-file', filePath),
    
    // Gestion des préférences
    getStoreValue: (key) => ipcRenderer.invoke('get-store-value', key),
    setStoreValue: (key, value) => ipcRenderer.invoke('set-store-value', key, value),
    
    // Ouvrir des liens externes
    openExternal: (url) => ipcRenderer.invoke('open-external', url),
    
    // Écouter les événements du menu
    onMenuAction: (callback) => ipcRenderer.on('menu-action', callback),
    
    // Écouter l'événement avant fermeture
    onAppBeforeQuit: (callback) => ipcRenderer.on('app-before-quit', callback),
    
    // Informations sur l'environnement
    isElectron: true,
    platform: process.platform,
    versions: process.versions
});

// Exposer des utilitaires pour le développement
if (process.env.NODE_ENV === 'development') {
    contextBridge.exposeInMainWorld('electronDev', {
        openDevTools: () => ipcRenderer.invoke('open-dev-tools'),
        reloadApp: () => ipcRenderer.invoke('reload-app'),
        getAppInfo: () => ipcRenderer.invoke('get-app-info')
    });
}

// Gestion des erreurs du preload
process.on('uncaughtException', (error) => {
    console.error('❌ Erreur preload:', error);
});

console.log('✅ Preload script chargé');
