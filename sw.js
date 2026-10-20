const CACHE_VERSION = 'v4'; // ← МЕНЯЙ ЭТУ ВЕРСИЮ ПРИ КАЖДОМ ОБНОВЛЕНИИ
const CACHE_NAME = `portfolio-card-${CACHE_VERSION}`;

// ВАЖНО: Здесь должны быть только те файлы, которые реально существуют в твоем проекте
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',       // Исправлено: было styles.css
  '/script.js',
  '/manifest.json',
  '/offline.html'     // Добавлено для корректной работы офлайн-режима
];

// Установка
self.addEventListener('install', event => {
  self.skipWaiting(); // ← Активируем новый SW сразу
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

// Активация - удаляем старые кэши
self.addEventListener('activate', event => {
  event.waitUntil(
    Promise.all([
      // Забираем контроль над всеми вкладками сразу
      clients.claim(),
      // Удаляем старые версии кэша
      caches.keys().then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
    ])
  );
});

// Обработка запросов - сеть первая, потом кэш
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // Если запрос успешен, обновляем кэш
        if (response.status === 200) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, responseClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Если сеть недоступна, берем из кэша (или offline.html для навигации)
        if (event.request.mode === 'navigate') {
          return caches.match('/offline.html');
        }
        return caches.match(event.request);
      })
  );
});