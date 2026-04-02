// ==========================================
// 🪟 MODALE / PICKER / DROBNE AKCJE UI
// bez inline eventów i bez renderu przez innerHTML +=
// ==========================================

let pickerCurrentDate = new Date();

function openCustomDatePicker() {
    pickerCurrentDate = new Date(viewDateStart);

    if (isNaN(pickerCurrentDate.getTime())) {
        pickerCurrentDate = new Date();
    }

    renderCustomDatePicker();

    const modal = document.getElementById('customDatePickerModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeCustomDatePicker() {
    const modal = document.getElementById('customDatePickerModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function changePickerMonth(offset) {
    const numericOffset = Number(offset);
    if (!Number.isFinite(numericOffset)) return;

    pickerCurrentDate.setMonth(pickerCurrentDate.getMonth() + numericOffset);
    renderCustomDatePicker();
}

function createPickerDayCell({
    text,
    classes = 'picker-day',
    dateStr = null
}) {
    const cell = createElement('div', {
        className: classes,
        text: safeText(text)
    });

    if (dateStr) {
        cell.dataset.date = dateStr;
        cell.classList.add('js-picker-day-select');
    }

    return cell;
}

function renderCustomDatePicker() {
    const grid = document.getElementById('pickerDaysGrid');
    const monthYearEl = document.getElementById('pickerMonthYear');

    if (!grid || !monthYearEl) return;

    clearElement(grid);

    const monthNames = [
        'Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec',
        'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień'
    ];

    const year = pickerCurrentDate.getFullYear();
    const month = pickerCurrentDate.getMonth();

    setSafeText(monthYearEl, `${monthNames[month]} ${year}`);

    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    const daysInMonth = lastDayOfMonth.getDate();

    let firstDayOfWeek = firstDayOfMonth.getDay();
    firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1;

    const prevMonthLastDay = new Date(year, month, 0).getDate();
    const todayStr = formatDateStr(new Date());
    const selectedWeekMonday = formatDateStr(viewDateStart);

    const fragment = document.createDocumentFragment();

    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
        fragment.appendChild(
            createPickerDayCell({
                text: prevMonthLastDay - i,
                classes: 'picker-day muted'
            })
        );
    }

    for (let i = 1; i <= daysInMonth; i++) {
        const cellDate = new Date(year, month, i);
        const cellDateStr = formatDateStr(cellDate);
        const dMonday = getMonday(cellDate);

        const isSelectedWeek = formatDateStr(dMonday) === selectedWeekMonday;
        const isToday = cellDateStr === todayStr;

        let classes = 'picker-day';
        if (isToday) {
            classes += ' current';
        } else if (isSelectedWeek) {
            classes += ' selected';
        }

        fragment.appendChild(
            createPickerDayCell({
                text: i,
                classes,
                dateStr: cellDateStr
            })
        );
    }

    const totalCells = firstDayOfWeek + daysInMonth;
    const remainingCells = (7 - (totalCells % 7)) % 7;

    for (let i = 1; i <= remainingCells; i++) {
        fragment.appendChild(
            createPickerDayCell({
                text: i,
                classes: 'picker-day muted'
            })
        );
    }

    grid.appendChild(fragment);
}

function selectDateFromCustomPicker(dateStr) {
    const pickedDate = new Date(dateStr);
    if (isNaN(pickedDate.getTime())) return;

    viewDateStart = getMonday(pickedDate);
    renderCalendar();
    closeCustomDatePicker();
}

function openModal() {
    const modalTitle = document.getElementById('modalTitle');
    const saveBtn = document.getElementById('saveBtn');
    const editClassIndex = document.getElementById('editClassIndex');
    const classModal = document.getElementById('classModal');

    if (modalTitle) setSafeText(modalTitle, 'Dodaj zajęcia');
    if (saveBtn) setSafeText(saveBtn, 'Zapisz');
    if (editClassIndex) editClassIndex.value = '-1';
    if (classModal) classModal.style.display = 'flex';
}

function closeModal() {
    const classModal = document.getElementById('classModal');
    if (classModal) {
        classModal.style.display = 'none';
    }
}

function openBugModal() {
    const bugModal = document.getElementById('bugModal');
    if (bugModal) {
        bugModal.style.display = 'flex';
    }
}

function sendBugReport() {
    const textarea = document.getElementById('bugDescription');
    if (!textarea) return;

    const desc = normalizePlainText(textarea.value, 2000);

    if (!desc) {
        alert('Pusto!');
        return;
    }

    const subject = encodeURIComponent('Bug');
    const body = encodeURIComponent(desc);

    window.location.href = `mailto:hubertwieczorekk@gmail.com?subject=${subject}&body=${body}`;

    const bugModal = document.getElementById('bugModal');
    if (bugModal) {
        bugModal.style.display = 'none';
    }
}

function releaseTheCat() {
    let cat = document.getElementById('nyan-cat');

    if (!cat) {
        cat = document.createElement('img');
        cat.id = 'nyan-cat';
        cat.src = 'https://media1.giphy.com/media/sIIhZliB2McAo/giphy.gif';
        cat.style.position = 'fixed';
        cat.style.bottom = '100px';
        cat.style.left = '-200px';
        cat.style.width = '150px';
        cat.style.zIndex = '9999';
        cat.style.pointerEvents = 'none';
        document.body.appendChild(cat);
    }

    cat.style.transition = 'none';
    cat.style.left = '-200px';
    cat.style.display = 'block';

    setTimeout(() => {
        cat.style.transition = 'left 4s linear';
        cat.style.left = `${window.innerWidth}px`;
    }, 50);

    setTimeout(() => {
        cat.style.display = 'none';
    }, 4100);
}

function initModalsDelegation() {
    if (window.__modalsDelegationInitialized) return;
    window.__modalsDelegationInitialized = true;

    document.addEventListener('click', e => {
        const dayCell = e.target.closest('.js-picker-day-select');
        if (!dayCell) return;

        e.preventDefault();
        e.stopPropagation();

        const dateStr = safeText(dayCell.dataset.date).trim();
        if (!dateStr) return;

        selectDateFromCustomPicker(dateStr);
    });
}

initModalsDelegation();