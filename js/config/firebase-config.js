// ==========================================
// 🔧 FIREBASE CONFIG / APP CONFIG
// ==========================================

(function bootstrapAppNamespace() {
    if (!window.App) {
        window.App = {};
    }

    window.App.config = window.App.config || {};
    window.App.services = window.App.services || {};
    window.App.state = window.App.state || {};
    window.App.ui = window.App.ui || {};
    window.App.flags = window.App.flags || {};
    window.App.timers = window.App.timers || {};
    window.App.helpers = window.App.helpers || {};
})();

const App = window.App;

// Konfiguracja Firebase
const firebaseConfig = {
    apiKey: "AIzaSyDCg9gIaAG-dgf45R76ovT22fBSY0-eR98",
    authDomain: "smart-plan-air.firebaseapp.com",
    projectId: "smart-plan-air",
    storageBucket: "smart-plan-air.firebasestorage.app",
    messagingSenderId: "571923275689",
    appId: "1:571923275689:web:ed975c8aaa0ce4392f6eb8"
};

// UID adminów / starosty
const ADMIN_UIDS = [
    "tnVRAgmiTfepreJlzTk3wR3L6w72"
];

// Jedna spójna wersja aplikacji
const APP_VERSION = "5.2.2-PRO-FIX";

// Inicjalizacja Firebase
if (!firebase.apps || firebase.apps.length === 0) {
    firebase.initializeApp(firebaseConfig);
}

const db = firebase.firestore();
const auth = firebase.auth();

// Zapis do nowego namespace
App.config.firebase = firebaseConfig;
App.config.ADMIN_UIDS = [...ADMIN_UIDS];
App.config.APP_VERSION = APP_VERSION;

App.services.db = db;
App.services.auth = auth;

// Stan startowy — bez wymuszania struktury, tylko bezpieczne defaulty
if (typeof App.state.currentLang !== 'string') {
    App.state.currentLang = 'pl';
}

if (!App.state.globalAdminEvents || typeof App.state.globalAdminEvents !== 'object') {
    App.state.globalAdminEvents = { cancelled: {}, exams: {} };
}

if (App.state.scheduleData === undefined) {
    App.state.scheduleData = null;
}

if (App.state.gradesData === undefined) {
    App.state.gradesData = null;
}

if (App.state.currentUser === undefined) {
    App.state.currentUser = null;
}

// Pomocnicze API pod kolejne etapy
App.helpers.getService = function(name) {
    return App.services?.[name] ?? null;
};

App.helpers.getConfig = function(name, fallback = null) {
    return App.config?.[name] ?? fallback;
};

App.helpers.getState = function(name, fallback = null) {
    return App.state?.[name] ?? fallback;
};

App.helpers.setState = function(name, value) {
    App.state[name] = value;
    return value;
};

App.helpers.setFlag = function(name, value = true) {
    App.flags[name] = value;
    return value;
};

App.helpers.getFlag = function(name) {
    return !!App.flags[name];
};

// Zgodność wsteczna — niczego jeszcze nie wycinamy
window.db = db;
window.auth = auth;
window.ADMIN_UIDS = ADMIN_UIDS;
window.APP_VERSION = APP_VERSION;