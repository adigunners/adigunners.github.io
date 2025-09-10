/**
 * Service Worker for FPL IIM Mumbai Website
 *
 * Provides basic Progressive Web App (PWA) functionality:
 * - Caches static assets for offline viewing
 * - Handles failed network requests gracefully
 * - Supports caching of CSS, JS, and image files
 *
 * @version 1.0.3
 * @date 2025-09-04
*/

// Import shared version (available both in window and worker scope)
try {
  importScripts('/version.js');
} catch (_) {}

const VERSION = (typeof self !== 'undefined' && self.SITE_VERSION) ? self.SITE_VERSION : 'dev';
const CACHE_NAME = `fpl-iim-mumbai-v${VERSION}`;
const CACHE_URLS = [
  '/',
  '/index.html',
  '/winners.html',
  // Consolidated CSS bundle
  '/css/styles.css',
  '/js/utils.js',
  '/js/data-loader.js',
  '/js/error-handler.js',
  '/js/countdown.js',
  '/js/ui-manager.js',
  '/favicon.ico',
  '/assets/icons.svg',
  '/assets/fonts/poppins/poppins-latin-400.woff2',
  '/assets/fonts/poppins/poppins-latin-600.woff2',
  '/assets/fonts/poppins/poppins-latin-700.woff2',
  // Twemoji local assets (self-hosted subset)
  '/assets/twemoji/twemoji.min.js',
  '/assets/twemoji/svg/26bd.svg', // ⚽
  '/assets/twemoji/svg/1f386.svg', // 🎆
  '/assets/twemoji/svg/1f3c6.svg', // 🏆
  '/assets/twemoji/svg/1f4b0.svg', // 💰
  '/assets/twemoji/svg/1f4c3.svg', // 📃 (rules)
  '/assets/twemoji/svg/1f6aa.svg', // 🚪
  '/assets/twemoji/svg/1f4c5.svg', // 📅
  '/assets/twemoji/svg/1f5d3.svg', // 🗓️
  '/assets/twemoji/svg/1f3c5.svg', // 🏅
  '/assets/twemoji/svg/1f3af.svg', // 🎯
  '/assets/twemoji/svg/1f4ca.svg', // 📊
  '/assets/twemoji/svg/1f500.svg', // 🔀
  '/assets/twemoji/svg/1f504.svg', // 🔄
  '/assets/twemoji/svg/2b05.svg',  // ⬅️
  '/assets/twemoji/svg/25c0.svg', // ◀️
  '/assets/twemoji/svg/25b6.svg', // ▶️
  '/assets/twemoji/svg/1f465.svg', // 👥
  '/assets/twemoji/svg/2139.svg', // ℹ️
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');

  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      let urlsToCache = [...CACHE_URLS];
      // Try to include build-time precache manifest if present
      try {
        const resp = await fetch('/precache-manifest.json', { cache: 'no-store' });
        if (resp.ok) {
          const manifest = await resp.json();
          if (Array.isArray(manifest) && manifest.length) {
            urlsToCache = Array.from(new Set(urlsToCache.concat(manifest)));
          }
        }
      } catch (e) {
        // No manifest available; continue with defaults
      }
      console.log('[ServiceWorker] Caching app shell:', urlsToCache.length, 'items');
      await cache.addAll(urlsToCache.map((url) => new Request(url, { cache: 'no-cache' })));
    })()
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
  if (event.request.method !== 'GET') return;

  // Skip cross-origin requests (APIs, external resources)
  if (!event.request.url.startsWith(self.location.origin)) return;

  const req = event.request;

  // Detect navigation/HTML requests
  const isNavigation =
    req.mode === 'navigate' ||
    (req.headers && req.headers.get('accept') && req.headers.get('accept').includes('text/html'));

  if (isNavigation) {
    // Network-first for navigations so reload gets freshest HTML
    event.respondWith(
      fetch(req, { cache: 'no-store' })
        .then((networkResp) => {
          // Cache a copy as offline fallback
          if (networkResp && networkResp.status === 200) {
            const copy = networkResp.clone();
            event.waitUntil(
              caches.open(CACHE_NAME).then((cache) => cache.put(req, copy)).catch(() => {})
            );
          }
          return networkResp;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          // Fallback simple offline page
          return new Response(
            `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Offline</title><style>body{font-family:Arial,sans-serif;background:#f5f5f5;margin:0;padding:32px;text-align:center}.card{max-width:520px;margin:0 auto;background:#fff;border-radius:8px;box-shadow:0 2px 10px rgba(0,0,0,.1);padding:24px}h1{color:#37003c;margin:0 0 8px}button{background:#37003c;color:#fff;border:none;border-radius:6px;padding:10px 16px;cursor:pointer;margin-top:16px}</style></head><body><div class="card"><h1>🏈 FPL IIM Mumbai</h1><p>You're offline. Please reconnect and try again.</p><button onclick="location.reload()">Retry</button></div></body></html>`,
            { headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
    return;
  }

  // Cache-first with background update for static assets
  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      if (cachedResponse) {
        // Background revalidation
        event.waitUntil(
          fetch(req)
            .then((networkResp) => {
              if (networkResp && networkResp.status === 200 && networkResp.type === 'basic') {
                return caches.open(CACHE_NAME).then((cache) =>
                  cache.put(req, withLongTTL(networkResp.clone(), req))
                );
              }
            })
            .catch(() => {})
        );
        return cachedResponse;
      }

      return fetch(req)
        .then((response) => {
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }

          if (shouldCache(req.url)) {
            const responseToCache = withLongTTL(response.clone(), req);
            caches
              .open(CACHE_NAME)
              .then((cache) => cache.put(req, responseToCache))
              .catch((error) => console.warn('[ServiceWorker] Failed to cache response:', error));
          }

          return withLongTTL(response, req);
        })
        .catch((error) => {
          console.warn('[ServiceWorker] Network request failed:', req.url, error);
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

/**
 * Wrap a Response ensuring long-lived caching semantics for static assets.
 * Adds Cache-Control headers to responses we serve (does not change server headers).
 */
function withLongTTL(response, request) {
  try {
    const url = new URL(request.url);
    const isHTML = request.destination === 'document' || url.pathname.endsWith('.html');
    const isStatic = ['style', 'script', 'font', 'image'].includes(request.destination);

    // For HTML, avoid long TTL; let the browser revalidate normally.
    if (isHTML) return response;

    // For static assets, add long TTL + immutable hint.
    if (isStatic || shouldCache(url.pathname)) {
      const headers = new Headers(response.headers);
      headers.set('Cache-Control', 'public, max-age=31536000, immutable');
      return new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers,
      });
    }
  } catch (e) {
    // Fall through if anything goes wrong
  }
  return response;
}

// Handle service worker updates
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

console.log('[ServiceWorker] Service Worker script loaded');
