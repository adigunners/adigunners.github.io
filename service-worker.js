/**
 * Service Worker for FPL IIM Mumbai Website
 *
 * Provides basic Progressive Web App (PWA) functionality:
 * - Caches static assets for offline viewing
 * - Handles failed network requests gracefully
 * - Supports caching of CSS, JS, and image files
 *
 * @version 1.0.0
 * @date 2025-08-29
 */

const CACHE_NAME = 'fpl-iim-mumbai-v1.0.0';
const CACHE_URLS = [
  '/',
  '/index.html',
  '/winners.html',
  '/css/variables.css',
  '/css/base.css',
  '/css/header.css',
  '/css/components.css',
  '/css/winners.css',
  '/css/leaderboard.css',
  '/css/responsive.css',
  '/css/mobile-optimizations.css',
  '/css/advanced-mobile.css',
  '/js/utils.js',
  '/js/data-loader.js',
  '/js/error-handler.js',
  '/js/countdown.js',
  '/js/ui-manager.js',
  '/favicon.ico',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');

  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log('[ServiceWorker] Caching app shell');
        return cache.addAll(CACHE_URLS.map((url) => new Request(url, { cache: 'no-cache' })));
      })
      .catch((error) => {
        console.warn('[ServiceWorker] Cache installation failed:', error);
        // Don't fail the entire installation if caching fails
        return Promise.resolve();
      })
  );

  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');

  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('[ServiceWorker] Removing old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        // Claim control of all clients immediately
        return self.clients.claim();
      })
  );
});

// Fetch event - serve cached content when offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip cross-origin requests (APIs, external resources)
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // Return cached version if available
      if (cachedResponse) {
        console.log('[ServiceWorker] Serving from cache:', event.request.url);
        return cachedResponse;
      }

      // Otherwise, fetch from network
      return fetch(event.request)
        .then((response) => {
          // Don't cache if not a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          // Cache the new response for static assets
          if (shouldCache(event.request.url)) {
            const responseToCache = response.clone();
            caches
              .open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.warn('[ServiceWorker] Failed to cache response:', error);
              });
          }

          return response;
        })
        .catch((error) => {
          console.warn('[ServiceWorker] Network request failed:', event.request.url, error);

          // For navigation requests, return a basic offline page
          if (event.request.mode === 'navigate') {
            return new Response(
              `
                <!DOCTYPE html>
                <html>
                <head>
                  <title>FPL IIM Mumbai - Offline</title>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <style>
                    body { 
                      font-family: Arial, sans-serif; 
                      text-align: center; 
                      padding: 50px; 
                      background: #f5f5f5;
                    }
                    .offline-container { 
                      max-width: 500px; 
                      margin: 0 auto; 
                      background: white; 
                      padding: 30px; 
                      border-radius: 8px; 
                      box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                    }
                    h1 { color: #37003c; }
                    .retry-btn {
                      background: #37003c;
                      color: white;
                      border: none;
                      padding: 10px 20px;
                      border-radius: 5px;
                      cursor: pointer;
                      margin-top: 20px;
                    }
                  </style>
                </head>
                <body>
                  <div class="offline-container">
                    <h1>🏈 FPL IIM Mumbai</h1>
                    <h2>You're Offline</h2>
                    <p>Please check your internet connection and try again.</p>
                    <button class="retry-btn" onclick="window.location.reload()">
                      Retry
                    </button>
                  </div>
                </body>
                </html>
                `,
              {
                headers: {
                  'Content-Type': 'text/html',
                },
              }
            );
          }

          // For other requests, just fail
          throw error;
        });
    })
  );
});

/**
 * Determines if a URL should be cached
 * @param {string} url - The URL to check
 * @returns {boolean} - Whether to cache this URL
 */
function shouldCache(url) {
  // Cache CSS, JS, images, and HTML files
  return (
    url.includes('.css') ||
    url.includes('.js') ||
    url.includes('.png') ||
    url.includes('.jpg') ||
    url.includes('.jpeg') ||
    url.includes('.gif') ||
    url.includes('.svg') ||
    url.includes('.ico') ||
    url.includes('.html') ||
    url.endsWith('/')
  );
}

// Handle service worker updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[ServiceWorker] Service Worker script loaded');
