const CACHE_NAME = 'camview-v5';

// Passive service worker - just enough to trigger PWA installation
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    // Exclude video files/large media from Service Worker interception
    // to prevent Range request issues and 'unexpected error' in console.
    if (event.request.url.includes('.mp4') || event.request.url.includes('/files/')) {
        return;
    }

    event.respondWith(
        fetch(event.request).catch(() => {
            return caches.match(event.request);
        })
    );
});
