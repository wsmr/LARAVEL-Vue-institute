// Service Worker for DIE PWA
const CACHE_NAME = 'die-pwa-v1.0.0';
const STATIC_CACHE = 'die-static-v1.0.0';
const DYNAMIC_CACHE = 'die-dynamic-v1.0.0';

// Files to cache immediately
const STATIC_FILES = [
    '/',
    '/css/app.css',
    '/css/dark-mode.css',
    '/js/app.js',
    '/js/dark-mode.js',
    '/js/threejs-campus.js',
    '/js/voice-search.js',
    '/js/chatbot.js',
    '/js/pwa.js',
    '/js/animations.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png',
    // Add other essential assets
];

// Files to cache on demand
const CACHE_STRATEGIES = {
    // Cache first for static assets
    cacheFirst: [
        /\.(?:css|js|woff2?|ttf|eot)$/,
        /\/icons\//,
        /\/images\//
    ],
    
    // Network first for API calls and dynamic content
    networkFirst: [
        /\/api\//,
        /\/courses\//,
        /\/admin\//
    ],
    
    // Stale while revalidate for main pages
    staleWhileRevalidate: [
        /\/$/,
        /\.html$/
    ]
};

// Install event - cache static files
self.addEventListener('install', (event) => {
    console.log('Service Worker installing...');
    
    event.waitUntil(
        caches.open(STATIC_CACHE)
            .then(cache => {
                console.log('Caching static files...');
                return cache.addAll(STATIC_FILES);
            })
            .then(() => {
                console.log('Static files cached successfully');
                return self.skipWaiting();
            })
            .catch(error => {
                console.error('Error caching static files:', error);
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker activating...');
    
    event.waitUntil(
        caches.keys()
            .then(cacheNames => {
                return Promise.all(
                    cacheNames.map(cacheName => {
                        if (cacheName !== STATIC_CACHE && 
                            cacheName !== DYNAMIC_CACHE && 
                            cacheName !== CACHE_NAME) {
                            console.log('Deleting old cache:', cacheName);
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => {
                console.log('Service Worker activated');
                return self.clients.claim();
            })
    );
});

// Fetch event - handle requests with different strategies
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);
    
    // Skip non-GET requests
    if (request.method !== 'GET') {
        return;
    }
    
    // Skip external requests
    if (url.origin !== location.origin) {
        return;
    }
    
    // Determine caching strategy
    const strategy = getCachingStrategy(request.url);
    
    event.respondWith(
        handleRequest(request, strategy)
    );
});

// Determine caching strategy based on URL
function getCachingStrategy(url) {
    // Check cache first patterns
    for (const pattern of CACHE_STRATEGIES.cacheFirst) {
        if (pattern.test(url)) {
            return 'cacheFirst';
        }
    }
    
    // Check network first patterns
    for (const pattern of CACHE_STRATEGIES.networkFirst) {
        if (pattern.test(url)) {
            return 'networkFirst';
        }
    }
    
    // Check stale while revalidate patterns
    for (const pattern of CACHE_STRATEGIES.staleWhileRevalidate) {
        if (pattern.test(url)) {
            return 'staleWhileRevalidate';
        }
    }
    
    // Default to network first
    return 'networkFirst';
}

// Handle requests based on strategy
async function handleRequest(request, strategy) {
    switch (strategy) {
        case 'cacheFirst':
            return cacheFirst(request);
        case 'networkFirst':
            return networkFirst(request);
        case 'staleWhileRevalidate':
            return staleWhileRevalidate(request);
        default:
            return networkFirst(request);
    }
}

// Cache first strategy
async function cacheFirst(request) {
    try {
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        
        return networkResponse;
    } catch (error) {
        console.error('Cache first strategy failed:', error);
        return getOfflineFallback(request);
    }
}

// Network first strategy
async function networkFirst(request) {
    try {
        const networkResponse = await fetch(request);
        if (networkResponse.ok) {
            const cache = await caches.open(DYNAMIC_CACHE);
            cache.put(request, networkResponse.clone());
        }
        return networkResponse;
    } catch (error) {
        console.log('Network failed, trying cache:', request.url);
        const cachedResponse = await caches.match(request);
        if (cachedResponse) {
            return cachedResponse;
        }
        return getOfflineFallback(request);
    }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
    const cachedResponse = await caches.match(request);
    
    const networkResponsePromise = fetch(request)
        .then(networkResponse => {
            if (networkResponse.ok) {
                const cache = caches.open(DYNAMIC_CACHE);
                cache.then(c => c.put(request, networkResponse.clone()));
            }
            return networkResponse;
        })
        .catch(error => {
            console.error('Network request failed:', error);
            return null;
        });
    
    return cachedResponse || networkResponsePromise || getOfflineFallback(request);
}

// Get offline fallback
function getOfflineFallback(request) {
    const url = new URL(request.url);
    
    // Return offline page for navigation requests
    if (request.mode === 'navigate') {
        return caches.match('/') || new Response(
            getOfflineHTML(),
            { 
                headers: { 'Content-Type': 'text/html' },
                status: 200
            }
        );
    }
    
    // Return placeholder for images
    if (request.destination === 'image') {
        return new Response(
            getOfflineImageSVG(),
            { 
                headers: { 'Content-Type': 'image/svg+xml' },
                status: 200
            }
        );
    }
    
    // Return empty response for other requests
    return new Response('Offline', { status: 503 });
}

// Offline HTML page
function getOfflineHTML() {
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>DIE - Offline</title>
            <style>
                body {
                    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                    margin: 0;
                    padding: 20px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    text-align: center;
                }
                .container {
                    max-width: 400px;
                    padding: 40px;
                    background: rgba(255, 255, 255, 0.1);
                    border-radius: 20px;
                    backdrop-filter: blur(10px);
                }
                h1 { margin-bottom: 20px; }
                p { margin-bottom: 30px; opacity: 0.9; }
                button {
                    background: white;
                    color: #667eea;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 8px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: transform 0.2s;
                }
                button:hover { transform: scale(1.05); }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🌐 You're Offline</h1>
                <p>It looks like you're not connected to the internet. Don't worry, you can still browse cached content!</p>
                <button onclick="window.location.reload()">Try Again</button>
            </div>
        </body>
        </html>
    `;
}

// Offline image placeholder
function getOfflineImageSVG() {
    return `
        <svg width="200" height="150" xmlns="http://www.w3.org/2000/svg">
            <rect width="200" height="150" fill="#f3f4f6"/>
            <text x="100" y="75" text-anchor="middle" fill="#9ca3af" font-family="Arial, sans-serif" font-size="14">
                Image unavailable offline
            </text>
        </svg>
    `;
}

// Handle messages from main thread
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
    if (event.tag === 'background-sync') {
        event.waitUntil(doBackgroundSync());
    }
});

async function doBackgroundSync() {
    // Handle background sync tasks
    console.log('Background sync triggered');
    
    // Example: Sync offline form submissions
    try {
        const cache = await caches.open('offline-actions');
        const requests = await cache.keys();
        
        for (const request of requests) {
            try {
                await fetch(request);
                await cache.delete(request);
                console.log('Synced offline action:', request.url);
            } catch (error) {
                console.error('Failed to sync action:', error);
            }
        }
    } catch (error) {
        console.error('Background sync failed:', error);
    }
}

// Push notification handling
self.addEventListener('push', (event) => {
    if (!event.data) return;
    
    const data = event.data.json();
    const options = {
        body: data.body,
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-72x72.png',
        vibrate: [100, 50, 100],
        data: data.data,
        actions: data.actions || []
    };
    
    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
    event.notification.close();
    
    if (event.action) {
        // Handle action button clicks
        console.log('Notification action clicked:', event.action);
    } else {
        // Handle notification click
        event.waitUntil(
            clients.openWindow('/')
        );
    }
});

console.log('Service Worker loaded successfully');

