const CACHE_VERSION = 'v16';
const CACHE_NAME = `my-pwa-cache-${CACHE_VERSION}`;
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './manifest.json',
  './offline.html'
];

// Установка SW и кэширование ресурсов
self.addEventListener('install', event => {
  console.log('[SW] Install');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[SW] Кэш открыт');
        return cache.addAll(urlsToCache);
      })
      .catch(error => {
        console.error('[SW] Ошибка кэширования:', error);
      })
  );
  self.skipWaiting();
});

// Активация и очистка старого кэша
self.addEventListener('activate', event => {
  console.log('[SW] Activate');
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('[SW] Удаление старого кэша:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Перехват запросов
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        if (response) {
          return response;
        }
        return fetch(event.request);
      })
  );
});