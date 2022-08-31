const CACHE_NAME = "version-1";
const urlsToCache = ["index.html", "offline.html"];

const self = this;
//install sw
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("open cache", cache);
      return cache.addAll(urlsToCache);
    })
  );
});

//listen for requests
//only works in ./githabit/path
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(async () => {
      return fetch(event.request).catch(() => caches.match("offline.html"));
    })
  );
});

//activate sw
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [];
  cacheWhitelist.push(CACHE_NAME);

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log({ cacheNames });
      return Promise.all(
        cacheNames
          .filter((cacheName) => !cacheWhitelist.includes(cacheName))
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
});
