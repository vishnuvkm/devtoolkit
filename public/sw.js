const CACHE_VERSION = "v1";
const CACHE_NAME = `devtools-kit-${CACHE_VERSION}`;

// On install: activate immediately without waiting for old SW to unload
self.addEventListener("install", () => {
  self.skipWaiting();
});

// On activate: delete old caches and claim all open clients
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key))
        )
      )
      .then(() => self.clients.claim())
  );
});

// Fetch: stale-while-revalidate for same-origin requests
self.addEventListener("fetch", (event) => {
  const { request } = event;

  // Only cache GET requests to the same origin
  if (
    request.method !== "GET" ||
    !request.url.startsWith(self.location.origin)
  ) {
    return;
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      const cached = await cache.match(request);

      const fetchPromise = fetch(request)
        .then((response) => {
          // Cache successful responses (HTML, JS, CSS, fonts, images)
          if (response.ok) {
            cache.put(request, response.clone());
          }
          return response;
        })
        .catch(() => {
          // Network failed — return cached version if available
          return cached ?? Response.error();
        });

      // Return cached immediately if available, update cache in background
      return cached ?? fetchPromise;
    })
  );
});
