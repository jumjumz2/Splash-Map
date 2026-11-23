const V = 'splash-v1';
const SHELL = ['./', 'index.html', 'style.css', 'data.js', 'store.js', 'map.js', 'views.js', 'main.js',
  'extras.js', 'pwa.js', 'manifest.json', 'icon-192.png', 'icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => Promise.all(SHELL.map(u => c.add(u).catch(() => {})))));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== V).map(k => caches.delete(k)))));
  self.clients.claim();
});

async function trim(cache, max) {
  const keys = await cache.keys();
  if (keys.length > max) await cache.delete(keys[0]);
}

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET') return;
  const u = new URL(r.url);

  // Map tiles: cache first, so places you've viewed work offline
  if (u.hostname.endsWith('tile.openstreetmap.org') || u.hostname.endsWith('arcgisonline.com')) {
    e.respondWith(caches.open('tiles').then(async c => {
      const hit = await c.match(r);
      if (hit) return hit;
      try { const res = await fetch(r); c.put(r, res.clone()); trim(c, 500); return res; }
      catch (err) { return hit || Response.error(); }
    }));
    return;
  }

  // App files and libraries: show cached copy fast, refresh in background
  if (u.origin === location.origin || u.hostname === 'cdnjs.cloudflare.com') {
    e.respondWith(caches.open(V).then(async c => {
      const hit = await c.match(r, { ignoreSearch: true });
      const net = fetch(r).then(res => { if (res.ok) c.put(r, res.clone()); return res; }).catch(() => hit);
      return hit || net;
    }));
  }
});
