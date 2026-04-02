// ==========================================
// 📊 DASHBOARD / STATYSTYKI / PRESENCE
// lżejsze odświeżanie i mniej zbędnych zapisów
// ==========================================

let dashboardCache = {
    minuteKey: null,
    dayKey: null,
    nextClass: null,
    timeToNextMins: Infinity,
    specialDay: null,
    semPercent: 0,
    countdownAlertShownFor: null
};

let presenceUpdateInFlight = false;
let lastPresenceUpdateDay = null;

function calculateGlobalStats() {
    let allGrades = [];

    Object.values(gradesData || {}).forEach(str => {
        const safe = safeText(str).trim();
        if (!safe) return;

        const nums = safe
            .replace(/,/g, '.')
            .split(/[\s;]+/)
            .map(Number)
            .filter(n => !isNaN(n) && n >= 2 && n <= 5);

        allGrades = allGrades.concat(nums);
    });

    const avg = allGrades.length > 0
        ? (allGrades.reduce((a, b) => a + b, 0) / allGrades.length).toFixed(2)
        : '-';

    let totalAtt = 0;
    let totalAbs = 0;

    ['TN', 'TP'].forEach(w => {
        for (let d = 0; d < 5; d++) {
            (scheduleData?.[w]?.[d] || []).forEach(cls => {
                totalAtt += Array.isArray(cls.attendedDates) ? cls.attendedDates.length : 0;
                totalAbs += Array.isArray(cls.absentDates) ? cls.absentDates.length : 0;
            });
        }
    });

    const att = (totalAtt + totalAbs) > 0
        ? `${Math.round((totalAtt / (totalAtt + totalAbs)) * 100)}%`
        : '-';

    return { avg, att };
}

function updateStatsBanner(stats, streak = null) {
    const banner = document.getElementById('global-stats-banner');
    const avgEl = document.getElementById('dash-avg');
    const attEl = document.getElementById('dash-att');
    const streakEl = document.getElementById('dash-streak');

    if (banner) {
        banner.style.display = auth?.currentUser ? 'flex' : 'none';
    }

    if (avgEl) {
        setSafeText(avgEl, stats?.avg ?? '-');
    }

    if (attEl) {
        setSafeText(attEl, stats?.att ?? '-');
    }

    if (streakEl && streak !== null && streak !== undefined) {
        setSafeText(streakEl, streak);
    }
}

function parseDashboardTimeToMinutes(timeStr) {
    const safe = safeText(timeStr).trim();
    const [h, m] = safe.split(':').map(Number);

    if (!Number.isFinite(h) || !Number.isFinite(m)) return 0;
    return h * 60 + m;
}

function getNextClassWidgetBackground() {
    const body = document.body;

    if (body.classList.contains('theme-cad')) {
        return 'linear-gradient(135deg, #1473e6, #0d5fc2)';
    }

    if (body.classList.contains('theme-matrix')) {
        return 'linear-gradient(135deg, #00ff66, #00cc52)';
    }

    if (body.classList.contains('theme-dark')) {
        return 'linear-gradient(135deg, #6366f1, #818cf8)';
    }

    if (body.classList.contains('theme-uwu')) {
        return 'linear-gradient(135deg, #ff66b2, #ff3399)';
    }

    if (body.classList.contains('theme-ans')) {
        return 'linear-gradient(135deg, #006633, #004d26)';
    }

    return 'linear-gradient(135deg, var(--primary, #4f46e5), var(--primary-hover, #6366f1))';
}

function updateSemesterProgress(now) {
    const semesterBar = document.getElementById('semester-bar');
    const semesterText = document.getElementById('semester-text');

    let semPercent = ((now.getTime() - semesterStart) / (semesterEnd - semesterStart)) * 100;
    if (semPercent < 0) semPercent = 0;
    if (semPercent > 100) semPercent = 100;

    dashboardCache.semPercent = semPercent;

    if (semesterBar) {
        semesterBar.style.width = `${semPercent.toFixed(1)}%`;
    }

    if (semesterText) {
        setSafeText(semesterText, `${t('sem')}: ${semPercent.toFixed(1)}%`);
    }
}

function computeNextClassState(now) {
    const todayStr = formatDateStr(now);
    const currentMins = now.getHours() * 60 + now.getMinutes();
    const weekType = getWeekTypeForDate(now);
    const currentDayIndex = now.getDay() - 1;
    const specialDay = checkSpecialDay(todayStr);

    let nextClass = null;
    let timeToNextMins = Infinity;

    if (!specialDay && weekType !== 'INNY' && currentDayIndex >= 0 && currentDayIndex <= 4) {
        const todaysClasses = (scheduleData?.[weekType]?.[currentDayIndex] || [])
            .map((cls, idx) => ({ ...cls, origIdx: idx }))
            .sort((a, b) => safeText(a.start).localeCompare(safeText(b.start)));

        for (const cls of todaysClasses) {
            if (Array.isArray(cls.specificDates) && cls.specificDates.length > 0 && !cls.specificDates.includes(todayStr)) {
                continue;
            }

            const cardId = `${weekType}-${currentDayIndex}-${cls.origIdx}`;
            const isCancelledLocal = Array.isArray(cls.cancelledDates) && cls.cancelledDates.includes(todayStr);
            const globalCancelledDates = getGlobalDates('cancelled', cardId);
            const isCancelledGlobal = globalCancelledDates.includes(todayStr);

            if (isCancelledLocal || isCancelledGlobal) {
                continue;
            }

            const startMin = parseDashboardTimeToMinutes(cls.start);

            if (startMin > currentMins) {
                nextClass = cls;
                timeToNextMins = startMin - currentMins;
                break;
            }
        }
    }

    dashboardCache.dayKey = todayStr;
    dashboardCache.specialDay = specialDay;
    dashboardCache.nextClass = nextClass;
    dashboardCache.timeToNextMins = timeToNextMins;
}

function maybeShowMuteAlert(timeToNextMins, currentSecs, todayStr) {
    if (!(timeToNextMins === 2 && currentSecs === 0)) return;

    const alertKey = `${todayStr}-2min`;
    if (dashboardCache.countdownAlertShownFor === alertKey) return;

    dashboardCache.countdownAlertShownFor = alertKey;

    const muteOverlay = document.getElementById('mute-alert-overlay');
    if (muteOverlay) {
        muteOverlay.style.display = 'flex';
    }

    if ('vibrate' in navigator) {
        navigator.vibrate([500, 200, 500, 200, 500]);
    }
}

function renderNextClassWidget(now) {
    const todayStr = formatDateStr(now);
    const currentSecs = now.getSeconds();

    const w = document.getElementById('next-class-widget');
    const wSub = document.getElementById('widget-subtitle');
    const wText = document.getElementById('next-class-text');
    const wIcon = document.getElementById('widget-icon');
    const tCont = document.getElementById('widget-timer-container');
    const tText = document.getElementById('countdown-timer');

    if (!w || !wSub || !wText || !wIcon || !tCont || !tText) return;

    const specialDay = dashboardCache.specialDay;
    const nextClass = dashboardCache.nextClass;
    const timeToNextMins = dashboardCache.timeToNextMins;

    if (specialDay) {
        w.style.display = 'flex';
        tCont.style.display = 'none';
        w.style.background = specialDay.type === 'WOLNE' ? 'var(--primary)' : 'var(--danger)';
        wIcon.className = specialDay.type === 'WOLNE' ? 'fas fa-umbrella-beach' : 'fas fa-book-reader';
        setSafeText(wSub, t('today'));
        setSafeText(wText, safeText(specialDay.title));
        return;
    }

    if (!nextClass) {
        w.style.display = 'none';
        return;
    }

    w.style.display = 'flex';
    tCont.style.display = 'block';
    w.style.background = getNextClassWidgetBackground();
    wIcon.className = 'fas fa-rocket';

    setSafeText(wSub, t('nextClass'));
    setSafeText(wText, `${t_sub(nextClass.subject)} (${safeText(nextClass.room).trim() || 'Brak'})`);

    let hrs = Math.floor(timeToNextMins / 60);
    let mins = timeToNextMins % 60;
    let secs = 59 - currentSecs;

    if (secs === 59) {
        const shifted = Math.max(timeToNextMins - 1, 0);
        hrs = Math.floor(shifted / 60);
        mins = shifted % 60;
    }

    if (hrs < 0) hrs = 0;
    if (mins < 0) mins = 0;
    if (secs < 0) secs = 0;

    setSafeText(
        tText,
        `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    );

    maybeShowMuteAlert(timeToNextMins, currentSecs, todayStr);
}

function updateDashboard(forceHeavy = false) {
    const now = new Date();
    const minuteKey = `${formatDateStr(now)} ${now.getHours()}:${now.getMinutes()}`;

    updateSemesterProgress(now);

    if (forceHeavy || dashboardCache.minuteKey !== minuteKey) {
        dashboardCache.minuteKey = minuteKey;
        computeNextClassState(now);
    }

    renderNextClassWidget(now);
}

function updateUserPresence(force = false) {
    if (!auth.currentUser || presenceUpdateInFlight) return;

    const uid = auth.currentUser.uid;
    const now = new Date();
    const todayStr = formatDateStr(now);

    if (!force && lastPresenceUpdateDay === todayStr) {
        const stats = calculateGlobalStats();
        updateStatsBanner(stats);
        return;
    }

    presenceUpdateInFlight = true;

    const stats = calculateGlobalStats();
    updateStatsBanner(stats);

    db.collection('users').doc(uid).get()
        .then(doc => {
            const data = doc.exists ? (doc.data() || {}) : {};
            const lastActive = safeText(data.lastActive);
            let streak = Number(data.streak) || 0;

            if (lastActive !== todayStr) {
                const yesterday = new Date();
                yesterday.setDate(yesterday.getDate() - 1);

                if (lastActive === formatDateStr(yesterday)) {
                    streak += 1;
                } else {
                    streak = 1;
                }
            }

            const safeName = getUserDisplayName(auth.currentUser);
            const safePhoto = sanitizeImageUrl(auth.currentUser.photoURL || '', '');

            return db.collection('users').doc(uid).set({
                displayName: safeName,
                photoURL: safePhoto,
                lastActive: todayStr,
                timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                streak,
                globalAvg: stats.avg,
                globalAtt: stats.att
            }, { merge: true }).then(() => streak);
        })
        .then(streak => {
            lastPresenceUpdateDay = todayStr;
            updateStatsBanner(stats, streak);
        })
        .catch(e => {
            console.error('Presence error:', e);
        })
        .finally(() => {
            presenceUpdateInFlight = false;
        });
}