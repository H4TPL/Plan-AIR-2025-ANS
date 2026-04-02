// ==========================================
// ✅ ZBIORCZE ZADANIA / TODO
// wersja bez surowego innerHTML dla danych użytkownika
// ==========================================

function getGlobalTodoRef(w, d, cIdx, tIdx) {
    if (!scheduleData || !scheduleData[w] || !scheduleData[w][d] || !scheduleData[w][d][cIdx]) {
        return null;
    }

    const cls = scheduleData[w][d][cIdx];

    if (!Array.isArray(cls.todo) || !cls.todo[tIdx]) {
        return null;
    }

    return cls.todo[tIdx];
}

function sanitizeTodoText(value) {
    return normalizePlainText(value, 300);
}

function updateGlobalTodoText(w, d, cIdx, tIdx, val) {
    const todoRef = getGlobalTodoRef(w, d, cIdx, tIdx);
    if (!todoRef) return;

    const cleaned = sanitizeTodoText(val);
    todoRef.text = cleaned || '...';
    saveData();
}

function deleteGlobalTodo(w, d, cIdx, tIdx) {
    if (!scheduleData || !scheduleData[w] || !scheduleData[w][d] || !scheduleData[w][d][cIdx]) {
        return;
    }

    const cls = scheduleData[w][d][cIdx];
    if (!Array.isArray(cls.todo) || !cls.todo[tIdx]) return;

    cls.todo.splice(tIdx, 1);
    saveData();
    renderCalendar();
    openGlobalTasksModal();
}

function toggleGlobalTodo(w, d, cIdx, tIdx, checked) {
    const todoRef = getGlobalTodoRef(w, d, cIdx, tIdx);
    if (!todoRef) return;

    todoRef.done = !!checked;
    saveData();
    renderCalendar();
    openGlobalTasksModal();
}

function createTasksEmptyState() {
    const wrapper = createElement('div', { className: 'empty-gif-container' });

    const img = createElement('img', {
        attrs: {
            src: 'https://media.giphy.com/media/11s7Ke7jcNxCHS/giphy.gif',
            alt: 'Relax'
        }
    });

    const text = createElement('p', {
        text: t('tasksEmpty')
    });

    wrapper.appendChild(img);
    wrapper.appendChild(text);

    return wrapper;
}

function createGlobalTaskItem(w, d, cIdx, tIdx, cls, taskItem) {
    const wrapper = createElement('div', {
        className: 'todo-global-item'
    });

    const checkbox = createElement('input', {
        className: 'js-global-todo-toggle',
        type: 'checkbox',
        dataset: {
            week: w,
            day: d,
            classIndex: cIdx,
            todoIndex: tIdx
        }
    });
    checkbox.checked = !!taskItem.done;

    const contentWrap = createElement('div', {
        cssText: 'flex: 1; min-width: 0; text-align: left; display: flex; flex-direction: column;'
    });

    const subjectLabel = createElement('span', {
        cssText: 'font-size: 0.7rem; color: var(--primary); font-weight: 900; text-transform: uppercase; margin-bottom: 2px;',
        text: t_sub(cls.subject)
    });

    const todoText = createElement('div', {
        className: 'todo-input js-global-todo-text',
        contentEditable: true,
        dataset: {
            week: w,
            day: d,
            classIndex: cIdx,
            todoIndex: tIdx
        },
        cssText: taskItem.done
            ? 'text-decoration: line-through; color: var(--text-muted); opacity: 0.7;'
            : 'color: var(--text-main);'
    });
    todoText.textContent = safeText(taskItem.text, '...');

    const deleteBtn = createElement('button', {
        className: 'btn-icon js-global-todo-delete',
        type: 'button',
        dataset: {
            week: w,
            day: d,
            classIndex: cIdx,
            todoIndex: tIdx
        },
        cssText: 'color: var(--danger);'
    });
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>';

    contentWrap.appendChild(subjectLabel);
    contentWrap.appendChild(todoText);

    wrapper.appendChild(checkbox);
    wrapper.appendChild(contentWrap);
    wrapper.appendChild(deleteBtn);

    return wrapper;
}

function initTasksDelegation() {
    if (window.__tasksDelegationInitialized) return;
    window.__tasksDelegationInitialized = true;

    document.addEventListener('change', e => {
        const checkbox = e.target.closest('.js-global-todo-toggle');
        if (!checkbox) return;

        toggleGlobalTodo(
            checkbox.dataset.week,
            Number(checkbox.dataset.day),
            Number(checkbox.dataset.classIndex),
            Number(checkbox.dataset.todoIndex),
            checkbox.checked
        );
    });

    document.addEventListener('click', e => {
        const deleteBtn = e.target.closest('.js-global-todo-delete');
        if (!deleteBtn) return;

        e.preventDefault();
        e.stopPropagation();

        deleteGlobalTodo(
            deleteBtn.dataset.week,
            Number(deleteBtn.dataset.day),
            Number(deleteBtn.dataset.classIndex),
            Number(deleteBtn.dataset.todoIndex)
        );
    });

    document.addEventListener('focusout', e => {
        const editable = e.target.closest('.js-global-todo-text');
        if (!editable) return;

        updateGlobalTodoText(
            editable.dataset.week,
            Number(editable.dataset.day),
            Number(editable.dataset.classIndex),
            Number(editable.dataset.todoIndex),
            editable.innerText
        );
    });
}

function openGlobalTasksModal() {
    toggleSidebar();

    const list = document.getElementById('global-tasks-list');
    if (!list) return;

    clearElement(list);

    let hasTasks = false;
    const fragment = document.createDocumentFragment();

    ['TN', 'TP'].forEach(w => {
        for (let d = 0; d < 5; d++) {
            (scheduleData[w][d] || []).forEach((cls, cIdx) => {
                if (Array.isArray(cls.todo) && cls.todo.length > 0) {
                    cls.todo.forEach((taskItem, tIdx) => {
                        hasTasks = true;
                        fragment.appendChild(
                            createGlobalTaskItem(w, d, cIdx, tIdx, cls, taskItem)
                        );
                    });
                }
            });
        }
    });

    if (!hasTasks) {
        list.appendChild(createTasksEmptyState());
    } else {
        list.appendChild(fragment);
    }

    document.getElementById('globalTasksModal').style.display = 'flex';
}

initTasksDelegation();