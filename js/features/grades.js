// ==========================================
// 🎓 OCENY / ŚREDNIA
// bez inline eventów i bez surowego innerHTML dla danych
// ==========================================

function normalizeGradesInput(value) {
    let text = safeText(value)
        .replace(/[^0-9.,;\s]/g, '')
        .replace(/\s+/g, ' ')
        .trim();

    return text.slice(0, 120);
}

function getSubjectsFromSchedule() {
    const subjects = new Set();

    ['TN', 'TP'].forEach(w => {
        for (let d = 0; d < 5; d++) {
            (scheduleData[w][d] || []).forEach(cls => {
                const rawName = safeText(cls.subject);
                const cleanName = rawName.replace(/ \(wyk\.\)|\.\.\./g, '').trim();

                if (cleanName) {
                    subjects.add(cleanName);
                }
            });
        }
    });

    return Array.from(subjects).sort((a, b) => a.localeCompare(b, 'pl'));
}

function calculateAverage(str) {
    if (!str) return 0;

    const nums = safeText(str)
        .replace(/,/g, '.')
        .split(/[\s;]+/)
        .map(Number)
        .filter(n => !isNaN(n) && n >= 2 && n <= 5);

    if (nums.length === 0) return 0;

    const sum = nums.reduce((a, b) => a + b, 0);
    return sum / nums.length;
}

function getAverageColor(avg) {
    if (avg >= 3) return 'var(--success)';
    if (avg > 0) return 'var(--danger)';
    return 'var(--text-muted)';
}

function updateGrade(sub, val) {
    const subject = safeText(sub).trim();
    if (!subject) return;

    gradesData[subject] = normalizeGradesInput(val);
    saveGrades();
}

function createGradesEmptyState() {
    return createElement('div', {
        className: 'empty-gif-container',
        children: [
            createElement('img', {
                attrs: {
                    src: 'https://media.giphy.com/media/3o7TKTDn976rzVgky4/giphy.gif',
                    alt: 'No grades'
                }
            }),
            createElement('p', {
                text: t('gradesEmpty')
            })
        ]
    });
}

function createGradeCard(subject) {
    if (!gradesData[subject]) gradesData[subject] = '';

    const gradesStr = safeText(gradesData[subject]);
    const avg = calculateAverage(gradesStr);
    const avgColor = getAverageColor(avg);

    const card = createElement('div', {
        className: 'grade-card',
        cssText: `
            background: var(--bg-color);
            padding: 12px;
            border-radius: 10px;
            margin-bottom: 10px;
            border-left: 4px solid ${avgColor};
        `
    });

    const title = createElement('div', {
        cssText: `
            font-weight: bold;
            font-size: 0.95rem;
            margin-bottom: 8px;
            color: var(--text-main);
        `,
        text: t_sub(subject)
    });

    const wrapper = createElement('div', {
        className: 'grade-input-wrapper'
    });

    const input = createElement('input', {
        className: 'js-grade-input',
        type: 'text',
        placeholder: t('gradesEmpty'),
        value: gradesStr,
        dataset: {
            subject
        },
        attrs: {
            autocomplete: 'off',
            spellcheck: 'false'
        },
        cssText: `
            flex: 1;
            padding: 8px 12px;
            border-radius: 6px;
            border: 1px solid var(--toggle-bg);
            background: var(--card-bg);
            color: var(--text-main);
            font-size: 0.9rem;
            outline: none;
        `
    });

    const avgBox = createElement('div', {
        className: 'js-grade-avg',
        dataset: {
            subject
        },
        cssText: `
            font-weight: 900;
            color: ${avgColor};
            font-size: 1.2rem;
            min-width: 45px;
            text-align: center;
        `,
        text: avg > 0 ? avg.toFixed(2) : '-'
    });

    wrapper.appendChild(input);
    wrapper.appendChild(avgBox);

    card.appendChild(title);
    card.appendChild(wrapper);

    return card;
}

function renderGradesList() {
    const list = document.getElementById('grades-list');
    if (!list) return;

    clearElement(list);

    const subjects = getSubjectsFromSchedule();

    if (subjects.length === 0) {
        list.appendChild(createGradesEmptyState());
        return;
    }

    const fragment = document.createDocumentFragment();

    subjects.forEach(subject => {
        fragment.appendChild(createGradeCard(subject));
    });

    list.appendChild(fragment);
}

function refreshGradePreview(inputEl) {
    if (!inputEl) return;

    const subject = safeText(inputEl.dataset.subject).trim();
    if (!subject) return;

    const cleaned = normalizeGradesInput(inputEl.value);

    if (inputEl.value !== cleaned) {
        inputEl.value = cleaned;
    }

    const avg = calculateAverage(cleaned);
    const avgEl = document.querySelector(`.js-grade-avg[data-subject="${CSS.escape(subject)}"]`);
    const cardEl = inputEl.closest('.grade-card');
    const color = getAverageColor(avg);

    if (avgEl) {
        avgEl.textContent = avg > 0 ? avg.toFixed(2) : '-';
        avgEl.style.color = color;
    }

    if (cardEl) {
        cardEl.style.borderLeftColor = color;
    }
}

function openGradesModal() {
    toggleSidebar();
    renderGradesList();

    const modal = document.getElementById('gradesModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function initGradesDelegation() {
    if (window.__gradesDelegationInitialized) return;
    window.__gradesDelegationInitialized = true;

    document.addEventListener('input', e => {
        const input = e.target.closest('.js-grade-input');
        if (!input) return;

        refreshGradePreview(input);
    });

    document.addEventListener('change', e => {
        const input = e.target.closest('.js-grade-input');
        if (!input) return;

        const subject = safeText(input.dataset.subject).trim();
        if (!subject) return;

        const cleaned = normalizeGradesInput(input.value);
        input.value = cleaned;

        updateGrade(subject, cleaned);
        refreshGradePreview(input);
    });

    document.addEventListener('focusout', e => {
        const input = e.target.closest('.js-grade-input');
        if (!input) return;

        const subject = safeText(input.dataset.subject).trim();
        if (!subject) return;

        const cleaned = normalizeGradesInput(input.value);
        input.value = cleaned;

        updateGrade(subject, cleaned);
        refreshGradePreview(input);
    });
}

initGradesDelegation();