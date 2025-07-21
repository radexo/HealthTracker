const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
    // Database operations
    dbQuery: (sql, params) => ipcRenderer.invoke('db-query', sql, params),
    dbRun: (sql, params) => ipcRenderer.invoke('db-run', sql, params),

    // File operations
    exportData: (format) => ipcRenderer.invoke('export-data', format),
    backupDatabase: () => ipcRenderer.invoke('backup-database'),

    // App info
    getAppInfo: () => ipcRenderer.invoke('get-app-info'),

    // Utility
    platform: process.platform,

    // Event listeners
    onMenuAction: (callback) => ipcRenderer.on('menu-action', callback),
    removeMenuListener: () => ipcRenderer.removeAllListeners('menu-action')
});

// Global app metadata
contextBridge.exposeInMainWorld('APP_METADATA', {
    name: 'HealthTracker 2025',
    version: '1.0.0',
    description: 'Профессиональное приложение для отслеживания показателей тела',
    author: 'HealthTracker Team',
    isElectron: true,
    buildDate: new Date().toISOString()
});

console.log('✅ Electron preload script loaded successfully');
