const CACHE_VERSION = 'v5';
const CACHE_NAME = `portfolio-card-${CACHE_VERSION}`;
const BASE = '/my-portfolio-card';

const urlsToCache = [
  `${BASE}/`,
  `${BASE}/index.html`,
  `${BASE}/style.css`,
  `${BASE}/script.js`,
  `${BASE}/manifest.json`,
  `${BASE}/offline.html`,
  `${BASE}/icon-192.png`,
  `${BASE}/icon-512.png`
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
        if (event.request.mode === 'navigate') {
          return caches.match(`${BASE}/offline.html`);
        }
        return caches.match(event.request);
      })
  );
});