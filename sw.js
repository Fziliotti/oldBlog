---
layout: null
---

const staticCacheName = 'fabricio-ziliotti-{{ site.time | date: "%Y-%m-%d-%H-%M" }}';;

const filesToCache = [
'assets/js/main.js',
'assets/css/main.css',
];

// EVENTO INSTALL É ATIVADO SOMENTE UMA VEZ, QUE É QUANDO A VERSAO DO SW É REGISTRADA
this.addEventListener("install", event => {
  this.skipWaiting();

  event.waitUntil(
    caches.open(staticCacheName)
      .then(cache => {
        return cache.addAll(filesToCache);
    })
  )
});

// Clear cache on activate
this.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => (cacheName.startsWith('fabricio-ziliotti-')))
          .filter(cacheName => (cacheName !== staticCacheName))
          .map(cacheName => caches.delete(cacheName))
      );
    })
  );
});

// EVENTO FETCH É ATIVADO TODA VEZ QUE UMA PAGINA É REQUISITADA
this.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
      .catch(() => {
        return caches.match('/offline.html');
      })
  )
});