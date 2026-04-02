// ==========================================
// 📅 KALENDARZ / KARTY ZAJĘĆ / EDYCJA PLANU
// bez surowego innerHTML dla danych użytkownika
// ==========================================

let viewDateStart = getSmartStartMonday();

function getSafeClass(w, d, c) {
    if (!scheduleData || !scheduleData[w] || !scheduleData[w][d] || !scheduleData[w][d][c]) {
        return null;
    }
    return scheduleData[w][d][c];
}

function ensureClassArrays(cls) {
    if (!cls) return;
    if (!Array.isArray(cls.todo)) cls.todo = [];
    if (!Array.isArray(cls.specificDates)) cls.specificDates = [];
    if (!Array.isArray(cls.cancelledDates)) cls.cancelledDates = [];
    if (!Array.isArray(cls.exams)) cls.exams = [];
    if (!Array.isArray(cls.attendedDates)) cls.attendedDates = [];
    if (!Array.isArray(cls.absentDates)) cls.absentDates = [];
}

function parseTimeToMinutes(timeStr) {
    const safe = safeText(timeStr).trim();
    const [h, m] = safe.split(':').map(Number);

    if (!Number.isFinite(h) || !Number.isFinite(m)) return 0;
    return h * 60 + m;
}

function getWeekTypeColorMarker(weekType, specialDay) {
    if (specialDay && specialDay.type === 'WOLNE') return '#3b82f6';
    if (specialDay && specialDay.type === 'SESJA') return '#f59e0b';
    if (weekType === 'TN') return '#3b82f6';
    if (weekType === 'TP') return '#10b981';
    return '#9ca3af';
}

function createEmptyState(imgSrc, altText, message) {
    return createElement('div', {
        className: 'empty-gif-container',
        children: [
            createElement('img', {
                attrs: {
                    src: imgSrc,
                    alt: altText
                }
            }),
            createElement('p', {
                text: message
            })
        ]
    });
}

function createIcon(className) {
    return createElement('i', { className });
}

function createDayTitle(daysNames, index, columnDateObj, todayStr, weekTypeLabel, colorMarker) {
    const columnDateStr = formatDateStr(columnDateObj);

    const title = createElement('div', {
        className: 'day-title',
        cssText: columnDateStr === todayStr
            ? 'background: rgba(79, 70, 229, 0.1); border-radius: 8px;'
            : ''
    });

    title.appendChild(document.createTextNode(daysNames[index]));
    title.appendChild(document.createElement('br'));

    title.appendChild(createElement('span', {
        className: 'date-subtitle',
        text: `${columnDateObj.getDate()}.${columnDateObj.getMonth() + 1}.${columnDateObj.getFullYear()}`
    }));

    title.appendChild(createElement('span', {
        className: 'week-type-indicator',
        cssText: `color: ${colorMarker}; border: 1px solid ${colorMarker};`,
        text: weekTypeLabel
    }));

    return title;
}

function createGapCard(gapMins) {
    const h = Math.floor(gapMins / 60);
    const m = gapMins % 60;

    const text = h > 0 ? `${h}h ${m}m` : `${m}m`;

    const div = createElement('div', {
        className: 'okienko-card'
    });

    div.appendChild(createIcon('fas fa-coffee'));
    div.appendChild(document.createTextNode(` ${t('window')}: ${text}`));

    return div;
}

function createCardHeaderTags(cls, typeLabels, hasExam, hasExamGlobal, weekType, dayIndex, classIndex) {
    const wrap = createElement('div', { className: 'card-header-tags' });

    wrap.appendChild(createElement('span', {
        className: `type-badge tag-${safeText(cls.type || 'inne')}`,
        text: typeLabels[cls.type || 'inne'] || typeLabels.inne
    }));

    if (hasExam) {
        const examBadge = createElement('span', {
            className: hasExamGlobal ? 'kolokwium-global-badge' : 'kolokwium-badge'
        });

        examBadge.appendChild(createIcon(`fas ${hasExamGlobal ? 'fa-globe' : 'fa-exclamation-triangle'}`));
        examBadge.appendChild(document.createTextNode(` ${hasExamGlobal ? t('badgeExamAdmin') : t('badgeExam')}`));

        wrap.appendChild(examBadge);
    }

    const actions = createElement('div', { className: 'card-actions' });

    const editBtn = createElement('button', {
        type: 'button',
        className: 'btn-icon js-edit-class-btn',
        cssText: 'border:1px solid var(--toggle-bg) !important;',
        dataset: {
            week: weekType,
            day: dayIndex,
            classIndex
        },
        attrs: {
            title: 'Edytuj'
        },
        events: {
            click: (e) => {
                e.preventDefault();
                e.stopPropagation();
                editClass(weekType, dayIndex, classIndex);
            }
        }
    });

    editBtn.appendChild(createIcon('fas fa-pencil-alt'));
    actions.appendChild(editBtn);
    wrap.appendChild(actions);

    return wrap;
}

function createClassTimeRow(cls, isOngoing, isCancelled) {
    const row = createElement('div', { className: 'class-time' });

    row.appendChild(createIcon('far fa-clock'));
    row.appendChild(document.createTextNode(` ${safeText(cls.start)} - ${safeText(cls.end)}`));

    if (isOngoing && !isCancelled) {
        row.appendChild(createElement('span', {
            cssText: 'color:var(--success); font-size:0.8rem; margin-left:5px;',
            text: '(Trwa)'
        }));
    }

    return row;
}

function createClassDetails(cls) {
    const details = createElement('div', { className: 'class-details' });

    if (safeText(cls.room).trim()) {
        const roomEl = createElement('span');
        roomEl.appendChild(createIcon('fas fa-map-marker-alt'));
        roomEl.appendChild(document.createTextNode(` ${t('room')}: ${safeText(cls.room)}`));
        details.appendChild(roomEl);
    }

    if (safeText(cls.lecturer).trim()) {
        const lecturerEl = createElement('span');
        lecturerEl.appendChild(createIcon('fas fa-user-tie'));
        lecturerEl.appendChild(document.createTextNode(` ${safeText(cls.lecturer)}`));
        details.appendChild(lecturerEl);
    }

    return details;
}

function createSpecificDatesLabel(cls) {
    if (!Array.isArray(cls.specificDates) || cls.specificDates.length === 0) return null;

    const badge = createElement('span', {
        cssText: 'font-size:0.75rem; color:var(--primary); font-weight:bold; margin-top:3px;'
    });

    badge.appendChild(createIcon('fas fa-calendar-check'));
    badge.appendChild(document.createTextNode(` ${t('specificDates')}`));

    return badge;
}

function createProgressContainer(progressPercent) {
    const container = createElement('div', { className: 'progress-container' });
    const bar = createElement('div', {
        className: 'progress-bar',
        cssText: `width: ${progressPercent}%;`
    });

    container.appendChild(bar);
    return container;
}

function createCardTodoItem(weekType, dayIndex, classIndex, todoIndex, todoItem) {
    const wrapper = createElement('div', {
        className: `todo-item ${todoItem.done ? 'done' : ''}`
    });

    const checkbox = createElement('input', {
        type: 'checkbox',
        className: 'js-card-todo-toggle',
        dataset: {
            week: weekType,
            day: dayIndex,
            classIndex,
            todoIndex
        }
    });
    checkbox.checked = !!todoItem.done;

    const textDiv = createElement('div', {
        className: 'todo-input js-card-todo-text',
        contentEditable: true,
        dataset: {
            week: weekType,
            day: dayIndex,
            classIndex,
            todoIndex
        }
    });
    textDiv.textContent = safeText(todoItem.text, '...');

    const deleteBtn = createElement('button', {
        type: 'button',
        className: 'btn-icon js-card-todo-delete',
        cssText: 'color:var(--danger);',
        dataset: {
            week: weekType,
            day: dayIndex,
            classIndex,
            todoIndex
        }
    });
    deleteBtn.appendChild(createIcon('fas fa-times'));

    wrapper.appendChild(checkbox);
    wrapper.appendChild(textDiv);
    wrapper.appendChild(deleteBtn);

    return wrapper;
}

function createTodoPanel(cardId, weekType, dayIndex, classIndex, cls) {
    const panel = createElement('div', {
        className: 'panel-content active',
        id: `tab-todo-${cardId}`
    });

    const todoList = createElement('div', {
        attrs: { id: `todo-list-${cardId}` }
    });

    (cls.todo || []).forEach((todoItem, todoIndex) => {
        todoList.appendChild(
            createCardTodoItem(weekType, dayIndex, classIndex, todoIndex, todoItem)
        );
    });

    const addBtn = createElement('button', {
        type: 'button',
        className: 'add-todo-btn js-card-add-todo',
        dataset: {
            week: weekType,
            day: dayIndex,
            classIndex
        },
        text: `+ ${t('add')} zadanie`
    });

    panel.appendChild(todoList);
    panel.appendChild(addBtn);

    return panel;
}

function createNotesPanel(cardId, weekType, dayIndex, classIndex, cls) {
    const panel = createElement('div', {
        className: 'panel-content',
        id: `tab-notes-${cardId}`
    });

    const textarea = createElement('textarea', {
        className: 'notes-textarea js-card-note',
        placeholder: '...',
        dataset: {
            week: weekType,
            day: dayIndex,
            classIndex
        }
    });

    textarea.value = safeText(cls.notes);

    panel.appendChild(textarea);
    return panel;
}

function createAttendancePanel(cardId, weekType, dayIndex, classIndex, columnDateStr, hasAttended, hasAbsent, freq, totalAttended, totalAbsent) {
    const panel = createElement('div', {
        className: 'panel-content',
        id: `tab-att-${cardId}`
    });

    const box = createElement('div', {
        cssText: 'text-align: center; padding: 15px; background: var(--bg-color); border-radius: 10px; margin-top: 10px;'
    });

    box.appendChild(createElement('p', {
        cssText: 'font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px; font-weight: bold;',
        text: `Zaznacz w tym dniu (${columnDateStr}):`
    }));

    const buttonsRow = createElement('div', {
        cssText: 'display: flex; gap: 10px; justify-content: center; margin-bottom: 15px; flex-wrap: wrap;'
    });

    const presentBtn = createElement('button', {
        type: 'button',
        className: `btn js-att-mark ${hasAttended ? '' : 'btn-outline'}`.trim(),
        cssText: hasAttended
            ? 'background: var(--success); color: white; border-color: var(--success);'
            : 'border-color: var(--success); color: var(--success);',
        dataset: {
            week: weekType,
            day: dayIndex,
            classIndex,
            date: columnDateStr,
            status: 'present'
        }
    });
    presentBtn.appendChild(createIcon('fas fa-check'));
    presentBtn.appendChild(document.createTextNode(` ${t('attBtnPres')}`));

    const absentBtn = createElement('button', {
        type: 'button',
        className: `btn js-att-mark ${hasAbsent ? '' : 'btn-outline'}`.trim(),
        cssText: hasAbsent
            ? 'background: var(--danger); color: white; border-color: var(--danger);'
            : 'border-color: var(--danger); color: var(--danger);',
        dataset: {
            week: weekType,
            day: dayIndex,
            classIndex,
            date: columnDateStr,
            status: 'absent'
        }
    });
    absentBtn.appendChild(createIcon('fas fa-times'));
    absentBtn.appendChild(document.createTextNode(` ${t('attBtnAbs')}`));

    buttonsRow.appendChild(presentBtn);
    buttonsRow.appendChild(absentBtn);

    const summary = createElement('div', {
        cssText: 'border-top: 1px dashed var(--toggle-bg); padding-top: 10px; font-size: 0.85rem; color: var(--text-muted);'
    });

    const strong = createElement('strong');
    strong.appendChild(document.createTextNode(`${t('attGeneral')}: `));

    strong.appendChild(createElement('span', {
        cssText: `color: ${freq >= 50 ? 'var(--success)' : 'var(--danger)'}; font-size: 1.1rem; font-weight: 900;`,
        text: `${freq}%`
    }));

    const secondLine = createElement('div', {
        cssText: 'margin-top: 5px;',
        text: `${t('attPres')}: ${totalAttended} | ${t('attAbs')}: ${totalAbsent}`
    }));

    summary.appendChild(strong);
    summary.appendChild(secondLine);

    box.appendChild(buttonsRow);
    box.appendChild(summary);

    panel.appendChild(box);
    return panel;
}

function createChatPanel(cardId) {
    const panel = createElement('div', {
        className: 'panel-content',
        id: `tab-chat-${cardId}`
    });

    const chatBox = createElement('div', {
        className: 'chat-box',
        id: `chat-box-${cardId}`,
        text: '...'
    });

    const controls = createElement('div', {
        cssText: 'display: flex; gap: 5px; margin-top: 8px;'
    });

    const emojiBtn = createElement('button', {
        type: 'button',
        className: 'btn-icon js-card-chat-emoji',
        dataset: {
            inputId: `chat-in-${cardId}`
        }
    });
    emojiBtn.appendChild(createElement('i', {
        className: 'far fa-smile',
        cssText: 'color:var(--text-muted); font-size:1.5rem;'
    }));

    const input = createElement('input', {
        type: 'text',
        id: `chat-in-${cardId}`,
        className: 'js-card-chat-input',
        placeholder: '...',
        dataset: {
            cardId
        },
        cssText: 'flex:1; min-width:0; padding:8px; border-radius:6px; border:1px solid var(--toggle-bg); font-size:0.8rem;'
    });

    const sendBtn = createElement('button', {
        type: 'button',
        className: 'btn-icon js-card-chat-send',
        dataset: {
            cardId
        },
        cssText: 'background:var(--primary) !important; color:white; width:36px; height:36px;'
    });
    sendBtn.appendChild(createIcon('fas fa-paper-plane'));

    controls.appendChild(emojiBtn);
    controls.appendChild(input);
    controls.appendChild(sendBtn);

    panel.appendChild(chatBox);
    panel.appendChild(controls);

    return panel;
}

function createExpandedActions(cls, weekType, dayIndex, classIndex, columnDateStr, hasExam, isCancelled) {
    const actions = createElement('div', { className: 'expanded-actions' });

    const mailBtn = createElement('button', {
        type: 'button',
        className: 'btn-mail js-send-mail',
        dataset: {
            email: safeText(cls.email),
            subject: encodeURIComponent(safeText(cls.subject))
        }
    });
    mailBtn.appendChild(createIcon('fas fa-envelope'));
    mailBtn.appendChild(document.createTextNode(` ${t('btnMail')}`));

    const examBtn = createElement('button', {
        type: 'button',
        className: 'btn-attendance js-mark-exam',
        cssText: hasExam ? 'background: rgba(239, 68, 68, 0.1); color: var(--danger);' : '',
        dataset: {
            week: weekType,
            day: dayIndex,
            classIndex,
            date: columnDateStr
        }
    });
    examBtn.appendChild(createIcon(`fas ${hasExam ? 'fa-times' : 'fa-bullseye'}`));
    examBtn.appendChild(document.createTextNode(` ${hasExam ? t('btnExamDel') : t('btnExamSet')}`));

    const cancelBtn = createElement('button', {
        type: 'button',
        className: 'btn-cancel-class js-toggle-cancel-class',
        dataset: {
            week: weekType,
            day: dayIndex,
            classIndex,
            date: columnDateStr
        }
    });
    cancelBtn.appendChild(createIcon(`fas ${isCancelled ? 'fa-undo' : 'fa-ban'}`));
    cancelBtn.appendChild(document.createTextNode(` ${isCancelled ? t('btnRestore') : t('btnCancel')}`));

    actions.appendChild(mailBtn);
    actions.appendChild(examBtn);
    actions.appendChild(cancelBtn);

    return actions;
}

function createPanelTabs(cardId) {
    const tabs = createElement('div', { className: 'panel-tabs' });

    const todoTab = createElement('button', {
        type: 'button',
        className: 'tab-btn active js-panel-tab',
        dataset: {
            tabId: `tab-todo-${cardId}`
        },
        text: t('tabTasks')
    });

    const notesTab = createElement('button', {
        type: 'button',
        className: 'tab-btn js-panel-tab',
        dataset: {
            tabId: `tab-notes-${cardId}`
        },
        text: t('tabNotes')
    });

    const attTab = createElement('button', {
        type: 'button',
        className: 'tab-btn js-panel-tab',
        dataset: {
            tabId: `tab-att-${cardId}`
        },
        text: t('tabAtt')
    });

    const chatTab = createElement('button', {
        type: 'button',
        className: 'tab-btn js-panel-tab js-chat-tab',
        dataset: {
            tabId: `tab-chat-${cardId}`,
            cardId
        }
    });
    chatTab.appendChild(createIcon('fab fa-google'));
    chatTab.appendChild(document.createTextNode(` ${t('tabForum')}`));

    tabs.appendChild(todoTab);
    tabs.appendChild(notesTab);
    tabs.appendChild(attTab);
    tabs.appendChild(chatTab);

    return tabs;
}

function createClassCard(cls, context) {
    const {
        cardId,
        weekType,
        dayIndex,
        classIndex,
        columnDateStr,
        isOngoing,
        progressPercent,
        isCancelled,
        isCancelledGlobal,
        hasExam,
        hasExamGlobal,
        hasAttended,
        hasAbsent,
        freq,
        totalAttended,
        totalAbsent,
        typeLabels,
        renderIndex
    } = context;

    const card = createElement('div', {
        className: `class-card ${isOngoing && !isCancelled ? 'ongoing' : ''} ${isCancelled ? 'cancelled' : ''}`.trim(),
        dataset: {
            panelId: `panel-${cardId}`
        },
        cssText: `animation-delay: ${renderIndex * 0.05}s;`,
        events: {
            click: (e) => {
                if (
                    e.target.closest('.card-expanded-panel') ||
                    e.target.closest('.btn-icon') ||
                    e.target.closest('button') ||
                    e.target.closest('input') ||
                    e.target.closest('textarea') ||
                    e.target.closest('[contenteditable="true"]')
                ) {
                    return;
                }

                togglePanel(`panel-${cardId}`);
            }
        }
    });

    if (isCancelled) {
        card.appendChild(createElement('div', {
            className: `cancelled-stamp ${isCancelledGlobal ? 'global' : ''}`.trim(),
            text: isCancelledGlobal ? t('stampCancelAdmin') : t('stampCancel')
        }));
    }

    card.appendChild(createCardHeaderTags(cls, typeLabels, hasExam, hasExamGlobal, weekType, dayIndex, classIndex));
    card.appendChild(createClassTimeRow(cls, isOngoing, isCancelled));

    card.appendChild(createElement('div', {
        className: 'class-subject',
        text: t_sub(cls.subject)
    }));

    card.appendChild(createClassDetails(cls));

    const specificDatesLabel = createSpecificDatesLabel(cls);
    if (specificDatesLabel) {
        card.appendChild(specificDatesLabel);
    }

    card.appendChild(createProgressContainer(progressPercent));

    const panel = createElement('div', {
        className: 'card-expanded-panel',
        id: `panel-${cardId}`
    });

    panel.appendChild(createPanelTabs(cardId));
    panel.appendChild(createTodoPanel(cardId, weekType, dayIndex, classIndex, cls));
    panel.appendChild(createNotesPanel(cardId, weekType, dayIndex, classIndex, cls));
    panel.appendChild(createAttendancePanel(cardId, weekType, dayIndex, classIndex, columnDateStr, hasAttended, hasAbsent, freq, totalAttended, totalAbsent));
    panel.appendChild(createChatPanel(cardId));
    panel.appendChild(createExpandedActions(cls, weekType, dayIndex, classIndex, columnDateStr, hasExam, isCancelled));

    card.appendChild(panel);

    return card;
}
function renderCalendar() {
    const calendar = document.getElementById('calendar');
    if (!calendar) return;

    clearElement(calendar);

    const daysNames = [t('mon'), t('tue'), t('wed'), t('thu'), t('fri')];
    const typeLabels = {
        wyklad: t('lec'),
        cwiczenia: t('exe'),
        lab: t('lab'),
        projekt: t('proj'),
        seminarium: t('sem_class'),
        inne: t('other')
    };

    const searchInput = document.getElementById('searchInput');
    const searchTerm = searchInput ? safeText(searchInput.value).toLowerCase() : '';

    const now = new Date();
    const todayStr = formatDateStr(now);
    const currentMins = now.getHours() * 60 + now.getMinutes();

    const friday = new Date(viewDateStart);
    friday.setDate(viewDateStart.getDate() + 4);

    const weekLabel = document.getElementById('week-label');
    if (weekLabel) {
        setSafeText(
            weekLabel,
            `${viewDateStart.getDate()}.${viewDateStart.getMonth() + 1} - ${friday.getDate()}.${friday.getMonth() + 1}.${friday.getFullYear()}`
        );
    }

    for (let i = 0; i < 5; i++) {
        const column = createElement('div', { className: 'day-column' });

        const columnDateObj = new Date(viewDateStart);
        columnDateObj.setDate(viewDateStart.getDate() + i);

        const columnDateStr = formatDateStr(columnDateObj);
        const weekType = getWeekTypeForDate(columnDateObj);
        const specialDay = checkSpecialDay(columnDateStr);

        const weekTypeLabel = specialDay
            ? specialDay.type
            : (weekType === 'INNY' ? t('noClass') : (weekType === 'TN' ? t('tn') : t('tp')));

        const colorMarker = getWeekTypeColorMarker(weekType, specialDay);

        column.appendChild(
            createDayTitle(daysNames, i, columnDateObj, todayStr, weekTypeLabel, colorMarker)
        );

        if (specialDay) {
            column.appendChild(
                createEmptyState(
                    'https://media.giphy.com/media/l41lFw057lAJQMwg0/giphy.gif',
                    'Wolne',
                    safeText(specialDay.title)
                )
            );
            calendar.appendChild(column);
            continue;
        }

        if (weekType === 'INNY') {
            column.appendChild(
                createEmptyState(
                    'https://media.giphy.com/media/dzaUX7CAG0Ihi/giphy.gif',
                    'Party',
                    t('emptyDay')
                )
            );
            calendar.appendChild(column);
            continue;
        }

        const classes = Array.isArray(scheduleData?.[weekType]?.[i]) ? scheduleData[weekType][i] : [];
        let classesRendered = 0;

        const sortedClasses = classes
            .map((c, origIdx) => ({ ...c, origIdx }))
            .sort((a, b) => safeText(a.start).localeCompare(safeText(b.start)));

        let prevEndMins = null;

        sortedClasses.forEach((clsCopy, renderIndex) => {
            const classIndex = clsCopy.origIdx;
            const cls = getSafeClass(weekType, i, classIndex);
            if (!cls) return;

            ensureClassArrays(cls);

            const cardId = `${weekType}-${i}-${classIndex}`;

            if (cls.specificDates.length > 0 && !cls.specificDates.includes(columnDateStr)) {
                return;
            }

            const subjectLower = safeText(cls.subject).toLowerCase();
            const roomLower = safeText(cls.room).toLowerCase();
            const lecturerLower = safeText(cls.lecturer).toLowerCase();

            if (
                searchTerm &&
                !subjectLower.includes(searchTerm) &&
                !roomLower.includes(searchTerm) &&
                !lecturerLower.includes(searchTerm)
            ) {
                return;
            }

            const startMins = parseTimeToMinutes(cls.start);
            const endMins = parseTimeToMinutes(cls.end);

            if (prevEndMins !== null && (startMins - prevEndMins) >= 45 && !searchTerm) {
                column.appendChild(createGapCard(startMins - prevEndMins));
            }

            prevEndMins = endMins;
            classesRendered++;

            const isOngoing = columnDateStr === todayStr && currentMins >= startMins && currentMins <= endMins;
            const progressPercent = isOngoing && endMins > startMins
                ? ((currentMins - startMins) / (endMins - startMins)) * 100
                : 0;

            const globalCancelledDates = Array.isArray(globalAdminEvents?.cancelled?.[cardId])
                ? globalAdminEvents.cancelled[cardId]
                : [];
            const globalExamDates = Array.isArray(globalAdminEvents?.exams?.[cardId])
                ? globalAdminEvents.exams[cardId]
                : [];

            const isCancelledLocal = cls.cancelledDates.includes(columnDateStr);
            const isCancelledGlobal = globalCancelledDates.includes(columnDateStr);
            const isCancelled = isCancelledLocal || isCancelledGlobal;

            const hasExamLocal = cls.exams.includes(columnDateStr);
            const hasExamGlobal = globalExamDates.includes(columnDateStr);
            const hasExam = hasExamLocal || hasExamGlobal;

            const hasAttended = cls.attendedDates.includes(columnDateStr);
            const hasAbsent = cls.absentDates.includes(columnDateStr);

            const totalAttended = cls.attendedDates.length;
            const totalAbsent = cls.absentDates.length;
            const totalPast = totalAttended + totalAbsent;
            const freq = totalPast === 0 ? 0 : Math.round((totalAttended / totalPast) * 100);

            column.appendChild(
                createClassCard(cls, {
                    cardId,
                    weekType,
                    dayIndex: i,
                    classIndex,
                    columnDateStr,
                    isOngoing,
                    progressPercent,
                    isCancelled,
                    isCancelledGlobal,
                    hasExam,
                    hasExamGlobal,
                    hasAttended,
                    hasAbsent,
                    freq,
                    totalAttended,
                    totalAbsent,
                    typeLabels,
                    renderIndex
                })
            );
        });

        if (classesRendered === 0) {
            column.appendChild(
                createEmptyState(
                    'https://media.giphy.com/media/dzaUX7CAG0Ihi/giphy.gif',
                    'Party',
                    t('emptyDay')
                )
            );
        }

        calendar.appendChild(column);
    }
}

function togglePanel(panelId) {
    const panel = document.getElementById(panelId);
    if (panel) {
        panel.classList.toggle('active');
    }
}

function switchTab(buttonEl, tabId) {
    const panel = buttonEl.closest('.card-expanded-panel');
    if (!panel) return;

    panel.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    panel.querySelectorAll('.panel-content').forEach(content => content.classList.remove('active'));

    buttonEl.classList.add('active');

    const tab = document.getElementById(tabId);
    if (tab) {
        tab.classList.add('active');
    }
}

function addTodo(w, d, c) {
    const cls = getSafeClass(w, d, c);
    if (!cls) return;

    ensureClassArrays(cls);
    cls.todo.push({ text: '...', done: false });
    saveData();
    renderCalendar();
}

function toggleTodo(w, d, c, tIdx, checked) {
    const cls = getSafeClass(w, d, c);
    if (!cls) return;

    ensureClassArrays(cls);
    if (!cls.todo[tIdx]) return;

    cls.todo[tIdx].done = !!checked;
    saveData();
    renderCalendar();
}

function updateTodoText(w, d, c, tIdx, val) {
    const cls = getSafeClass(w, d, c);
    if (!cls) return;

    ensureClassArrays(cls);
    if (!cls.todo[tIdx]) return;

    const cleaned = typeof sanitizeTodoText === 'function'
        ? sanitizeTodoText(val)
        : normalizePlainText(val, 300);

    cls.todo[tIdx].text = cleaned || '...';
    saveData();
}

function deleteTodo(w, d, c, tIdx) {
    const cls = getSafeClass(w, d, c);
    if (!cls) return;

    ensureClassArrays(cls);
    if (!cls.todo[tIdx]) return;

    cls.todo.splice(tIdx, 1);
    saveData();
    renderCalendar();
}

function saveNote(w, d, c, val) {
    const cls = getSafeClass(w, d, c);
    if (!cls) return;

    cls.notes = safeText(val).slice(0, 5000);
    saveData();
}

function sendMail(email, sub) {
    const safeEmail = safeText(email).trim();
    if (!safeEmail) {
        alert('Brak maila.');
        return;
    }

    window.location.href = `mailto:${safeEmail}?subject=${encodeURIComponent(safeText(sub))}`;
}

async function toggleCancelClass(w, d, c, dateStr) {
    const cls = getSafeClass(w, d, c);
    if (!cls) return;

    ensureClassArrays(cls);

    const user = auth.currentUser;
    const isAdmin = currentUserIsAdmin(user);
    const cardId = buildGlobalCardId(w, d, c);

    if (isAdmin) {
        const wantsGlobal = confirm(
            '👑 Zalogowano jako Starosta (Admin)!\n\nCzy chcesz odwołać te zajęcia GLOBALNIE dla wszystkich studentów na roku?\n\n[OK] - Zmień Globalnie\n[Anuluj] - Zmień tylko w moim telefonie'
        );

        if (wantsGlobal) {
            try {
                await toggleGlobalDate('cancelled', cardId, dateStr);
            } catch (error) {
                console.error('Błąd globalnego odwołania zajęć:', error);
                alert('Nie udało się zapisać zmiany globalnej.');
            }
            return;
        }
    } else if (user) {
        const wantsProposal = confirm(
            'Czy chcesz zaproponować Adminowi zmianę dla CAŁEGO ROKU?\n\n[OK] - Wyślij prośbę do Starosty (Zaproponuj Globalnie)\n[Anuluj] - Zmień tylko na moim telefonie'
        );

        if (wantsProposal) {
            try {
                await submitAdminRequest({
                    type: 'cancel',
                    cardId,
                    dateStr,
                    subject: safeText(cls.subject),
                    requester: safeText(user.displayName || 'Student'),
                    uid: user.uid
                });

                alert('Wysłano prośbę do Admina! Czeka na zatwierdzenie.');
            } catch (error) {
                console.error('Błąd wysyłania prośby do admina:', error);
                alert('Nie udało się wysłać prośby do Admina.');
            }
        }
    }

    if (cls.cancelledDates.includes(dateStr)) {
        cls.cancelledDates = cls.cancelledDates.filter(dx => dx !== dateStr);
    } else {
        cls.cancelledDates.push(dateStr);
    }

    saveData();
    renderCalendar();
}

async function markExam(w, d, c, dateStr) {
    const cls = getSafeClass(w, d, c);
    if (!cls) return;

    ensureClassArrays(cls);

    const user = auth.currentUser;
    const isAdmin = currentUserIsAdmin(user);
    const cardId = buildGlobalCardId(w, d, c);

    if (isAdmin) {
        const wantsGlobal = confirm(
            '👑 Zalogowano jako Starosta (Admin)!\n\nCzy chcesz ustalić to Kolokwium GLOBALNIE dla wszystkich studentów na roku?\n\n[OK] - Ustal Globalnie\n[Anuluj] - Ustal tylko dla siebie'
        );

        if (wantsGlobal) {
            try {
                await toggleGlobalDate('exams', cardId, dateStr);
            } catch (error) {
                console.error('Błąd globalnego ustawiania kolokwium:', error);
                alert('Nie udało się zapisać zmiany globalnej.');
            }
            return;
        }
    } else if (user) {
        const wantsProposal = confirm(
            'Czy chcesz zaproponować Adminowi ustawienie tego Kolokwium dla CAŁEGO ROKU?\n\n[OK] - Wyślij prośbę do Starosty (Zaproponuj Globalnie)\n[Anuluj] - Zmień tylko na moim telefonie'
        );

        if (wantsProposal) {
            try {
                await submitAdminRequest({
                    type: 'exam',
                    cardId,
                    dateStr,
                    subject: safeText(cls.subject),
                    requester: safeText(user.displayName || 'Student'),
                    uid: user.uid
                });

                alert('Wysłano prośbę do Admina! Czeka na zatwierdzenie.');
            } catch (error) {
                console.error('Błąd wysyłania prośby o kolokwium:', error);
                alert('Nie udało się wysłać prośby do Admina.');
            }
        }
    }

    if (cls.exams.includes(dateStr)) {
        cls.exams = cls.exams.filter(dx => dx !== dateStr);
    } else {
        cls.exams.push(dateStr);
    }

    saveData();
    renderCalendar();
}

function changeWeek(offset) {
    viewDateStart.setDate(viewDateStart.getDate() + (Number(offset) * 7));
    renderCalendar();
}

function jumpToToday() {
    viewDateStart = getSmartStartMonday();
    renderCalendar();
}

function saveClass() {
    const weekTypeSelect = document.getElementById('weekTypeSelect');
    const daySelect = document.getElementById('daySelect');
    const editClassIndexEl = document.getElementById('editClassIndex');
    const editDayIndexEl = document.getElementById('editDayIndex');
    const datesInputEl = document.getElementById('specificDates');

    if (!weekTypeSelect || !daySelect || !editClassIndexEl || !editDayIndexEl || !datesInputEl) return;

    const w = weekTypeSelect.value;
    const d = Number(daySelect.value);
    const eIdx = Number(editClassIndexEl.value);
    const oDIdx = Number(editDayIndexEl.value);
    const datesInput = safeText(datesInputEl.value);

    let parsedDates = [];
    if (datesInput.trim() !== '') {
        parsedDates = datesInput
            .split(',')
            .map(dx => dx.trim())
            .filter(Boolean);
    }

    const startEl = document.getElementById('timeStart');
    const endEl = document.getElementById('timeEnd');
    const subjectEl = document.getElementById('subject');
    const classTypeEl = document.getElementById('classType');
    const roomEl = document.getElementById('room');
    const lecturerEl = document.getElementById('lecturer');

    if (!startEl || !endEl || !subjectEl || !classTypeEl || !roomEl || !lecturerEl) return;

    const existing = eIdx !== -1 ? getSafeClass(w, oDIdx, eIdx) : null;
    if (existing) ensureClassArrays(existing);

    const classData = {
        start: safeText(startEl.value).trim(),
        end: safeText(endEl.value).trim(),
        subject: safeText(subjectEl.value).trim(),
        type: safeText(classTypeEl.value).trim(),
        room: safeText(roomEl.value).trim(),
        lecturer: safeText(lecturerEl.value).trim(),
        specificDates: parsedDates,
        notes: existing ? safeText(existing.notes) : '',
        todo: existing ? [...existing.todo] : [],
        cancelledDates: existing ? [...existing.cancelledDates] : [],
        exams: existing ? [...existing.exams] : [],
        attendedDates: existing ? [...existing.attendedDates] : [],
        absentDates: existing ? [...existing.absentDates] : []
    };

    if (!classData.start || !classData.end || !classData.subject) {
        alert('Wypełnij pola!');
        return;
    }

    if (eIdx === -1) {
        scheduleData[w][d].push(classData);
    } else {
        scheduleData[w][oDIdx][eIdx] = classData;
    }

    saveData();
    closeModal();
    renderCalendar();
    updateDashboard();
}
function deleteClass() {
    const weekTypeSelect = document.getElementById('weekTypeSelect');
    const editClassIndexEl = document.getElementById('editClassIndex');
    const editDayIndexEl = document.getElementById('editDayIndex');

    if (!weekTypeSelect || !editClassIndexEl || !editDayIndexEl) return;

    const w = weekTypeSelect.value;
    const d = Number(editDayIndexEl.value);
    const cIdx = Number(editClassIndexEl.value);

    if (cIdx === -1) return;

    const cls = getSafeClass(w, d, cIdx);
    if (!cls) return;

    if (!confirm(`Czy na pewno chcesz usunąć lekcję:\n\n${safeText(cls.subject)}\n${safeText(cls.start)} - ${safeText(cls.end)}?`)) {
        return;
    }

    scheduleData[w][d].splice(cIdx, 1);

    saveData();
    closeModal();
    renderCalendar();

    if (typeof updateDashboard === 'function') {
        updateDashboard(true);
    }
}

function editClass(week, dayIndex, classIndex) {
    const cls = getSafeClass(week, dayIndex, classIndex);
    if (!cls) return;

    const modalTitle = document.getElementById('modalTitle');
    const saveBtn = document.getElementById('saveBtn');
    const weekTypeSelect = document.getElementById('weekTypeSelect');
    const daySelect = document.getElementById('daySelect');
    const editDayIndex = document.getElementById('editDayIndex');
    const editClassIndex = document.getElementById('editClassIndex');
    const timeStart = document.getElementById('timeStart');
    const timeEnd = document.getElementById('timeEnd');
    const subject = document.getElementById('subject');
    const room = document.getElementById('room');
    const lecturer = document.getElementById('lecturer');
    const classType = document.getElementById('classType');
    const specificDates = document.getElementById('specificDates');
    const deleteClassBtn = document.getElementById('deleteClassBtn');
    const classModal = document.getElementById('classModal');

    if (modalTitle) setSafeText(modalTitle, 'Edytuj zajęcia');
    if (saveBtn) setSafeText(saveBtn, 'Zapisz');
    if (weekTypeSelect) weekTypeSelect.value = week;
    if (daySelect) daySelect.value = dayIndex;
    if (editDayIndex) editDayIndex.value = dayIndex;
    if (editClassIndex) editClassIndex.value = classIndex;
    if (timeStart) timeStart.value = safeText(cls.start);
    if (timeEnd) timeEnd.value = safeText(cls.end);
    if (subject) subject.value = safeText(cls.subject);
    if (room) room.value = safeText(cls.room);
    if (lecturer) lecturer.value = safeText(cls.lecturer);
    if (classType) classType.value = safeText(cls.type || 'inne');
    if (specificDates) specificDates.value = Array.isArray(cls.specificDates) ? cls.specificDates.join(', ') : '';

    if (deleteClassBtn) {
        deleteClassBtn.style.display = 'inline-flex';
    }

    if (classModal) classModal.style.display = 'flex';
}
function initCalendarDelegation() {
    if (window.__calendarDelegationInitialized) return;
    window.__calendarDelegationInitialized = true;

    document.addEventListener('click', e => {
        const editBtn = e.target.closest('.js-edit-class-btn');
        if (editBtn) {
            e.preventDefault();
            e.stopPropagation();
            editClass(
                editBtn.dataset.week,
                Number(editBtn.dataset.day),
                Number(editBtn.dataset.classIndex)
            );
            return;
        }

        const tabBtn = e.target.closest('.js-panel-tab');
        if (tabBtn) {
            e.preventDefault();
            e.stopPropagation();

            switchTab(tabBtn, tabBtn.dataset.tabId);

            if (tabBtn.classList.contains('js-chat-tab')) {
                listenForMessages(tabBtn.dataset.cardId);
            }
            return;
        }

        const addTodoBtn = e.target.closest('.js-card-add-todo');
        if (addTodoBtn) {
            e.preventDefault();
            e.stopPropagation();
            addTodo(
                addTodoBtn.dataset.week,
                Number(addTodoBtn.dataset.day),
                Number(addTodoBtn.dataset.classIndex)
            );
            return;
        }

        const deleteTodoBtn = e.target.closest('.js-card-todo-delete');
        if (deleteTodoBtn) {
            e.preventDefault();
            e.stopPropagation();
            deleteTodo(
                deleteTodoBtn.dataset.week,
                Number(deleteTodoBtn.dataset.day),
                Number(deleteTodoBtn.dataset.classIndex),
                Number(deleteTodoBtn.dataset.todoIndex)
            );
            return;
        }

        const sendMailBtn = e.target.closest('.js-send-mail');
        if (sendMailBtn) {
            e.preventDefault();
            e.stopPropagation();
            sendMail(
                sendMailBtn.dataset.email,
                decodeURIComponent(sendMailBtn.dataset.subject || '')
            );
            return;
        }

        const examBtn = e.target.closest('.js-mark-exam');
        if (examBtn) {
            e.preventDefault();
            e.stopPropagation();
            markExam(
                examBtn.dataset.week,
                Number(examBtn.dataset.day),
                Number(examBtn.dataset.classIndex),
                examBtn.dataset.date
            );
            return;
        }

        const cancelBtn = e.target.closest('.js-toggle-cancel-class');
        if (cancelBtn) {
            e.preventDefault();
            e.stopPropagation();
            toggleCancelClass(
                cancelBtn.dataset.week,
                Number(cancelBtn.dataset.day),
                Number(cancelBtn.dataset.classIndex),
                cancelBtn.dataset.date
            );
            return;
        }

        const emojiBtn = e.target.closest('.js-card-chat-emoji');
        if (emojiBtn) {
            e.preventDefault();
            e.stopPropagation();
            toggleEmojiPicker(emojiBtn.dataset.inputId);
            return;
        }

        const sendChatBtn = e.target.closest('.js-card-chat-send');
        if (sendChatBtn) {
            e.preventDefault();
            e.stopPropagation();
            sendChat(sendChatBtn.dataset.cardId);
            return;
        }

        const card = e.target.closest('.class-card');
        if (card) {
            if (
                e.target.closest('.card-expanded-panel') ||
                e.target.closest('.btn-icon') ||
                e.target.closest('button') ||
                e.target.closest('input') ||
                e.target.closest('textarea') ||
                e.target.closest('[contenteditable="true"]')
            ) {
                return;
            }

            const panelId = card.dataset.panelId;
            if (panelId) {
                togglePanel(panelId);
            }
            return;
        }
    });

    document.addEventListener('change', e => {
        const todoCheckbox = e.target.closest('.js-card-todo-toggle');
        if (todoCheckbox) {
            toggleTodo(
                todoCheckbox.dataset.week,
                Number(todoCheckbox.dataset.day),
                Number(todoCheckbox.dataset.classIndex),
                Number(todoCheckbox.dataset.todoIndex),
                todoCheckbox.checked
            );
            return;
        }

        const noteArea = e.target.closest('.js-card-note');
        if (noteArea) {
            saveNote(
                noteArea.dataset.week,
                Number(noteArea.dataset.day),
                Number(noteArea.dataset.classIndex),
                noteArea.value
            );
            return;
        }
    });

    document.addEventListener('focusout', e => {
        const todoText = e.target.closest('.js-card-todo-text');
        if (todoText) {
            updateTodoText(
                todoText.dataset.week,
                Number(todoText.dataset.day),
                Number(todoText.dataset.classIndex),
                Number(todoText.dataset.todoIndex),
                todoText.innerText
            );
        }
    });

    document.addEventListener('keydown', e => {
        const input = e.target.closest('.js-card-chat-input');
        if (!input) return;

        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendChat(input.dataset.cardId);
        }
    });
}
