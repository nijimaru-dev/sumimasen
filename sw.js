const CACHE = 'sumimasen-v4';

/* Relative to the service worker's location (site root) so the app works
   on a project sub-path (/sumimasen/) today and a root domain after migration. */
const PRECACHE = [
  './',
  'phrases/',
  'articles/',
  'articles/how-to-call-waiter/',
  'articles/konbini/',
  'articles/train/',
  'articles/toilet/',
  'articles/manners/',
  'articles/food-guide/',
  'areas/',
  'areas/asakusa/',
  'areas/shibuya/',
  'areas/iruma/',
  'tools/jr-pass-calculator/',
  'tools/exchange-rate/',
  'tools/emergency-contacts/',
  'tools/itinerary/',
  'about/',
  'privacy-policy/',
  'terms-of-use/',
  'affiliate-disclosure/',
  'css/style.css',
  'js/main.js',
  'manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(res => {
        const clone = res.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return res;
      });
    })
  );
});
