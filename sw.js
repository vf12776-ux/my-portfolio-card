const CACHE_VERSION = 'v27';
const CACHE_NAME = `portfolio-${CACHE_VERSION}`;

const urlsToCache = [
  '/my-portfolio-card/',
  '/my-portfolio-card/index.html',
  '/my-portfolio-card/style.css',
  '/my-portfolio-card/script.js',
  '/my-portfolio-card/manifest.json',
  '/my-portfolio-card/icon-192.png',
  '/my-portfolio-card/icon-512.png',
  '/my-portfolio-card/offline.html'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
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
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});