// ==========================================
// 🌍 GLOBAL EVENTS / ADMIN REQUESTS SERVICE
// centralizacja global_state + admin_requests
// ==========================================

const globalEventsApp = window.App || {};
globalEventsApp.state = globalEventsApp.state || {};
globalEventsApp.services = globalEventsApp.services || {};
globalEventsApp.config = globalEventsApp.config || {};
globalEventsApp.helpers = globalEventsApp.helpers || {};
globalEventsApp.flags = globalEventsApp.flags || {};

let globalEventsUnsubscribe = null;

function getGlobalEventsDb() {
    return globalEventsApp.services?.db || window.db || null;
}

function getGlobalEventsAuth() {
    return globalEventsApp.services?.auth || window.auth || null;
}

function getGlobalAdminUids() {
    return globalEventsApp.config?.ADMIN_UIDS || window.ADMIN_UIDS || [];
}

function currentUserIsAdmin(user = null) {
    const authService = getGlobalEventsAuth();
    const targetUser = user || authService?.currentUser || null;
    return !!(targetUser && getGlobalAdminUids().includes(targetUser.uid));
}

function normalizeGlobalAdminEvents(data) {
    const normalized = data && typeof data === 'object' ? { ...data } : {};

    if (!normalized.cancelled || typeof normalized.cancelled !== 'object') {
        normalized.cancelled = {};
    }

    if (!normalized.exams || typeof normalized.exams !== 'object') {
        normalized.exams = {};
    }

    return normalized;
}

function syncGlobalAdminEventsState(nextValue) {
    const normalized = normalizeGlobalAdminEvents(nextValue);
    globalEventsApp.state.globalAdminEvents = normalized;
    window.globalAdminEvents = normalized; // zgodność wsteczna
    return normalized;
}

function getGlobalAdminEventsState() {
    return normalizeGlobalAdminEvents(
        globalEventsApp.state?.globalAdminEvents || window.globalAdminEvents || {}
    );
}

function buildGlobalCardId(weekType, dayIndex, classIndex) {
    return `${safeText(weekType).trim()}-${Number(dayIndex)}-${Number(classIndex)}`;
}

function getGlobalDatesMap(type) {
    const safeType = safeText(type).trim();
    const state = getGlobalAdminEventsState();

    if (safeType === 'cancelled') return state.cancelled || {};
    if (safeType === 'exams') return state.exams || {};

    return {};
}

function getGlobalDates(type, cardId) {
    const safeCardId = safeText(cardId).trim();
    if (!safeCardId) return [];

    const map = getGlobalDatesMap(type);
    const arr = map[safeCardId];

    return Array.isArray(arr) ? [...arr] : [];
}

function buildMergedDates(existingDates, dateStr, shouldInclude) {
    const safeDateStr = safeText(dateStr).trim();
    const current = Array.isArray(existingDates) ? [...existingDates] : [];

    if (!safeDateStr) return current;

    if (shouldInclude) {
        if (!current.includes(safeDateStr)) {
            current.push(safeDateStr);
        }
    } else {
        return current.filter(x => x !== safeDateStr);
    }

    return current;
}

async function writeGlobalDatesMap(type, nextMap) {
    const dbService = getGlobalEventsDb();
    if (!dbService) {
        throw new Error('Brak połączenia z bazą Firestore.');
    }

    const safeType = safeText(type).trim() === 'cancelled' ? 'cancelled' : 'exams';
    const safeMap = nextMap && typeof nextMap === 'object' ? nextMap : {};

    const currentState = getGlobalAdminEventsState();
    const nextState = {
        ...currentState,
        [safeType]: safeMap
    };

    // optymistycznie aktualizujemy stan lokalny
    syncGlobalAdminEventsState(nextState);

    await dbService.collection('global_state').doc('events').set({
        [safeType]: safeMap
    }, { merge: true });

    return safeMap;
}

async function setGlobalDateIncluded(type, cardId, dateStr, shouldInclude = true) {
    const safeType = safeText(type).trim() === 'cancelled' ? 'cancelled' : 'exams';
    const safeCardId = safeText(cardId).trim();
    const safeDateStr = safeText(dateStr).trim();

    if (!safeCardId || !safeDateStr) {
        throw new Error('Brak cardId lub dateStr.');
    }

    const currentMap = getGlobalDatesMap(safeType);
    const currentDates = Array.isArray(currentMap[safeCardId]) ? currentMap[safeCardId] : [];
    const nextDates = buildMergedDates(currentDates, safeDateStr, shouldInclude);

    const nextMap = {
        ...currentMap,
        [safeCardId]: nextDates
    };

    return writeGlobalDatesMap(safeType, nextMap);
}

async function toggleGlobalDate(type, cardId, dateStr) {
    const safeType = safeText(type).trim() === 'cancelled' ? 'cancelled' : 'exams';
    const currentDates = getGlobalDates(safeType, cardId);
    const shouldInclude = !currentDates.includes(safeText(dateStr).trim());

    return setGlobalDateIncluded(safeType, cardId, dateStr, shouldInclude);
}

async function submitAdminRequest({
    type,
    cardId,
    dateStr,
    subject,
    requester,
    uid
}) {
    const dbService = getGlobalEventsDb();
    if (!dbService) {
        throw new Error('Brak połączenia z bazą Firestore.');
    }

    const safeType = safeText(type).trim();
    const safeCardId = safeText(cardId).trim();
    const safeDateStr = safeText(dateStr).trim();
    const safeSubject = safeText(subject).trim();
    const safeRequester = safeText(requester).trim();
    const safeUid = safeText(uid).trim();

    if (!['cancel', 'exam'].includes(safeType)) {
        throw new Error('Nieprawidłowy typ wniosku.');
    }

    if (!safeCardId || !safeDateStr || !safeSubject || !safeRequester || !safeUid) {
        throw new Error('Brak wymaganych danych wniosku.');
    }

    return dbService.collection('admin_requests').add({
        type: safeType,
        cardId: safeCardId,
        dateStr: safeDateStr,
        subject: safeSubject,
        requester: safeRequester,
        uid: safeUid,
        status: 'pending',
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });
}

async function setAdminRequestStatus(reqId, status) {
    const dbService = getGlobalEventsDb();
    if (!dbService) {
        throw new Error('Brak połączenia z bazą Firestore.');
    }

    const safeReqId = safeText(reqId).trim();
    const safeStatus = safeText(status).trim();

    if (!safeReqId) {
        throw new Error('Brak reqId.');
    }

    if (!['approved', 'rejected', 'pending'].includes(safeStatus)) {
        throw new Error('Nieprawidłowy status wniosku.');
    }

    return dbService.collection('admin_requests').doc(safeReqId).update({
        status: safeStatus
    });
}

function subscribeToGlobalAdminEvents(options = {}) {
    if (typeof globalEventsUnsubscribe === 'function') {
        return globalEventsUnsubscribe;
    }

    const dbService = getGlobalEventsDb();
    if (!dbService) {
        console.warn('Brak db podczas subscribeToGlobalAdminEvents().');
        return null;
    }

    const onChange = typeof options.onChange === 'function' ? options.onChange : null;
    const onError = typeof options.onError === 'function' ? options.onError : null;

    globalEventsUnsubscribe = dbService.collection('global_state').doc('events').onSnapshot(
        doc => {
            syncGlobalAdminEventsState(doc.exists ? doc.data() : {});
            if (onChange) onChange(getGlobalAdminEventsState());
        },
        error => {
            console.error('Błąd nasłuchu global_state/events:', error);
            syncGlobalAdminEventsState({ cancelled: {}, exams: {} });
            if (onError) onError(error);
        }
    );

    return globalEventsUnsubscribe;
}

// startowy default, żeby inne pliki miały od razu poprawną strukturę
if (!window.globalAdminEvents || typeof window.globalAdminEvents !== 'object') {
    syncGlobalAdminEventsState({ cancelled: {}, exams: {} });
} else {
    syncGlobalAdminEventsState(window.globalAdminEvents);
}