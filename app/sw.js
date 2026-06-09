/* Hexa Sport - Service Worker
   Permette all'app di aprirsi anche senza connessione.
   Strategia:
   - all'installazione mette in cache il "guscio" dell'app (index.html, manifest, icone)
   - le richieste di navigazione: prima la rete, se manca usa la copia in cache
   - gli altri file (script CDN, font): prima la cache, poi la rete (e li memorizza)
   - le chiamate a Firebase/Firestore NON vengono intercettate (servono in tempo reale)
*/
var CACHE = 'hexa-sport-v3';
var CORE = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico',
  './pwa_icons/favicon-hexa.png',
  './pwa_icons/icon-32.png',
  './pwa_icons/icon-152.png',
  './pwa_icons/icon-167.png',
  './pwa_icons/icon-180.png',
  './pwa_icons/icon-192.png',
  './pwa_icons/icon-512.png',
  './pwa_icons/icon-1024.png'
];

self.addEventListener('install', function (e) {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // .add per ogni file singolarmente: se uno manca, non blocca gli altri
      return Promise.all(CORE.map(function (u) {
        return c.add(u).catch(function () {});
      }));
    })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE) return caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;

  var href = req.url;
  // Non intercettare le chiamate ai servizi Firebase/Google (servono la rete viva)
  if (/firestore\.googleapis|firebaseio|firebaseinstallations|identitytoolkit|securetoken|google-analytics|googletagmanager/.test(href)) {
    return;
  }

  // Navigazione (apertura pagina): prima la rete, fallback alla cache
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        var copy = res.clone();
        caches.open(CACHE).then(function (c) { c.put('./index.html', copy); });
        return res;
      }).catch(function () {
        return caches.match('./index.html').then(function (hit) {
          return hit || caches.match('./');
        });
      })
    );
    return;
  }

  // Altri file: prima la cache, poi la rete (e memorizza per la prossima volta)
  e.respondWith(
    caches.match(req).then(function (hit) {
      if (hit) return hit;
      return fetch(req).then(function (res) {
        if (res && (res.status === 200 || res.type === 'opaque')) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () { return hit; });
    })
  );
});
