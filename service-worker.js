const CACHE_NAME = 'weather-app-v3';
const urlsToCache = [
  '',
  'index.html',
  'offline.html',
  'weather.js',
  'clock.js',
  'tramSchedule.js',
  'manifest.json',
  'images/icon-192x192.png',
  'images/icon-512x512.png',
  'favicon.ico'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
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
      return cachedResponse || caches.match('offline.html');
  }
}