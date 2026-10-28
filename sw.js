var CACHE = 'wsampel-20261028-155018';
var FILES = ['manifest.webmanifest', 'icons/apple-touch-icon.png', 'icons/icon-192.png', 'icons/icon-512.png', 'icons/icon-maskable-512.png', 'favicon.ico'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(FILES); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== CACHE; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (e.request.method !== 'GET' || u.origin !== self.location.origin) return;
  var isPage = e.request.mode === 'navigate' || /\/(index\.html)?$/.test(u.pathname);
  // pages: always fresh from network (bypass HTTP cache); cached copy only when offline
  var req = isPage ? new Request(u.origin + u.pathname, { cache: 'no-store' }) : e.request;
  e.respondWith(fetch(req).then(function (r) {
    if (r.ok) { var c = r.clone(); caches.open(CACHE).then(function (ca) { ca.put(isPage ? 'index.html' : e.request, c); }); }
    return r;
  }).catch(function () { return caches.match(isPage ? 'index.html' : e.request, { ignoreSearch: true }); }));
});
