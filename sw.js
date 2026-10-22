const CACHE_VERSION = 'v19';
const CACHE_NAME = `portfolio-card-${CACHE_VERSION}`;

// Относительные пути работают везде: и в корне, и в подпапке
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './offline.html',
  './icon-192.png',
  './icon-512.png'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache).catch(err => {
        console.error('[SW] Ошибка кэширования:', err);
        // Важно: если один файл не найден, SW все равно установится, 
        // но этот файл не будет закэширован.
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
        // Для навигации показываем offline.html
        if (event.request.mode === 'navigate') {
          return caches.match('./offline.html');
        }
        return caches.match(event.request);
      })
  );
});