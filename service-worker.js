const CACHE_NAME = 'weather-app-v3';
const urlsToCache = [
  '/homeDashboard/',
  '/homeDashboard/index.html',
  '/homeDashboard/offline.html',
  '/homeDashboard/weather.js',
  '/homeDashboard/clock.js',
  '/homeDashboard/tramSchedule.js',
  '/homeDashboard/manifest.json',
  '/homeDashboard/images/icon-192x192.png',
  '/homeDashboard/images/icon-512x512.png',
  '/homeDashboard/favicon.ico'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('install', event => {
  event.waitUntil(
      caches.open(CACHE_NAME)
          .then(cache => cache.addAll(STATIC_ASSETS))
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  if (url.origin === location.origin) {
      event.respondWith(cacheFirst(req));
  } else {
      event.respondWith(networkFirst(req));
  }
});

async function cacheFirst(req) {
  const cachedResponse = await caches.match(req);
  return cachedResponse || fetch(req);
}

async function networkFirst(req) {
  try {
      const networkResponse = await fetch(req);
      return networkResponse;
  } catch (error) {
      console.log('Fetch failed; returning offline page instead.', error);
      const cachedResponse = await caches.match(req);
      return cachedResponse || caches.match('/offline.html');
  }
}