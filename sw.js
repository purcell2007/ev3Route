/* Service worker básico del Planificador EV3 Tenerife: guarda la app para abrirla sin conexión.
   Súbelo junto a index.html (misma carpeta). Las llamadas a las APIs van siempre por red. */
const CACHE = 'ev3tf-v1';
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(['./'])).catch(() => {})); self.skipWaiting(); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x))))); self.clients.claim(); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url);
  if (e.request.method !== 'GET') return;
  const shell = u.origin === location.origin, lib = u.hostname === 'cdnjs.cloudflare.com';
  if (!shell && !lib) return;                       // APIs y teselas: red directa
  e.respondWith(fetch(e.request).then(r => { const cp = r.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); return r; })
    .catch(() => caches.match(e.request).then(m => m || caches.match('./'))));
});
