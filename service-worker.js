const CACHE_NAME = 'weather-app-v2';
const urlsToCache = [
  '',
  'index.html',
  'offline.html',
  'weather.js',
  'clock.js',
  'tranSchedule.js',
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

  console.log(url);
  

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