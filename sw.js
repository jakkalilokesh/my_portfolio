/* ===================================================
   SERVICE WORKER — Jakkali Lokesh Portfolio PWA
   Caches key assets for offline support
   =================================================== */

const CACHE_NAME = 'jl-portfolio-v3';
const OFFLINE_URL = '/my_portfolio/offline.html';

const ASSETS_TO_CACHE = [
    '/my_portfolio/',
    '/my_portfolio/index.html',
    '/my_portfolio/main.css',
    '/my_portfolio/script.js',
    '/my_portfolio/manifest.json',
    '/my_portfolio/favicon.png',
    '/my_portfolio/profile.png',
    '/my_portfolio/offline.html'
];

/* ── Install: pre-cache all assets ── */
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[SW] Pre-caching assets...');
            return cache.addAll(ASSETS_TO_CACHE);
        }).catch((err) => {
            console.warn('[SW] Pre-cache failed (some assets may not exist yet):', err);
        })
    );
    self.skipWaiting();
});

/* ── Activate: clean up old caches ── */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((name) => name !== CACHE_NAME)
                    .map((name) => {
                        console.log('[SW] Deleting old cache:', name);
                        return caches.delete(name);
                    })
            );
        })
    );
    self.clients.claim();
});

/* ── Fetch: Cache-first with network fallback ── */
self.addEventListener('fetch', (event) => {
    // Skip non-GET and cross-origin requests
    if (event.request.method !== 'GET') return;
    if (!event.request.url.startsWith(self.location.origin)) return;

    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
                // Serve from cache, update in background
                fetch(event.request)
                    .then((networkResponse) => {
                        if (networkResponse && networkResponse.status === 200) {
                            caches.open(CACHE_NAME).then((cache) => {
                                cache.put(event.request, networkResponse.clone());
                            });
                        }
                    })
                    .catch(() => {}); // Silent fail — we have cached version
                return cachedResponse;
            }

            // Not in cache — fetch from network
            return fetch(event.request).then((networkResponse) => {
                if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'opaque') {
                    return networkResponse;
                }
                // Cache the new response
                const cloned = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => cache.put(event.request, cloned));
                return networkResponse;
            }).catch(() => {
                // Network failed — serve offline page for navigation requests
                if (event.request.mode === 'navigate') {
                    return caches.match(OFFLINE_URL);
                }
            });
        })
    );
});
