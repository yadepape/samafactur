/**
 * SamaFacture - Service Worker
 * PWA Service Worker pour fonctionnalités offline et cache
 */

const CACHE_NAME = 'samafacture-v1.0.0';
const STATIC_CACHE = 'samafacture-static-v1.0.0';
const DYNAMIC_CACHE = 'samafacture-dynamic-v1.0.0';

// Fichiers à mettre en cache pour le fonctionnement offline
const STATIC_FILES = [
    '/',
    '/index.html',
    '/manifest.json',
    
    // CSS
    '/css/main.css',
    '/css/dashboard.css',
    '/css/clients.css',
    '/css/products.css',
    '/css/common-modules.css',
    '/css/settings.css',
    
    // JavaScript
    '/js/app.js',
    '/js/license/crypto.js',
    '/js/license/LicenseManager.js',
    '/js/database/DatabaseManager.js',
    '/js/modules/ClientManager.js',
    '/js/modules/ProductManager.js',
    '/js/modules/InvoiceManager.js',
    '/js/modules/QuoteManager.js',
    '/js/modules/ExpenseManager.js',
    '/js/modules/SettingsManager.js',
    
    // Base de données
    '/js/database/schema.sql',
    
    // Ressources externes (CDN)
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.js',
    'https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/sql-wasm.wasm'
];

// Fichiers à exclure du cache
const EXCLUDE_FROM_CACHE = [
    '/sw.js',
    '/icons/',
    '/screenshots/',
    'chrome-extension://',
    'moz-extension://'
];

/**
 * Installation du Service Worker
 */
self.addEventListener('install', (event) => {
    console.log('🔧 Service Worker: Installation en cours...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then((cache) => {
                console.log('📦 Service Worker: Mise en cache des fichiers statiques');
                return cache.addAll(STATIC_FILES.filter(url => {
                    // Filtrer les URLs externes qui pourraient échouer
                    return !url.startsWith('http') || url.includes('cdnjs.cloudflare.com');
                }));
            })
            .then(() => {
                console.log('✅ Service Worker: Installation terminée');
                return self.skipWaiting();
            })
            .catch((error) => {
                console.error('❌ Service Worker: Erreur lors de l\'installation:', error);
            })
    );
});

/**
 * Activation du Service Worker
 */
self.addEventListener('activate', (event) => {
    console.log('🚀 Service Worker: Activation en cours...');
    
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        // Supprimer les anciens caches
                        if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
                            console.log('🗑️ Service Worker: Suppression de l\'ancien cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ Service Worker: Activation terminée');
                return self.clients.claim();
            })
    );
});

/**
 * Interception des requêtes réseau
 */
self.addEventListener('fetch', (event) => {
    const request = event.request;
    const url = new URL(request.url);
    
    // Ignorer certaines requêtes
    if (shouldExcludeFromCache(request.url)) {
        return;
    }
    
    // Stratégie différente selon le type de ressource
    if (request.method === 'GET') {
        if (isStaticAsset(request.url)) {
            // Cache First pour les ressources statiques
            event.respondWith(cacheFirst(request));
        } else if (isAPIRequest(request.url)) {
            // Network First pour les API
            event.respondWith(networkFirst(request));
        } else {
            // Stale While Revalidate pour les pages
            event.respondWith(staleWhileRevalidate(request));
        }
    }
});

/**
 * Stratégie Cache First
 * Cherche d'abord dans le cache, puis sur le réseau
 */
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        
        // Mettre en cache si la réponse est valide
        if (networkResponse.status === 200) {
            const cache = await caches.open(STATIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('❌ Cache First error:', error);
        return getOfflineFallback(request);
    }
}

/**
 * Stratégie Network First
 * Essaie le réseau d'abord, puis le cache
 */
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        
        // Mettre en cache si la réponse est valide
        if (networkResponse.status === 200) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.log('🔄 Network First: Fallback vers le cache pour', request.url);
        const cachedResponse = await caches.match(request);
        return cachedResponse || getOfflineFallback(request);
    }
}

/**
 * Stratégie Stale While Revalidate
 * Retourne le cache immédiatement et met à jour en arrière-plan
 */
async function staleWhileRevalidate(request) {
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    // Mise à jour en arrière-plan
    const networkResponsePromise = fetch(request)
        .then((networkResponse) => {
            if (networkResponse.status === 200) {
                cache.put(request, networkResponse.clone());
            }
            return networkResponse;
        })
        .catch(() => null);
    
    // Retourner le cache immédiatement ou attendre le réseau
    return cachedResponse || networkResponsePromise || getOfflineFallback(request);
}

/**
 * Vérifier si une URL doit être exclue du cache
 */
function shouldExcludeFromCache(url) {
    return EXCLUDE_FROM_CACHE.some(pattern => url.includes(pattern)) ||
           url.includes('chrome-extension') ||
           url.includes('moz-extension') ||
           url.includes('safari-extension');
}

/**
 * Vérifier si c'est une ressource statique
 */
function isStaticAsset(url) {
    return url.includes('.css') ||
           url.includes('.js') ||
           url.includes('.png') ||
           url.includes('.jpg') ||
           url.includes('.jpeg') ||
           url.includes('.svg') ||
           url.includes('.woff') ||
           url.includes('.woff2') ||
           url.includes('.ttf') ||
           url.includes('.eot');
}

/**
 * Vérifier si c'est une requête API
 */
function isAPIRequest(url) {
    return url.includes('/api/') ||
           url.includes('api.') ||
           url.includes('.json') && !url.includes('manifest.json');
}

/**
 * Obtenir une réponse de fallback offline
 */
function getOfflineFallback(request) {
    if (request.destination === 'document') {
        return caches.match('/index.html');
    }
    
    if (request.destination === 'image') {
        return new Response(
            '<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200" viewBox="0 0 200 200"><rect width="200" height="200" fill="#f3f4f6"/><text x="100" y="100" text-anchor="middle" dy=".3em" fill="#9ca3af">Image non disponible</text></svg>',
            { headers: { 'Content-Type': 'image/svg+xml' } }
        );
    }
    
    return new Response('Contenu non disponible hors ligne', {
        status: 503,
        statusText: 'Service Unavailable'
    });
}

/**
 * Gestion des messages du client
 */
self.addEventListener('message', (event) => {
    const { type, payload } = event.data;
    
    switch (type) {
        case 'SKIP_WAITING':
            self.skipWaiting();
            break;
            
        case 'GET_CACHE_STATUS':
            getCacheStatus().then(status => {
                event.ports[0].postMessage({ type: 'CACHE_STATUS', payload: status });
            });
            break;
            
        case 'CLEAR_CACHE':
            clearAllCaches().then(() => {
                event.ports[0].postMessage({ type: 'CACHE_CLEARED' });
            });
            break;
            
        case 'UPDATE_CACHE':
            updateCache().then(() => {
                event.ports[0].postMessage({ type: 'CACHE_UPDATED' });
            });
            break;
    }
});

/**
 * Obtenir le statut du cache
 */
async function getCacheStatus() {
    const cacheNames = await caches.keys();
    const status = {};
    
    for (const cacheName of cacheNames) {
        const cache = await caches.open(cacheName);
        const keys = await cache.keys();
        status[cacheName] = {
            count: keys.length,
            size: await getCacheSize(cache, keys)
        };
    }
    
    return status;
}

/**
 * Calculer la taille du cache
 */
async function getCacheSize(cache, keys) {
    let totalSize = 0;
    
    for (const key of keys.slice(0, 10)) { // Limiter pour éviter les timeouts
        try {
            const response = await cache.match(key);
            if (response) {
                const blob = await response.blob();
                totalSize += blob.size;
            }
        } catch (error) {
            // Ignorer les erreurs
        }
    }
    
    return totalSize;
}

/**
 * Vider tous les caches
 */
async function clearAllCaches() {
    const cacheNames = await caches.keys();
    return Promise.all(
        cacheNames.map(cacheName => caches.delete(cacheName))
    );
}

/**
 * Mettre à jour le cache
 */
async function updateCache() {
    const cache = await caches.open(STATIC_CACHE);
    return cache.addAll(STATIC_FILES.filter(url => !url.startsWith('http')));
}

/**
 * Gestion des notifications push (pour futures fonctionnalités)
 */
self.addEventListener('push', (event) => {
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [200, 100, 200],
        data: data.data || {},
        actions: [
            {
                action: 'open',
                title: 'Ouvrir',
                icon: '/icons/icon-72x72.png'
            },
            {
                action: 'close',
                title: 'Fermer'
            }
        ]
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

/**
 * Gestion des clics sur les notifications
 */
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action === 'open' || !event.action) {
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

/**
 * Gestion de la synchronisation en arrière-plan
 */
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

/**
 * Synchronisation en arrière-plan
 */
async function doBackgroundSync() {
    try {
        // Ici on pourrait synchroniser les données avec un serveur
        console.log('🔄 Synchronisation en arrière-plan');
        
        // Pour l'instant, on fait juste un nettoyage du cache
        const cacheNames = await caches.keys();
        const oldCaches = cacheNames.filter(name => 
            !name.includes('v1.0.0') && name.includes('samafacture')
        );
        
        await Promise.all(
            oldCaches.map(cacheName => caches.delete(cacheName))
        );
        
        console.log('✅ Synchronisation terminée');
    } catch (error) {
        console.error('❌ Erreur lors de la synchronisation:', error);
    }
}

console.log('🚀 Service Worker SamaFacture chargé et prêt !');
