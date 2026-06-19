/* NÓDULO PWA service worker — cache v7 (rede-primeiro) */
const CACHE = "nodulo-v7";
const ASSETS = ["./index.html","./manifest.webmanifest","./icon-192.png","./icon-512.png"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  e.waitUntil(caches.keys().then((keys) =>
    Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener("fetch", (e) => {
  const url = new URL(e.request.url);
  if (url.hostname.includes("jsdelivr") || url.hostname.includes("unpkg")) return; // libs externas: direto
  if (e.request.mode === "navigate") {
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put("./index.html",cp)).catch(()=>{});return r;}).catch(()=>caches.match("./index.html")));
    return;
  }
  if (url.origin === location.origin) {
    e.respondWith(fetch(e.request).then(r=>{const cp=r.clone();caches.open(CACHE).then(c=>c.put(e.request,cp)).catch(()=>{});return r;}).catch(()=>caches.match(e.request).then(m=>m||caches.match("./index.html"))));
    return;
  }
});
