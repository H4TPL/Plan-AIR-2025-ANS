// ==========================================
// 🎯 RADAR KOLOKWIÓW
// bez inline eventów i bez surowego innerHTML dla danych
// ==========================================

function getRadarExamColor(days) {
    if (days <= 3) return 'var(--danger)';
    if (days <= 7) return '#f59e0b';
    return 'var(--primary)';
}

function collectUpcomingExams() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    const examsFound = [];

    ['TN', 'TP'].forEach(week => {
        for (let d = 0; d < 5; d++) {
            (scheduleData[week][d] || []).forEach((cls, classIndex) => {
                const cardId = `${week}-${d}-${classIndex}`;
                const allExams = new Set([...(cls.exams || [])]);
                const globalExams = getGlobalDates('exams', cardId);

                globalExams.forEach(ex => allExams.add(ex));

                allExams.forEach(examDateStr => {
                    const exDate = new Date(examDateStr);
                    exDate.setHours(0, 0, 0, 0);

                    if (isNaN(exDate.getTime())) return;
                    if (exDate < now) return;

                    const diffDays = Math.ceil(
                        (exDate - now) / (1000 * 60 * 60 * 24)
                    );

                    const isGlobal = globalExams.includes(examDateStr);

                    examsFound.push({
                        w: week,
                        d,
                        cIdx: classIndex,
                        subject: safeText(cls.subject),
                        date: safeText(examDateStr),
                        days: diffDays,
                        isGlobal
                    });
                });
            });
        }
    });

    examsFound.sort((a, b) => a.days - b.days);

    return examsFound;
}

function createRadarEmptyState() {
    return createElement('div', {
        className: 'empty-gif-container',
        children: [
            createElement('img', {
                attrs: {
                    src: 'https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif',
                    alt: 'Relax'
                }
            }),
            createElement('p', {
                text: t('radarEmpty')
            })
        ]
    });
}

function createRadarAdminBadge() {
    const badge = createElement('span', {
        cssText: 'color:#8b5cf6; font-size:0.7rem; margin-left:5px; display:inline-flex; align-items:center; gap:4px;'
    });

    const icon = createElement('i', {
        className: 'fas fa-globe'
    });

    const label = document.createTextNode(' ADMIN');

    badge.appendChild(icon);
    badge.appendChild(label);

    return badge;
}

function createRadarExamItem(exam) {
    const color = getRadarExamColor(exam.days);

    const wrapper = createElement('div', {
        className: 'radar-exam-item',
        cssText: `
            background: var(--bg-color);
            border-left: 4px solid ${color};
            padding: 12px;
            border-radius: 8px;
            margin-bottom: 10px;
        `
    });

    const header = createElement('div', {
        cssText: `
            font-weight: bold;
            font-size: 0.95rem;
            margin-bottom: 5px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
        `
    });

    const titleWrap = createElement('span', {
        cssText: 'display:flex; align-items:center; flex-wrap:wrap; min-width:0;'
    });

    const subjectText = createElement('span', {
        text: t_sub(exam.subject)
    });

    titleWrap.appendChild(subjectText);

    if (exam.isGlobal) {
        titleWrap.appendChild(createRadarAdminBadge());
    }

    const removeBtn = createElement('button', {
        className: 'btn-icon js-radar-remove-exam',
        type: 'button',
        dataset: {
            week: exam.w,
            day: exam.d,
            classIndex: exam.cIdx,
            date: exam.date
        },
        attrs: {
            'aria-label': 'Usuń kolokwium'
        },
        cssText: `
            color: var(--danger);
            padding: 0;
            width: 24px;
            height: 24px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: none;
            flex-shrink: 0;
        `
    });

    removeBtn.appendChild(createElement('i', {
        className: 'fas fa-times'
    }));

    header.appendChild(titleWrap);
    header.appendChild(removeBtn);

    const meta = createElement('div', {
        cssText: `
            font-size: 0.85rem;
            color: var(--text-muted);
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            flex-wrap: wrap;
        `
    });

    const dateInfo = createElement('span', {
        cssText: 'display:inline-flex; align-items:center; gap:6px;'
    });
    dateInfo.appendChild(createElement('i', {
        className: 'far fa-calendar-alt'
    }));
    dateInfo.appendChild(document.createTextNode(` ${exam.date}`));

    const daysBadge = createElement('span', {
        cssText: `
            color: ${color};
            font-weight: 900;
            background: rgba(0,0,0,0.05);
            padding: 3px 8px;
            border-radius: 6px;
        `,
        text: exam.days === 0 ? 'DZISIAJ!' : `${exam.days} dni`
    });

    meta.appendChild(dateInfo);
    meta.appendChild(daysBadge);

    wrapper.appendChild(header);
    wrapper.appendChild(meta);

    return wrapper;
}

function openRadar() {
    toggleSidebar();

    const radarList = document.getElementById('radar-list');
    if (!radarList) return;

    clearElement(radarList);

    const examsFound = collectUpcomingExams();

    if (examsFound.length === 0) {
        radarList.appendChild(createRadarEmptyState());
    } else {
        const fragment = document.createDocumentFragment();

        examsFound.forEach(exam => {
            fragment.appendChild(createRadarExamItem(exam));
        });

        radarList.appendChild(fragment);
    }

    const modal = document.getElementById('radarModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function initRadarDelegation() {
    if (window.__radarDelegationInitialized) return;
    window.__radarDelegationInitialized = true;

    document.addEventListener('click', e => {
        const btn = e.target.closest('.js-radar-remove-exam');
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();

        markExam(
            btn.dataset.week,
            Number(btn.dataset.day),
            Number(btn.dataset.classIndex),
            btn.dataset.date
        );

        setTimeout(openRadar, 300);
    });
}

initRadarDelegation();