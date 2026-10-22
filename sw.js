const CACHE_VERSION = 'v26';
const CACHE_NAME = `portfolio-${CACHE_VERSION}`;

// Используем абсолютные пути относительно корня домена
const urlsToCache = [
  '/my-portfolio-card/',
  '/my-portfolio-card/index.html',
  '/my-portfolio-card/style.css',
  '/my-portfolio-card/script.js',
  '/my-portfolio-card/manifest.json',
  '/my-portfolio-card/icon-192.png',
  '/my-portfolio-card/icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});