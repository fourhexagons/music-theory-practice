const CACHE_NAME = 'music-theory-v17';
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
      .then(cache => {
        // Cache assets individually to handle failures gracefully
        return Promise.allSettled(
          ASSETS.map(asset => 
            cache.add(asset).catch(error => {
              console.warn(`Failed to cache ${asset}:`, error);
              return null;
            })
          )
        );
      })
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
  const url = new URL(request.url);

  // Skip caching for test pages and their assets
  if (url.pathname.startsWith('/tests/') || url.pathname.includes('test_') || url.pathname.includes('debug_')) {
    event.respondWith(fetch(request));
    return;
  }

  // For navigation requests, use a "network-first, falling back to offline page" strategy.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => {
        // If the network request fails, serve the offline fallback page from the cache.
        return caches.match('/404.html');
      })
    );
  } else {
    // For all other assets (CSS, JS, images), use a "cache-first" strategy with error handling.
    event.respondWith(
      caches.match(request).then(response => {
        return response || fetch(request).catch(() =>
          new Response('Network error', { status: 408, statusText: 'Network error' })
        );
      })
    );
  }
}); 