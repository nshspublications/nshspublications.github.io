const vHeader = "Alpha_Release";

const vPublic = 0; //update for major releases
const vSubPublic = 0; //update for publicly important releases
const vOvernight = 0; //update for minor releases
const vPrivate = 1; //update for debug changes

const vRevision = 0; //update for emergency branch changes

const VERSION = "v."+vHeader+"."+vPublic+"."+vSubPublic+"."+vOvernight+"."+vPrivate+".R"+vRevision;

console.log("Cache Update", VERSION);

const APP_STATIC_RESOURCES = [
  "./",
  "./index.html",
  "./style.css",
  "./main.js",
  "./wakelock.js",
  "./512.png",
  "./manifest.json",
  "./lcalipers2.js",
  "./kernel.js",
  "./initramfs.js",
];

const CACHE_NAME = `HNet-DOS-Project-${VERSION}`;

console.log("Cache Name", CACHE_NAME);

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      cache.addAll(APP_STATIC_RESOURCES);
    })(),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const names = await caches.keys();
      await Promise.all(
        names.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
          return undefined;
        }),
      );
      await clients.claim();
    })(),
  );
});

/*self.addEventListener("fetch", (event) => {
  // when seeking an HTML page
  if (event.request.mode === "navigate") {
    // Return to the index.html page
    event.respondWith(caches.match("./"));
    return;
  }

  // For every other request type
  event.respondWith(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      const cachedResponse = await cache.match(event.request.url);
      if (cachedResponse) {
        // Return the cached response if it's available.
        return cachedResponse;
      }
      // Respond with a HTTP 404 response status.
      return new Response(null, { status: 404 });
    })(),
  );
});*/

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        // Optional: Update the cache with the new network response here
        return networkResponse;
      })
      .catch(() => {
        // If the network request fails (e.g., offline), fall back to the cache
        return caches.match(event.request);
      })
  );
}); //experimental code
