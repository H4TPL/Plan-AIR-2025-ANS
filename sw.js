const cacheName = 'smart-plan-v6-auth-fix';
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
        cacheNames.filter(name => name !== cacheName).map(name => caches.delete(name))
    );
    return self.clients.claim();
});

self.addEventListener('fetch', async e => {
    const req = e.request;
    const url = new URL(req.url);

    // 🚨 KLUCZOWA POPRAWKA: Ignoruj zapytania POST (Firebase Auth) oraz API Google.
    // Dzięki temu okienko logowania nie jest ucinane przez pamięć podręczną (Cache).
    if (req.method !== 'GET' || url.hostname.includes('googleapis.com') || url.hostname.includes('securetoken')) {
        return; // Przeglądarka obsłuży to żądanie natywnie, omijając Service Workera
    }

    if (url.origin === location.origin) { 
        e.respondWith(cacheFirst(req)); 
    } else if (
        url.hostname.includes('cdnjs.cloudflare.com') ||
        url.hostname.includes('gstatic.com') ||
        url.hostname.includes('flaticon.com') ||
        url.hostname.includes('ui-avatars.com')
    ) {
        e.respondWith(networkAndCache(req)); 
    } else {
        e.respondWith(fetch(req).catch(() => console.log('Brak sieci dla zasobu:', req.url)));
    }
});

async function cacheFirst(req) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(req);
    if (cached) return cached;
    try {
        const fresh = await fetch(req);
        await cache.put(req, fresh.clone());
        return fresh;
    } catch (e) { return null; }
}

async function networkAndCache(req) {
    const cache = await caches.open(cacheName);
    try { 
        const fresh = await fetch(req); 
        await cache.put(req, fresh.clone()); 
        return fresh; 
    } catch (e) { 
        return await cache.match(req); 
    }
}
