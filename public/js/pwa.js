// Progressive Web App (PWA) Functionality
class PWAManager {
    constructor() {
        this.deferredPrompt = null;
        this.isInstalled = false;
        this.init();
    }

    init() {
        // Register service worker
        this.registerServiceWorker();
        
        // Handle install prompt
        this.handleInstallPrompt();
        
        // Check if app is already installed
        this.checkInstallStatus();
        
        // Add install button if needed
        this.addInstallButton();
        
        // Handle app updates
        this.handleAppUpdates();
    }

    async registerServiceWorker() {
        if ('serviceWorker' in navigator) {
            try {
                const registration = await navigator.serviceWorker.register('/sw.js');
                console.log('Service Worker registered successfully:', registration);
                
                // Listen for updates
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    newWorker.addEventListener('statechange', () => {
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            this.showUpdateNotification();
                        }
                    });
                });
                
            } catch (error) {
                console.error('Service Worker registration failed:', error);
            }
        }
    }

    handleInstallPrompt() {
        window.addEventListener('beforeinstallprompt', (e) => {
            // Prevent the mini-infobar from appearing on mobile
            e.preventDefault();
            
            // Save the event so it can be triggered later
            this.deferredPrompt = e;
            
            // Show install button
            this.showInstallButton();
        });

        // Handle successful installation
        window.addEventListener('appinstalled', () => {
            console.log('PWA was installed');
            this.isInstalled = true;
            this.hideInstallButton();
            this.showInstallSuccessMessage();
        });
    }

    checkInstallStatus() {
        // Check if app is running in standalone mode (installed)
        if (window.matchMedia('(display-mode: standalone)').matches || 
            window.navigator.standalone === true) {
            this.isInstalled = true;
        }
    }

    addInstallButton() {
        // Create install button
        const installButton = document.createElement('button');
        installButton.id = 'pwa-install-btn';
        installButton.className = 'fixed bottom-4 left-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg hover:bg-green-700 transition-colors z-40 hidden';
        installButton.innerHTML = '<i class="fas fa-download mr-2"></i>Install App';
        installButton.addEventListener('click', () => this.installApp());
        
        document.body.appendChild(installButton);
    }

    showInstallButton() {
        const installButton = document.getElementById('pwa-install-btn');
        if (installButton && !this.isInstalled) {
            installButton.classList.remove('hidden');
        }
    }

    hideInstallButton() {
        const installButton = document.getElementById('pwa-install-btn');
        if (installButton) {
            installButton.classList.add('hidden');
        }
    }

    async installApp() {
        if (!this.deferredPrompt) {
            return;
        }

        // Show the install prompt
        this.deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await this.deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        
        // Clear the deferredPrompt
        this.deferredPrompt = null;
        this.hideInstallButton();
    }

    showInstallSuccessMessage() {
        const message = document.createElement('div');
        message.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        message.innerHTML = '<i class="fas fa-check mr-2"></i>App installed successfully!';
        document.body.appendChild(message);

        setTimeout(() => {
            document.body.removeChild(message);
        }, 3000);
    }

    handleAppUpdates() {
        // Listen for service worker updates
        navigator.serviceWorker?.addEventListener('controllerchange', () => {
            window.location.reload();
        });
    }

    showUpdateNotification() {
        const notification = document.createElement('div');
        notification.className = 'fixed top-20 left-1/2 transform -translate-x-1/2 bg-blue-600 text-white px-6 py-3 rounded-lg shadow-lg z-50';
        notification.innerHTML = `
            <div class="flex items-center space-x-3">
                <i class="fas fa-sync-alt"></i>
                <span>New version available!</span>
                <button id="update-btn" class="bg-white text-blue-600 px-3 py-1 rounded text-sm hover:bg-gray-100">
                    Update
                </button>
                <button id="dismiss-update" class="text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(notification);

        // Handle update button click
        document.getElementById('update-btn')?.addEventListener('click', () => {
            this.updateApp();
            document.body.removeChild(notification);
        });

        // Handle dismiss button click
        document.getElementById('dismiss-update')?.addEventListener('click', () => {
            document.body.removeChild(notification);
        });

        // Auto-dismiss after 10 seconds
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 10000);
    }

    updateApp() {
        // Skip waiting and activate new service worker
        navigator.serviceWorker?.getRegistration().then(registration => {
            if (registration?.waiting) {
                registration.waiting.postMessage({ type: 'SKIP_WAITING' });
            }
        });
    }

    // Utility methods for PWA features
    isOnline() {
        return navigator.onLine;
    }

    addNetworkStatusListener() {
        window.addEventListener('online', () => {
            this.showNetworkStatus('Back online!', 'green');
        });

        window.addEventListener('offline', () => {
            this.showNetworkStatus('You are offline', 'red');
        });
    }

    showNetworkStatus(message, color) {
        const statusDiv = document.createElement('div');
        statusDiv.className = `fixed top-16 left-1/2 transform -translate-x-1/2 bg-${color}-600 text-white px-4 py-2 rounded shadow-lg z-50`;
        statusDiv.textContent = message;
        document.body.appendChild(statusDiv);

        setTimeout(() => {
            document.body.removeChild(statusDiv);
        }, 3000);
    }

    // Cache management
    async clearCache() {
        if ('caches' in window) {
            const cacheNames = await caches.keys();
            await Promise.all(
                cacheNames.map(cacheName => caches.delete(cacheName))
            );
            console.log('All caches cleared');
        }
    }

    async getCacheSize() {
        if ('storage' in navigator && 'estimate' in navigator.storage) {
            const estimate = await navigator.storage.estimate();
            return {
                used: estimate.usage,
                available: estimate.quota
            };
        }
        return null;
    }

    // Share API integration
    async shareContent(title, text, url) {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: title,
                    text: text,
                    url: url
                });
                console.log('Content shared successfully');
            } catch (error) {
                console.error('Error sharing content:', error);
                this.fallbackShare(url);
            }
        } else {
            this.fallbackShare(url);
        }
    }

    fallbackShare(url) {
        // Fallback sharing method
        if (navigator.clipboard) {
            navigator.clipboard.writeText(url).then(() => {
                this.showNetworkStatus('Link copied to clipboard!', 'blue');
            });
        }
    }

    // Notification API integration
    async requestNotificationPermission() {
        if ('Notification' in window) {
            const permission = await Notification.requestPermission();
            return permission === 'granted';
        }
        return false;
    }

    showNotification(title, options = {}) {
        if ('Notification' in window && Notification.permission === 'granted') {
            const notification = new Notification(title, {
                icon: '/icons/icon-192x192.png',
                badge: '/icons/icon-72x72.png',
                ...options
            });

            notification.onclick = () => {
                window.focus();
                notification.close();
            };

            return notification;
        }
    }
}

// Initialize PWA when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.pwaManager = new PWAManager();
    
    // Add network status listener
    window.pwaManager.addNetworkStatusListener();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PWAManager;
}

