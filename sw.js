const CACHE_NAME = 'camview-v2';

// Passive service worker - just enough to trigger PWA installation
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Standard network-first approach for index/data, 
    // but we need this event to exist for PWA status
    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
