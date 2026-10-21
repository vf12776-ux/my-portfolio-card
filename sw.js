const CACHE_VERSION = 'v18';
const CACHE_NAME = `portfolio-card-${CACHE_VERSION}`;

const urlsToCache = [
  '/my-portfolio-card/',
  '/my-portfolio-card/index.html',
  '/my-portfolio-card/style.css',
  '/my-portfolio-card/script.js',
  '/my-portfolio-card/manifest.json',
  '/my-portfolio-card/offline.html',
  '/my-portfolio-card/404.html',
  '/my-portfolio-card/icon-192.png',
  '/my-portfolio-card/icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.error('[SW] Ошибка кэширования (проверь, что все файлы существуют):', err);
      });
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      clients.claim(),
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) return caches.delete(cacheName);
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
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => {
        if (event.request.mode === 'navigate') {
          return caches.match('/my-portfolio-card/offline.html');
        }
        return caches.match(event.request);
      })
  );
});