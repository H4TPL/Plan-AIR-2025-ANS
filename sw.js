const CACHE_NAME = 'smart-plan-v5-2-2-pro-fix-r3';

const APP_SHELL = [
    './',
    './index.html',
    './style.css',
    './manifest.json',

    './icons/icon-192.svg',
    './icons/icon-512.svg',

    './js/config/firebase-config.js',
    './js/config/semester-config.js',
    './js/config/default-schedule.js',
    './js/config/translations.js',

    './js/core/i18n.js',
    './js/core/date-utils.js',
    './js/core/security.js',
    './js/core/storage.js',
    './js/core/global-events.js',
    './js/core/pwa.js',
    './js/core/dashboard.js',
    './js/core/events.js',

    './js/features/grades.js',
    './js/features/tasks.js',
    './js/features/attendance.js',
    './js/features/radar.js',
    './js/features/theme.js',
    './js/features/export.js',
    './js/features/qr.js',
    './js/features/modals.js',
    './js/features/directory.js',
    './js/features/auth.js',
    './js/features/admin.js',
    './js/features/calendar.js',
    './js/features/chat.js',

    './js/main.js'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_SHELL))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(names => Promise.all(
                names
                    .filter(name => name !== CACHE_NAME)
                    .map(name => caches.delete(name))
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('message', event => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    if (req.method !== 'GET') return;

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

    if (req.mode === 'navigate') {
        event.respondWith(networkFirst(req));
        return;
    }

    if (url.origin === self.location.origin) {
        event.respondWith(staleWhileRevalidate(req));
        return;
    }

    if (
        url.hostname.includes('cdnjs.cloudflare.com') ||
        url.hostname.includes('gstatic.com') ||
        url.hostname.includes('flaticon.com') ||
        url.hostname.includes('ui-avatars.com')
    ) {
        event.respondWith(staleWhileRevalidate(req));
        return;
    }

    event.respondWith(
        fetch(req).catch(() => caches.match(req))
    );
});

async function networkFirst(req) {
    const cache = await caches.open(CACHE_NAME);

    try {
        const fresh = await fetch(req);

        if (fresh && fresh.ok) {
            cache.put(req, fresh.clone());
        }

        return fresh;
    } catch (error) {
        const cached = await cache.match(req);
        if (cached) return cached;

        return caches.match('./index.html');
    }
}

async function staleWhileRevalidate(req) {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(req);

    const networkFetch = fetch(req)
        .then(fresh => {
            if (fresh && fresh.ok) {
                cache.put(req, fresh.clone());
            }
            return fresh;
        })
        .catch(() => null);

    if (cached) {
        networkFetch.catch(() => null);
        return cached;
    }

    const fresh = await networkFetch;
    if (fresh) return fresh;

    return caches.match(req);
}