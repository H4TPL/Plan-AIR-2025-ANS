// ==========================================
// 💾 STORAGE / ŁADOWANIE / ZAPIS
// ==========================================

const LOCAL_PLAN_KEY = 'smartPlanData';
const LOCAL_GRADES_KEY = 'smartPlanGrades';

const storageApp = window.App || {};
storageApp.state = storageApp.state || {};
storageApp.services = storageApp.services || {};
storageApp.helpers = storageApp.helpers || {};

let scheduleData = loadInitialScheduleData();
let gradesData = loadInitialGradesData();

let privateCloudSaveTimer = null;
let pendingPrivateCloudPayload = {};

syncScheduleState(scheduleData);
syncGradesState(gradesData);

function getStorageAuth() {
    return storageApp.services?.auth || auth;
}

function getStorageDb() {
    return storageApp.services?.db || db;
}

function syncScheduleState(nextValue) {
    scheduleData = ensureScheduleDataStructure(nextValue);
    storageApp.state.scheduleData = scheduleData;
    return scheduleData;
}

function syncGradesState(nextValue) {
    gradesData = isPlainObject(nextValue) ? nextValue : {};
    storageApp.state.gradesData = gradesData;
    return gradesData;
}

storageApp.helpers.syncScheduleState = syncScheduleState;
storageApp.helpers.syncGradesState = syncGradesState;

function deepCloneDefaultData() {
    return JSON.parse(JSON.stringify(defaultData));
}

function isPlainObject(value) {
    return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function normalizeClassObject(cls) {
    if (!isPlainObject(cls)) return null;

    if (!Array.isArray(cls.todo)) cls.todo = [];
    if (!Array.isArray(cls.cancelledDates)) cls.cancelledDates = [];
    if (!Array.isArray(cls.exams)) cls.exams = [];
    if (!Array.isArray(cls.attendedDates)) cls.attendedDates = [];
    if (!Array.isArray(cls.absentDates)) cls.absentDates = [];
    if (!Array.isArray(cls.specificDates)) cls.specificDates = [];
    if (typeof cls.notes !== 'string') cls.notes = '';

    if (typeof cls.start !== 'string') cls.start = '';
    if (typeof cls.end !== 'string') cls.end = '';
    if (typeof cls.subject !== 'string') cls.subject = '';
    if (typeof cls.type !== 'string') cls.type = 'inne';
    if (typeof cls.room !== 'string') cls.room = '';
    if (typeof cls.lecturer !== 'string') cls.lecturer = '';
    if (typeof cls.email !== 'string') cls.email = '';

    return cls;
}

function ensureScheduleDataStructure(data) {
    if (!isPlainObject(data)) {
        return deepCloneDefaultData();
    }

    const normalized = data;

    ['TN', 'TP'].forEach(weekType => {
        if (!isPlainObject(normalized[weekType])) {
            normalized[weekType] = {};
        }

        for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
            if (!Array.isArray(normalized[weekType][dayIndex])) {
                normalized[weekType][dayIndex] = [];
            }

            normalized[weekType][dayIndex] = normalized[weekType][dayIndex]
                .map(normalizeClassObject)
                .filter(Boolean);
        }
    });

    return normalized;
}

function parseLocalJson(key, fallbackValue) {
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return fallbackValue;
        return JSON.parse(raw);
    } catch (error) {
        console.warn(`Błąd odczytu ${key} z localStorage:`, error);
        return fallbackValue;
    }
}

function loadInitialScheduleData() {
    const parsed = parseLocalJson(LOCAL_PLAN_KEY, deepCloneDefaultData());
    return ensureScheduleDataStructure(parsed);
}

function loadInitialGradesData() {
    const parsed = parseLocalJson(LOCAL_GRADES_KEY, {});
    return isPlainObject(parsed) ? parsed : {};
}

function saveLocalPlan() {
    syncScheduleState(scheduleData);
    localStorage.setItem(LOCAL_PLAN_KEY, JSON.stringify(scheduleData));
}

function saveLocalGrades() {
    syncGradesState(gradesData);
    localStorage.setItem(LOCAL_GRADES_KEY, JSON.stringify(gradesData));
}

function getPrivateMainRef() {
    const authService = getStorageAuth();
    const dbService = getStorageDb();

    const uid = authService?.currentUser?.uid;
    if (!uid || !dbService) return null;

    return dbService.collection('users')
        .doc(uid)
        .collection('private')
        .doc('main');
}

function flushPrivateCloudSave() {
    const ref = getPrivateMainRef();
    const payload = pendingPrivateCloudPayload;

    pendingPrivateCloudPayload = {};
    privateCloudSaveTimer = null;

    if (!ref || !payload || Object.keys(payload).length === 0) {
        return;
    }

    ref.set(payload, { merge: true }).catch(error => {
        console.warn('Błąd zapisu do users/{uid}/private/main:', error);
    });
}

function queuePrivateCloudSave(partialPayload) {
    const ref = getPrivateMainRef();
    if (!ref || !isPlainObject(partialPayload)) return;

    pendingPrivateCloudPayload = {
        ...pendingPrivateCloudPayload,
        ...partialPayload
    };

    if (privateCloudSaveTimer) {
        clearTimeout(privateCloudSaveTimer);
    }

    privateCloudSaveTimer = setTimeout(flushPrivateCloudSave, 600);
}

function saveData() {
    syncScheduleState(scheduleData);
    saveLocalPlan();
    queuePrivateCloudSave({ plan: scheduleData });
}

function saveGrades() {
    syncGradesState(gradesData);
    saveLocalGrades();
    queuePrivateCloudSave({ grades: gradesData });
}

function hardResetLocalData() {
    localStorage.removeItem(LOCAL_PLAN_KEY);
    localStorage.removeItem(LOCAL_GRADES_KEY);

    syncScheduleState(deepCloneDefaultData());
    syncGradesState({});

    saveLocalPlan();
    saveLocalGrades();

    if (typeof renderCalendar === 'function') {
        renderCalendar();
    }

    if (typeof updateDashboard === 'function') {
        updateDashboard();
    }
}