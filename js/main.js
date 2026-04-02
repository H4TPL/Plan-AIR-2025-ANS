// ==========================================
// 🚀 START APLIKACJI / INICJALIZACJA
// ==========================================

const appMain = window.App || {};
appMain.flags = appMain.flags || {};
appMain.timers = appMain.timers || {};
appMain.state = appMain.state || {};
appMain.services = appMain.services || {};

function getMainAuth() {
    return appMain.services?.auth || auth;
}

function getMainCurrentLang() {
    if (typeof currentLang === 'string' && currentLang.trim()) {
        appMain.state.currentLang = currentLang;
        return currentLang;
    }

    return appMain.state.currentLang || 'pl';
}

function initLanguageButtons() {
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));

    const activeBtn = document.getElementById(`lang-btn-${getMainCurrentLang()}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }
}

function shouldSkipHeavyCalendarRefresh() {
    return document.querySelectorAll('.card-expanded-panel.active').length > 0;
}

function refreshCalendarSafely() {
    if (typeof renderCalendar !== 'function') return;
    if (document.hidden) return;
    if (shouldSkipHeavyCalendarRefresh()) return;

    renderCalendar();

    if (typeof updateDashboard === 'function') {
        updateDashboard(true);
    }
}

function refreshDashboardLight() {
    if (typeof updateDashboard !== 'function') return;
    if (document.hidden) return;

    updateDashboard();
}

function refreshDashboardHeavy() {
    if (typeof updateDashboard !== 'function') return;
    if (document.hidden) return;

    updateDashboard(true);

    const authService = getMainAuth();
    if (typeof updateUserPresence === 'function' && authService?.currentUser) {
        updateUserPresence();
    }
}

function initRecurringRefreshes() {
    if (!appMain.timers.calendarRefreshInterval) {
        appMain.timers.calendarRefreshInterval = setInterval(() => {
            refreshCalendarSafely();
        }, 60000);
    }

    if (!appMain.timers.dashboardLightInterval) {
        appMain.timers.dashboardLightInterval = setInterval(() => {
            refreshDashboardLight();
        }, 1000);
    }

    if (!appMain.timers.dashboardHeavyInterval) {
        appMain.timers.dashboardHeavyInterval = setInterval(() => {
            refreshDashboardHeavy();
        }, 60000);
    }
}

function initVisibilityRefresh() {
    if (appMain.flags.visibilityRefreshInitialized) return;
    appMain.flags.visibilityRefreshInitialized = true;

    document.addEventListener('visibilitychange', () => {
        if (!document.hidden) {
            if (typeof renderCalendar === 'function') {
                renderCalendar();
            }

            if (typeof updateDashboard === 'function') {
                updateDashboard(true);
            }

            const authService = getMainAuth();
            if (typeof updateUserPresence === 'function' && authService?.currentUser) {
                updateUserPresence();
            }
        }
    });

    window.addEventListener('focus', () => {
        if (typeof renderCalendar === 'function') {
            renderCalendar();
        }

        if (typeof updateDashboard === 'function') {
            updateDashboard(true);
        }
    });

    window.addEventListener('pageshow', () => {
        if (typeof renderCalendar === 'function') {
            renderCalendar();
        }

        if (typeof updateDashboard === 'function') {
            updateDashboard(true);
        }
    });
}

function initApp() {
    if (appMain.flags.appInitialized) return;
    appMain.flags.appInitialized = true;

    if (typeof initTheme === 'function') {
        initTheme();
    }

    initLanguageButtons();

    const globalChatWindow = document.getElementById('global-chat-window');
    if (globalChatWindow) {
        globalChatWindow.style.display = 'none';
    }

    if (typeof applyTranslations === 'function') {
        applyTranslations();
    }

    if (typeof initStaticEvents === 'function') {
        initStaticEvents();
    }

    if (typeof initModalCloseEvents === 'function') {
        initModalCloseEvents();
    }

    if (typeof checkAppVersion === 'function') {
        checkAppVersion();
    }

    if (typeof renderCalendar === 'function') {
        renderCalendar();
    }

    if (typeof updateDashboard === 'function') {
        updateDashboard(true);
    }

    const authService = getMainAuth();
    if (typeof updateUserPresence === 'function' && authService?.currentUser) {
        updateUserPresence();
    }

    initRecurringRefreshes();
    initVisibilityRefresh();
}

document.addEventListener('DOMContentLoaded', initApp);