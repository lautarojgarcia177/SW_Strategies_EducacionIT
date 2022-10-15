importScripts('./resources/js/sw/cache-strategies.js');

const CACHE_INMUTABLE_NOMBRE='cache-inmutable--v1';
const CACHE_ESTATICO_NOMBRE='cache-estatico--v1';
const CACHE_DINAMICO_NOMBRE='cache-dinamico--v1';
const CACHE_INMUTABLE_ARCHIVOS=[
  '/lib/css/icons.css',
  '/lib/css/material.indigo-pink.min.css',
  '/lib/js/handlebars.min.js',
  '/lib/js/material.min.js',
];
const CACHE_ESTATICO_ARCHIVOS=[
  '/',
  '/index.html',
  '/resources/css/estilos.css',
  '/resources/js/main.js',
  '/manifest.json',
  '/resources/images/icons/icon-72x72.png',
  '/resources/images/icons/icon-96x96.png',
  '/resources/images/icons/icon-128x128.png',
  '/resources/images/icons/icon-144x144.png',
  '/resources/images/icons/icon-152x152.png',
  '/resources/images/icons/icon-192x192.png',
  '/resources/images/icons/icon-384x384.png',
  '/resources/images/icons/icon-512x512.png',
];

function createCache(cacheName,cacheFiles) {
  return caches.open(cacheName).then(openedCache => openedCache.addAll(cacheFiles));
}

self.addEventListener("install",(e) => {
  const cachesPromise=Promise.all([
    createCache(CACHE_INMUTABLE_NOMBRE,CACHE_INMUTABLE_ARCHIVOS),
    createCache(CACHE_ESTATICO_NOMBRE,CACHE_ESTATICO_ARCHIVOS),
  ]);
  e.waitUntil(cachesPromise);
});

self.addEventListener("activate",(e) => {
  const activatePromise=clients.claim()
    .then(caches.keys()
      .then(cacheKeys => {
        if(cacheKeys.includes(CACHE_DINAMICO_NOMBRE)) {
          return caches.delete(CACHE_DINAMICO_NOMBRE);
        }
      }));
  e.waitUntil(activatePromise);
});

self.addEventListener("fetch",(e) => {
  // e.respondWith(cacheFirst(e.request));
  // e.respondWith(networkFirst(e.request));
  e.respondWith(staleWhileRevalidate(e.request));
});