const SHELL_CACHE = 'neverstill-shell-v1';
const STATIC_CACHE = 'neverstill-static-v1';

const PRECACHE_URLS = [
  '/',
  '/tools/paperairplane',
  '/tools/paperairplane/pwa',
  '/offline',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== SHELL_CACHE && key !== STATIC_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

function isSameOrigin(request) {
  try {
    return new URL(request.url).origin === self.location.origin;
  } catch {
    return false;
  }
}

function shellCacheKey(url) {
  return url.pathname + url.search;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET' || !isSameOrigin(request)) return;

  const url = new URL(request.url);
  if (url.pathname.startsWith('/api/') || url.pathname === '/sw.js') return;

  if (request.mode === 'navigate') {
    const skipShellCache = url.pathname.startsWith('/account');
    event.respondWith(
      fetch(request)
        .then(async (response) => {
          if (response.ok && !skipShellCache) {
            const copy = response.clone();
            const cache = await caches.open(SHELL_CACHE);
            await cache.put(shellCacheKey(url), copy);
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(shellCacheKey(url), { ignoreVary: true });
          if (cached) return cached;
          const offline = await caches.match('/offline', { ignoreVary: true });
          return offline ?? Response.error();
        }),
    );
    return;
  }

  if (
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/icons/') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(
      caches.match(request, { ignoreVary: true }).then(
        (cached) =>
          cached ??
          fetch(request)
            .then(async (response) => {
              if (response.ok) {
                const copy = response.clone();
                const cache = await caches.open(STATIC_CACHE);
                await cache.put(request, copy);
              }
              return response;
            })
            .catch(() => Response.error()),
      ),
    );
  }
});
