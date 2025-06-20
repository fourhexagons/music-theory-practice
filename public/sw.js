const CACHE_NAME = 'music-theory-v11';
const ASSETS = [
  '/',
  '/index.html',
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

// Fetch event - network-first for HTML, cache-first for others
self.addEventListener('fetch', event => {
  // For navigation requests (HTML pages), try network first.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        // If network fails, serve from cache
        return caches.match(event.request);
      })
    );
    return;
  }

  // For other requests (CSS, JS, images), use cache-first strategy.
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
}); 