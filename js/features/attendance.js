// ==========================================
// 👤 FREKWENCJA
// bez inline onclick i bez surowego innerHTML
// ==========================================

function markAttendance(w, d, c, dateStr, status) {
    const cls = scheduleData?.[w]?.[d]?.[c];
    if (!cls) return;

    if (!Array.isArray(cls.attendedDates)) cls.attendedDates = [];
    if (!Array.isArray(cls.absentDates)) cls.absentDates = [];

    const isPres = cls.attendedDates.includes(dateStr);
    const isAbs = cls.absentDates.includes(dateStr);

    cls.attendedDates = cls.attendedDates.filter(x => x !== dateStr);
    cls.absentDates = cls.absentDates.filter(x => x !== dateStr);

    if (status === 'present' && !isPres) cls.attendedDates.push(dateStr);
    if (status === 'absent' && !isAbs) cls.absentDates.push(dateStr);

    saveData();
    renderCalendar();
    openAttendanceModal();
}

function getPastDatesForClass(weekType, dayIndex, specificDates, cancelledDates, globalCancelled) {
    const pastDates = [];
    const iterDate = new Date(semesterStart);
    const today = new Date();

    today.setHours(23, 59, 59, 999);

    while (iterDate <= today) {
        const dateStr = formatDateStr(iterDate);
        const wt = getWeekTypeForDate(iterDate);
        const dIdx = iterDate.getDay() - 1;

        if (!checkSpecialDay(dateStr) && wt === weekType && dIdx === dayIndex) {
            if (specificDates && specificDates.length > 0 && !specificDates.includes(dateStr)) {
                // pomiń
            } else if (
                (cancelledDates && cancelledDates.includes(dateStr)) ||
                (globalCancelled && globalCancelled.includes(dateStr))
            ) {
                // pomiń
            } else {
                pastDates.push(dateStr);
            }
        }

        iterDate.setDate(iterDate.getDate() + 1);
    }

    return pastDates;
}

function toggleAttendanceDetails(panelId) {
    const panel = document.getElementById(panelId);
    if (!panel) return;

    panel.style.display = panel.style.display === 'block' ? 'none' : 'block';
}

function createAttendanceEmptyState() {
    return createElement('div', {
        cssText: 'text-align:center; color: var(--text-muted); padding: 20px; font-weight: bold;',
        children: [
            createElement('i', {
                className: 'fas fa-info-circle fa-2x',
                cssText: 'margin-bottom:10px; display:block;'
            }),
            createElement('span', {
                text: 'Brak zajęć.'
            })
        ]
    });
}

function createAttendanceStatusButton({ active, status, w, d, cIdx, dateStr }) {
    const btn = createElement('button', {
        type: 'button',
        className: `att-status-btn js-att-mark ${active ? `active ${status}` : ''}`.trim(),
        dataset: {
            week: w,
            day: d,
            classIndex: cIdx,
            date: dateStr,
            status
        }
    });

    btn.appendChild(createElement('i', {
        className: status === 'present' ? 'fas fa-check-circle' : 'fas fa-times-circle'
    }));

    return btn;
}

function createAttendanceDetailRow(classInfo, dateStr) {
    const isPres = classInfo.attended.includes(dateStr);
    const isAbs = classInfo.absent.includes(dateStr);

    const row = createElement('div', {
        className: 'att-detail-row'
    });

    const left = createElement('span');
    left.appendChild(createElement('i', { className: 'far fa-calendar-alt' }));
    left.appendChild(document.createTextNode(` ${dateStr} `));
    left.appendChild(createElement('small', {
        cssText: 'opacity:0.6',
        text: `(${classInfo.typeLabel})`
    }));

    const right = createElement('div', {
        cssText: 'display:flex; gap:10px;'
    });

    right.appendChild(createAttendanceStatusButton({
        active: isPres,
        status: 'present',
        w: classInfo.w,
        d: classInfo.d,
        cIdx: classInfo.cIdx,
        dateStr
    }));

    right.appendChild(createAttendanceStatusButton({
        active: isAbs,
        status: 'absent',
        w: classInfo.w,
        d: classInfo.d,
        cIdx: classInfo.cIdx,
        dateStr
    }));

    row.appendChild(left);
    row.appendChild(right);

    return row;
}

function createAttendanceDetailPanel(panelId, stats) {
    const panel = createElement('div', {
        attrs: { id: panelId },
        cssText: 'display:none; margin-top: 10px; border-top: 1px dashed var(--toggle-bg); padding-top: 10px; animation: fadeIn 0.3s;'
    });

    let hasAnyRows = false;

    stats.classes.forEach(classInfo => {
        const reversedDates = [...classInfo.pastDates].reverse();

        reversedDates.forEach(dateStr => {
            hasAnyRows = true;
            panel.appendChild(createAttendanceDetailRow(classInfo, dateStr));
        });
    });

    if (!hasAnyRows) {
        panel.appendChild(createElement('div', {
            cssText: 'font-size:0.8rem; color:var(--text-muted); text-align:center;',
            text: 'Brak zajęć.'
        }));
    }

    return panel;
}

function createAttendanceCard(subject, stats, panelId) {
    const total = stats.attended + stats.absent;
    const percent = total > 0 ? Math.round((stats.attended / total) * 100) : 0;

    let color = percent >= 50 ? 'var(--success)' : 'var(--danger)';
    if (total === 0) color = 'var(--text-muted)';

    const card = createElement('div', {
        cssText: `
            background: var(--bg-color);
            padding: 12px;
            border-radius: 10px;
            margin-bottom: 10px;
            border-left: 4px solid ${color};
            transition: 0.2s;
        `
    });

    const toggleBtn = createElement('button', {
        type: 'button',
        className: 'js-att-toggle',
        dataset: { panelId },
        cssText: 'width:100%; background:none; border:none; padding:0; text-align:left; font:inherit; cursor:pointer;'
    });

    const header = createElement('div', {
        cssText: 'font-weight: bold; font-size: 0.95rem; margin-bottom: 5px; color: var(--text-main); display: flex; justify-content: space-between; gap: 10px;'
    });

    const titleWrap = createElement('span');
    titleWrap.appendChild(document.createTextNode(t_sub(subject)));
    titleWrap.appendChild(document.createTextNode(' '));
    titleWrap.appendChild(createElement('i', {
        className: 'fas fa-caret-down',
        cssText: 'font-size:0.8rem; margin-left:5px;'
    }));

    const percentWrap = createElement('span', {
        cssText: `color: ${color}; font-weight: 900;`,
        text: total > 0 ? `${percent}%` : '-'
    });

    header.appendChild(titleWrap);
    header.appendChild(percentWrap);
    toggleBtn.appendChild(header);

    const summary = createElement('div', {
        cssText: 'font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px;'
    });
    summary.appendChild(document.createTextNode(`${t('attPres')}: `));
    summary.appendChild(createElement('strong', { text: stats.attended }));
    summary.appendChild(document.createTextNode(' | '));
    summary.appendChild(document.createTextNode(`${t('attAbs')}: `));
    summary.appendChild(createElement('strong', { text: stats.absent }));

    const progressOuter = createElement('div', {
        cssText: 'width: 100%; background: var(--toggle-bg); height: 8px; border-radius: 4px; overflow: hidden;'
    });

    const progressInner = createElement('div', {
        cssText: `height: 100%; background: ${color}; width: ${percent}%; transition: 1s ease-out;`
    });
    progressOuter.appendChild(progressInner);

    card.appendChild(toggleBtn);
    card.appendChild(summary);
    card.appendChild(progressOuter);
    card.appendChild(createAttendanceDetailPanel(panelId, stats));

    return card;
}

function initAttendanceDelegation() {
    if (window.__attendanceDelegationInitialized) return;
    window.__attendanceDelegationInitialized = true;

    document.addEventListener('click', e => {
        const toggleBtn = e.target.closest('.js-att-toggle');
        if (toggleBtn) {
            e.preventDefault();
            toggleAttendanceDetails(toggleBtn.dataset.panelId);
            return;
        }

        const markBtn = e.target.closest('.js-att-mark');
        if (markBtn) {
            e.preventDefault();
            e.stopPropagation();

            markAttendance(
                markBtn.dataset.week,
                Number(markBtn.dataset.day),
                Number(markBtn.dataset.classIndex),
                markBtn.dataset.date,
                markBtn.dataset.status
            );
        }
    });
}

function openAttendanceModal() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar && sidebar.classList.contains('active')) {
        toggleSidebar();
    }

    const list = document.getElementById('attendance-list');
    const modal = document.getElementById('attendanceModal');
    if (!list || !modal) return;

    clearElement(list);

    const attendanceStats = {};

    const typeLabels = {
        wyklad: t('lec'),
        cwiczenia: t('exe'),
        lab: t('lab'),
        projekt: t('proj'),
        seminarium: t('sem_class'),
        inne: t('other')
    };

    ['TN', 'TP'].forEach(w => {
        for (let d = 0; d < 5; d++) {
            (scheduleData?.[w]?.[d] || []).forEach((cls, cIdx) => {
                const name = safeText(cls.subject);
                if (!name) return;

                if (!attendanceStats[name]) {
                    attendanceStats[name] = {
                        attended: 0,
                        absent: 0,
                        classes: []
                    };
                }

                const attendedDates = Array.isArray(cls.attendedDates) ? cls.attendedDates : [];
                const absentDates = Array.isArray(cls.absentDates) ? cls.absentDates : [];
                const specificDates = Array.isArray(cls.specificDates) ? cls.specificDates : [];
                const cancelledDates = Array.isArray(cls.cancelledDates) ? cls.cancelledDates : [];

                attendanceStats[name].attended += attendedDates.length;
                attendanceStats[name].absent += absentDates.length;

                const cardId = `${w}-${d}-${cIdx}`;
                const globalCancelled = getGlobalDates('cancelled', cardId);

                const pastDates = getPastDatesForClass(
                    w,
                    d,
                    specificDates,
                    cancelledDates,
                    globalCancelled
                );

                attendanceStats[name].classes.push({
                    w,
                    d,
                    cIdx,
                    typeLabel: typeLabels[cls.type || 'inne'] || typeLabels.inne,
                    pastDates,
                    attended: attendedDates,
                    absent: absentDates
                });
            });
        }
    });

    const sortedSubjects = Object.keys(attendanceStats).sort((a, b) => a.localeCompare(b, 'pl'));
    let hasData = false;
    let counter = 0;

    const fragment = document.createDocumentFragment();

    sortedSubjects.forEach(subject => {
        const stats = attendanceStats[subject];
        const hasPastDates = stats.classes.some(c => c.pastDates.length > 0);

        if (hasPastDates) {
            hasData = true;
        }

        const panelId = `att-detail-panel-${counter++}`;
        fragment.appendChild(createAttendanceCard(subject, stats, panelId));
    });

    if (!hasData || sortedSubjects.length === 0) {
        list.appendChild(createAttendanceEmptyState());
    } else {
        list.appendChild(fragment);
    }

    modal.style.display = 'flex';
}

initAttendanceDelegation();