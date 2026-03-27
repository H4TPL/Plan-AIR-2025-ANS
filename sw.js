const cacheName = 'smart-plan-v7-auth-safe';
const staticAssets = [
    './',
    './index.html',
    './style.css',
    './app.js',
    './manifest.json'
];

self.addEventListener('install', async e => {
    const cache = await caches.open(cacheName);
    await cache.addAll(staticAssets);
    return self.skipWaiting();
});

self.addEventListener('activate', async e => {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames
            .filter(name => name !== cacheName)
            .map(name => caches.delete(name))
    );
    return self.clients.claim();
});

self.addEventListener('fetch', e => {
    const req = e.request;
    const url = new URL(req.url);

    // NIE przechwytuj żądań nie-GET
    if (req.method !== 'GET') {
        return;
    }

    // KLUCZOWA POPRAWKA:
    // NIE cache'uj niczego związanego z Firebase Auth / Google Sign-In
    // bo to rozwala redirect i utrzymanie sesji po powrocie z logowania
    if (
        url.pathname.startsWith('/__/auth') ||
        url.hostname.includes('googleapis.com') ||
        url.hostname.includes('securetoken.googleapis.com') ||
        url.hostname.includes('accounts.google.com') ||
        url.hostname.includes('apis.google.com') ||
        url.hostname.includes('firebaseapp.com')
    ) {
        return;
    }

    if (url.origin === location.origin) {
        e.respondWith(cacheFirst(req));
        return;
    }

    if (
        url.hostname.includes('cdnjs.cloudflare.com') ||
        url.hostname.includes('gstatic.com') ||
        url.hostname.includes('flaticon.com') ||
        url.hostname.includes('ui-avatars.com')
    ) {
        e.respondWith(networkAndCache(req));
        return;
    }

    e.respondWith(
        fetch(req).catch(() => {
            console.log('Brak sieci dla zasobu:', req.url);
            return caches.match(req);
        })
    );
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);

    if (cached) {
        return cached;
    }

    try {
        const fresh = await fetch(req);

        if (fresh && fresh.ok) {
            await cache.put(req, fresh.clone());
        }

        return fresh;
    } catch (e) {
        return null;
    }
}

async function networkAndCache(req) {
    const cache = await caches.open(cacheName);

    try {
        const fresh = await fetch(req);

        if (fresh && fresh.ok) {
            await cache.put(req, fresh.clone());
        }

        return fresh;
    } catch (e) {
        const cached = await cache.match(req);
        return cached || null;
    }
}
