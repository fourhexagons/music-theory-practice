const CACHE_NAME = 'music-theory-v12';
const ASSETS = [
  '/',
  '/index.html',
  '/practice.html',
  '/404.html',
  '/css/style.css?v=5',
  '/js/main.js?v=13',
  '/manifest.json',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// Install event - cache assets
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(name => name !== CACHE_NAME)
            .map(name => caches.delete(name))
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch event - handle network and cache strategies
self.addEventListener('fetch', event => {
  const { request } = event;

  // For navigation requests, use a "network-first, falling back to offline page" strategy.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        // If the network request fails, serve the offline fallback page from the cache.
        return caches.match('/404.html');
      })
    );
  } else {
    // For all other assets (CSS, JS, images), use a "cache-first" strategy.
    event.respondWith(
      caches.match(request).then(response => {
        // Return from cache if available, otherwise fetch from network.
        return response || fetch(request);
      })
    );
  }
}); 