// ==========================================
// 🌍 TŁUMACZENIA / JĘZYK
// ==========================================

let currentLang = localStorage.getItem('smartPlanLang') || 'pl';

function t(key) {
    return TRANSLATIONS[currentLang][key] || key;
}

function t_sub(sub) {
    return currentLang === 'en' ? (SUBJECT_DICT[sub] || sub) : sub;
}

function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');

        if (el.tagName === 'INPUT') {
            el.placeholder = t(key);
        } else {
            el.innerText = t(key);
        }
    });
}

function setLanguage(lang) {
    currentLang = lang;
    localStorage.setItem('smartPlanLang', lang);

    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));

    const activeBtn = document.getElementById(`lang-btn-${lang}`);
    if (activeBtn) {
        activeBtn.classList.add('active');
    }

    applyTranslations();

    if (typeof renderCalendar === 'function') {
        renderCalendar();
    }

    if (typeof updateDashboard === 'function') {
        updateDashboard();
    }
}