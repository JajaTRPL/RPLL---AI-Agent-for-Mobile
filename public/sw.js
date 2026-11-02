// Service worker: cache-first untuk aset, agar aplikasi bisa dibuka offline.
// Naikkan CACHE_NAME jika ingin memaksa semua cache lama dibuang.
const CACHE_NAME = "notes-app-v1";
const APP_SHELL = ["./", "./manifest.webmanifest", "./favicon.svg", "./icons/icon-192.png", "./icons/icon-512.png"];

// Ambil daftar aset hasil build (nama file ber-hash) dari index.html
async function precache() {
  const cache = await caches.open(CACHE_NAME);
  await cache.addAll(APP_SHELL);
  const html = await (await cache.match("./")).text();
  const assets = [...html.matchAll(/(?:src|href)="(\.\/assets\/[^"]+)"/g)].map((match) => match[1]);
  await cache.addAll(assets);
}

self.addEventListener("install", (event) => {
  event.waitUntil(precache().then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim()),
  );
});

async function networkFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  try {
    const response = await fetch(request);
    if (response.ok) cache.put("./", response.clone());
    return response;
  } catch {
    return (await cache.match("./")) || Response.error();
  }
}

async function cacheFirst(request) {
  // ignoreVary: script ber-crossorigin mengirim header Origin yang tidak ada saat precache
  const cached = await caches.match(request, { ignoreVary: true });
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(CACHE_NAME);
    cache.put(request, response.clone());
  }
  return response;
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET" || new URL(request.url).origin !== self.location.origin) return;
  // Halaman HTML: coba jaringan dulu agar versi baru terambil, fallback ke cache saat offline
  event.respondWith(request.mode === "navigate" ? networkFirst(request) : cacheFirst(request));
});
