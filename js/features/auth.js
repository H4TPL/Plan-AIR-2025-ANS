// ==========================================
// 🔐 AUTH / CLOUD SYNC / GLOBAL STATE
// ==========================================

const authApp = window.App || {};
authApp.state = authApp.state || {};
authApp.services = authApp.services || {};
authApp.config = authApp.config || {};

function getAuthService() {
    return authApp.services?.auth || auth;
}

function getDbService() {
    return authApp.services?.db || db;
}

function getAdminUids() {
    return authApp.config?.ADMIN_UIDS || ADMIN_UIDS || [];
}

function syncPlanStateFromCloud(nextValue) {
    if (typeof ensureScheduleDataStructure === 'function') {
        scheduleData = ensureScheduleDataStructure(nextValue);
    } else {
        scheduleData = nextValue;
    }

    authApp.state.scheduleData = scheduleData;
    return scheduleData;
}

function syncGradesStateFromCloud(nextValue) {
    gradesData = nextValue && typeof nextValue === 'object' ? nextValue : {};
    authApp.state.gradesData = gradesData;
    return gradesData;
}

subscribeToGlobalAdminEvents({
    onChange: () => {
        if (typeof renderCalendar === 'function') renderCalendar();
        if (typeof updateDashboard === 'function') updateDashboard();
    }
});

function getUserDisplayName(user) {
    if (!user) return 'Student';

    const displayName = safeText(user.displayName).trim();
    if (displayName) {
        return displayName.split(' ')[0];
    }

    const email = safeText(user.email).trim();
    if (email.includes('@')) {
        return email.split('@')[0];
    }

    return 'Student';
}

function getUserAvatarUrl(user) {
    const safePhoto = sanitizeImageUrl(user?.photoURL || '', '');
    if (safePhoto) return safePhoto;

    const safeName = getUserDisplayName(user);
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(safeName)}&background=random`;
}

function setLoggedInUI(user) {
    const loginText = document.getElementById('login-text');
    const loginIcon = document.getElementById('login-icon');
    const adminBtn = document.getElementById('admin-panel-btn');
    const globalStatsBanner = document.getElementById('global-stats-banner');

    const safeName = getUserDisplayName(user);
    const safeAvatar = getUserAvatarUrl(user);

    if (loginText) {
        loginText.removeAttribute('data-i18n');
        setSafeText(loginText, safeName);
    }

    if (loginIcon) {
        clearElement(loginIcon);
        loginIcon.className = '';
        loginIcon.style.color = '';

        const avatar = createElement('img', {
            attrs: {
                src: safeAvatar,
                alt: 'Avatar użytkownika'
            },
            cssText: 'width: 26px; height: 26px; border-radius: 50%; object-fit: cover; box-shadow: 0 2px 5px rgba(0,0,0,0.2);'
        });

        loginIcon.appendChild(avatar);
    }

    if (adminBtn) {
        adminBtn.style.display = getAdminUids().includes(user.uid) ? 'flex' : 'none';
    }

    if (globalStatsBanner) {
        globalStatsBanner.style.display = 'flex';
    }
}

function setLoggedOutUI() {
    const loginText = document.getElementById('login-text');
    const loginIcon = document.getElementById('login-icon');
    const adminBtn = document.getElementById('admin-panel-btn');
    const globalStatsBanner = document.getElementById('global-stats-banner');

    if (loginText) {
        loginText.setAttribute('data-i18n', 'login');
        setSafeText(loginText, t('login'));
    }

    if (loginIcon) {
        clearElement(loginIcon);
        loginIcon.className = 'fab fa-google';
        loginIcon.style.color = '#4285F4';
    }

    if (adminBtn) {
        adminBtn.style.display = 'none';
    }

    if (globalStatsBanner) {
        globalStatsBanner.style.display = 'none';
    }
}

function parseStoredCloudValue(value, label) {
    if (value === null || value === undefined) return null;

    if (typeof value === 'string') {
        try {
            return JSON.parse(value);
        } catch (e) {
            console.warn(`Błąd parsowania ${label}:`, e);
            return null;
        }
    }

    if (typeof value === 'object') {
        return value;
    }

    return null;
}

async function loadCloudDataForUser(user) {
    const dbService = getDbService();
    if (!dbService) return;

    const userRef = dbService.collection('users').doc(user.uid);
    const privateRef = userRef.collection('private').doc('main');

    try {
        const [rootSnap, privateSnap] = await Promise.all([
            userRef.get(),
            privateRef.get()
        ]);

        const rootData = rootSnap.exists ? rootSnap.data() || {} : {};
        const privateData = privateSnap.exists ? privateSnap.data() || {} : {};

        let planToLoad = parseStoredCloudValue(privateData.plan, 'planu z sejfu');
        let gradesToLoad = parseStoredCloudValue(privateData.grades, 'ocen z sejfu');

        let migratedPlan = null;
        let migratedGrades = null;
        let needsMigration = false;

        if (!planToLoad && rootData.plan) {
            migratedPlan = parseStoredCloudValue(rootData.plan, 'starego planu');
            if (migratedPlan) {
                planToLoad = migratedPlan;
                needsMigration = true;
            }
        }

        if (!gradesToLoad && rootData.grades) {
            migratedGrades = parseStoredCloudValue(rootData.grades, 'starych ocen');
            if (migratedGrades) {
                gradesToLoad = migratedGrades;
                needsMigration = true;
            }
        }

        if (needsMigration) {
            const payload = {};
            if (migratedPlan) payload.plan = migratedPlan;
            if (migratedGrades) payload.grades = migratedGrades;

            if (Object.keys(payload).length > 0) {
                await privateRef.set(payload, { merge: true });
            }

            userRef.update({
                plan: firebase.firestore.FieldValue.delete(),
                grades: firebase.firestore.FieldValue.delete()
            }).catch(() => {
                console.log('Stare pola usunięte lub dokument nie wymagał sprzątania.');
            });
        }

        if (planToLoad) {
            syncPlanStateFromCloud(planToLoad);
            localStorage.setItem('smartPlanData', JSON.stringify(scheduleData));
        }

        if (gradesToLoad && typeof gradesToLoad === 'object') {
            syncGradesStateFromCloud(gradesToLoad);
            localStorage.setItem('smartPlanGrades', JSON.stringify(gradesData));
        }

        if (typeof renderCalendar === 'function') renderCalendar();
        if (typeof updateDashboard === 'function') updateDashboard();

    } catch (e) {
        console.error('Błąd ładowania danych z chmury:', e);
    }
}

async function handleRedirectResultSilently() {
    const authService = getAuthService();
    if (!authService) return;

    try {
        const result = await authService.getRedirectResult();
        if (result && result.user) {
            console.log('Sukces logowania redirect:', result.user.email);
        }
    } catch (error) {
        console.error('Błąd po powrocie z redirect login:', error);
    }
}

handleRedirectResultSilently();

function loginForSync() {
    const authService = getAuthService();
    if (!authService) return;

    const provider = new firebase.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });

    authService.setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(() => authService.signInWithPopup(provider))
        .then(result => {
            if (result?.user) {
                console.log('Zalogowano:', result.user.email);
            }
        })
        .catch(error => {
            console.error('Błąd logowania:', error);

            if (
                error.code === 'auth/popup-blocked' ||
                error.code === 'auth/popup-closed-by-user' ||
                error.code === 'auth/cancelled-popup-request'
            ) {
                console.log('Popup zablokowany lub przerwany → fallback do redirect');
                authService.signInWithRedirect(provider);
                return;
            }

            alert(
                'Błąd logowania:\n' +
                safeText(error.code) + '\n' +
                safeText(error.message)
            );
        });
}

getAuthService()?.onAuthStateChanged(async user => {
    authApp.state.currentUser = user || null;
    authApp.state.isAdmin = !!(user && getAdminUids().includes(user.uid));

    if (user) {
        setLoggedInUI(user);
        await loadCloudDataForUser(user);

        if (typeof updateUserPresence === 'function') {
            updateUserPresence();
        }
    } else {
        setLoggedOutUI();
    }
});