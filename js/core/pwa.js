// ==========================================
// 📲 PWA / SERVICE WORKER / AKTUALIZACJA
// ==========================================

let swRegistrationRef = null;
let refreshingFromNewWorker = false;

function showUpdateBanner() {
    const updateBanner = document.getElementById('update-banner');
    if (updateBanner) {
        updateBanner.style.display = 'block';
    }
}

function hideUpdateBanner() {
    const updateBanner = document.getElementById('update-banner');
    if (updateBanner) {
        updateBanner.style.display = 'none';
    }
}

function markCurrentVersionAsAccepted() {
    localStorage.setItem('smartPlanVersion', APP_VERSION);
}

function checkAppVersion() {
    const acceptedVersion = localStorage.getItem('smartPlanVersion');

    if (acceptedVersion === APP_VERSION) {
        hideUpdateBanner();
        return;
    }

    showUpdateBanner();
}

function watchInstallingWorker(worker) {
    if (!worker) return;

    worker.addEventListener('statechange', () => {
        if (worker.state === 'installed' && navigator.serviceWorker.controller) {
            showUpdateBanner();
        }
    });
}

function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return;

    window.addEventListener('load', async () => {
        try {
            const reg = await navigator.serviceWorker.register('./sw.js');
            swRegistrationRef = reg;
            console.log('Service Worker zarejestrowany pomyślnie!', reg);

            if (reg.waiting) {
                showUpdateBanner();
            }

            reg.addEventListener('updatefound', () => {
                watchInstallingWorker(reg.installing);
            });

            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (refreshingFromNewWorker) return;
                refreshingFromNewWorker = true;

                markCurrentVersionAsAccepted();
                window.location.reload();
            });
        } catch (err) {
            console.log('Błąd rejestracji Service Workera:', err);
        }
    });
}

function applyUpdate() {
    markCurrentVersionAsAccepted();

    if (swRegistrationRef?.waiting) {
        swRegistrationRef.waiting.postMessage({ type: 'SKIP_WAITING' });
        return;
    }

    window.location.reload();
}

registerServiceWorker();