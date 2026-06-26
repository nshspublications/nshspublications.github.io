const vHeader = "Alpha_Release";

const vPublic = 0; //update for major releases
const vSubPublic = 0; //update for publicly important releases
const vOvernight = 0; //update for minor releases
const vPrivate = 0; //update for debug changes

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
  "./fslib.js",
  "./tools.js",
  "./debug.js",
  "./deviceinit.js",
  "./notifications.js",
  "./bios.js",
  "./basicprograms.js",
  "./gsnicreader.js",
  "./info_gsnic.json",
  "./recoverycache.js",
  "./kframe.js",
  "./magekernel.js",
  "./fdm.js",
  "./fhload.js",
  "./websafetyhandler.js",
  "./gpdbbs.js",


  "./reference-legacy-employment_portal.html",

  //test files
  "./audcmdspec.on", 
  "./thalorin",
  "./Ivan.src.echx",
  "./plans.txt",
];

const CACHE_NAME = `iclOS-${VERSION}`;

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

/*self.addEventListener('fetch', (event) => {
  console.log(event);
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
});*/ //experimental code

self.addEventListener('fetch', (event) => {
  //console.log("[sw] fetch event (.request):", event.request);//debug

  const url = new URL(event.request.url);
  /*
  // Ignore Service Worker cache if there are URLSearchParams
  if (url.search.length > 0) {
    console.log("[sw] nzevreq", event.request);
    event.respondWith(fetch(event.request));
    return;
  }*/

  event.respondWith(
    (async () => {
        try {
          // 1. Try to fetch from the network first
          const networkResponse = await fetch(event.request);
          // const cache = await caches.open(API_CACHE);
          // await cache.put(event.request, networkResponse.clone());
          return networkResponse;
        } catch (error) {
          // 2. If offline, strip query params to find the base page in the cache
          const url = new URL(event.request.url);
          url.search = ''; // Strips all parameters (e.g., ?id=123)
          
          const cachedResponse = await caches.match(url);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // 3. Fallback to an offline fallback page if even the base isn't cached
          return caches.match(event.request); //HIGHLY EXPERIMENTAL CODE !!! !!!
        }
      })()
  );
});

async function findInCacheWithoutParams(cache, request) {
  const requests = await cache.keys();
  
  // Find a cached request that matches the pathname (ignoring ?foo=bar)
  const foundRequest = requests.find(cachedReq => {
    const reqUrl = new URL(cachedReq.url);
    const originalUrl = new URL(request.url);
    return reqUrl.pathname === originalUrl.pathname;
  });

  return foundRequest ? cache.match(foundRequest) : undefined;
}

// reference for the above
/*
const API_CACHE = 'api-cache-v1';

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Intercept ONLY your base API requests
  if (url.pathname.startsWith('/api/v1/')) {
    event.respondWith(
      (async () => {
        try {
          // 1. Try the network first
          const networkResponse = await fetch(event.request);
          
          // 2. Cache the successful response for offline/fallback
          const cache = await caches.open(API_CACHE);
          await cache.put(event.request, networkResponse.clone());
          
          return networkResponse;
        } catch (error) {
          // 3. Network failed: Fallback to the cache
          const cache = await caches.open(API_CACHE);
          
          // CRITICAL: Strip query params to find the cached equivalent
          const cachedResponse = await findInCacheWithoutParams(cache, event.request);
          
          return cachedResponse || Promise.reject(error);
        }
      })()
    );
  }
});
*/

/*self.addEventListener('fetch', (event) => {
  // Only intercept page navigations
  if (event.request.mode === 'navigate') {
    event.respondWith(
      (async () => {
        try {
          // 1. Try to fetch from the network first
          return await fetch(event.request);
        } catch (error) {
          // 2. If offline, strip query params to find the base page in the cache
          const url = new URL(event.request.url);
          url.search = ''; // Strips all parameters (e.g., ?id=123)
          
          const cachedResponse = await caches.match(url);
          if (cachedResponse) {
            return cachedResponse;
          }
          
          // 3. Fallback to an offline fallback page if even the base isn't cached
          return caches.match('/offline.html');
        }
      })()
    );
  }
});*/