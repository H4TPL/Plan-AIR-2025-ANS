// ==========================================
// 🛠️ SEKCJA DLA PROGRAMISTY - KONFIGURACJA
// ==========================================
const ADMIN_UIDS = ["tnVRAgmiTfepreJlzTk3wR3L6w72"];

const firebaseConfig = { 
    apiKey: "AIzaSyDCg9gIaAG-dgf45R76ovT22fBSY0-eR98", 
    authDomain: "smart-plan-air.firebaseapp.com", 
    projectId: "smart-plan-air", 
    storageBucket: "smart-plan-air.firebasestorage.app", 
    messagingSenderId: "571923275689", 
    appId: "1:571923275689:web:ed975c8aaa0ce4392f6eb8" 
};

// Zmieniona wersja, aby wymusić aktualizację u wszystkich użytkowników!
const APP_VERSION = "5.2.1-PRO-FIX";

const tnWeeksStarts = ['2026-02-23', '2026-03-09', '2026-03-23', '2026-04-06', '2026-04-20', '2026-05-04', '2026-05-18', '2026-06-01'];
const tpWeeksStarts = ['2026-03-02', '2026-03-16', '2026-03-30', '2026-04-13', '2026-04-27', '2026-05-11', '2026-05-25', '2026-06-08'];
const freeDays = ['2026-04-03', '2026-04-06', '2026-04-07', '2026-04-08', '2026-05-01', '2026-06-04'];
const sessionRanges = [ { start: '2026-06-15', end: '2026-06-28', title: 'Sesja Letnia 📚' }, { start: '2026-09-07', end: '2026-09-20', title: 'Sesja Poprawkowa 📝' } ];
const semesterStart = new Date('2026-02-23').getTime(); const semesterEnd = new Date('2026-06-14').getTime();

const defaultData = {
    "TN": {
        0: [ { start: "12:45", end: "15:00", subject: "Przetwarzanie sygnałów", type: "lab", room: "202t", lecturer: "dr inż. A.Kubacki", specificDates: ['2026-03-09', '2026-03-23', '2026-04-20', '2026-05-04', '2026-05-18'] }, { start: "15:05", end: "19:35", subject: "Przetwarzanie sygnałów (wyk.)", type: "wyklad", room: "202t", lecturer: "dr inż. A.Kubacki", specificDates: ['2026-03-09', '2026-03-23', '2026-04-20', '2026-05-04', '2026-05-18'] } ],
        1: [ { start: "09:45", end: "11:15", subject: "English for Automation...", type: "cwiczenia", room: "18t", lecturer: "dr inż. M.Muszyńska" }, { start: "13:30", end: "15:00", subject: "Pracownia automatyki...", type: "lab", room: "202t", lecturer: "dr inż. T.Kapłon" }, { start: "15:15", end: "16:45", subject: "Projektowanie linii...", type: "wyklad", room: "18t", lecturer: "prof. Milecki" } ],
        2: [ { start: "15:15", end: "16:45", subject: "Rachunek kosztów (wyk.)", type: "wyklad", room: "109t", lecturer: "dr B.Bryl" }, { start: "17:00", end: "18:30", subject: "Rachunek kosztów", type: "cwiczenia", room: "109t", lecturer: "dr B.Bryl" } ],
        3: [], 4: []
    },
    "TP": {
        0: [ { start: "09:45", end: "13:00", subject: "Sieci i wizualizacja", type: "lab", room: "113t", lecturer: "dr hab. W.Stankiewicz" }, { start: "15:00", end: "18:00", subject: "Seminarium", type: "seminarium", room: "113t", lecturer: "dr R.Roszak" } ],
        1: [ { start: "15:30", end: "17:00", subject: "Projektowanie linii...", type: "projekt", room: "18t", lecturer: "mgr inż. M.Wadelski" }, { start: "17:10", end: "19:25", subject: "Rapid Prototyping", type: "lab", room: "207t", lecturer: "mgr inż. R.Bajdek", specificDates: ['2026-03-17', '2026-03-31', '2026-04-14', '2026-04-28', '2026-05-12'] } ],
        2: [ { start: "09:45", end: "11:15", subject: "Rapid Prototyping (wyk.)", type: "wyklad", room: "109t", lecturer: "dr inż. R.Cieślak" }, { start: "13:00", end: "16:00", subject: "Projektowanie chwytaków (wyk.)", type: "wyklad", room: "18t", lecturer: "dr inż. A.Myszkowski", specificDates: ['2026-03-04', '2026-03-18', '2026-04-01', '2026-04-15'] }, { start: "16:15", end: "19:15", subject: "Projektowanie chwytaków", type: "projekt", room: "18t", lecturer: "dr inż. A.Myszkowski", specificDates: ['2026-03-04', '2026-03-18', '2026-04-01', '2026-04-15'] } ],
        3: [], 4: []
    }
};

const SUBJECT_DICT = {
    "Przetwarzanie sygnałów": "Signal Processing",
    "Przetwarzanie sygnałów (wyk.)": "Signal Processing (Lec)",
    "English for Automation...": "English for Automation...",
    "Pracownia automatyki...": "Automation Lab...",
    "Projektowanie linii...": "Automated Lines Design...",
    "Rachunek kosztów (wyk.)": "Cost Accounting (Lec)",
    "Rachunek kosztów": "Cost Accounting",
    "Sieci i wizualizacja": "Networks and Visualization",
    "Seminarium": "Seminar",
    "Rapid Prototyping": "Rapid Prototyping",
    "Rapid Prototyping (wyk.)": "Rapid Prototyping (Lec)",
    "Projektowanie chwytaków (wyk.)": "Gripper Design (Lec)",
    "Projektowanie chwytaków": "Gripper Design"
};

const TRANSLATIONS = {
    pl: { privacyText: "Polityka Cloud Sync: Po zalogowaniu Twoje oceny, zadania, obecności i wiadomości są zapisywane prywatnie i bezpiecznie na Twoim koncie Google Firebase.", statsTitle: "Twoje Statystyki", avgLabel: "Średnia", attLabel: "Obecność", streakLabel: "Passa dni", settings: "Ustawienia", search: "Szukaj przedmiotu, sali...", today: "Dziś", add: "Dodaj", nextClass: "Następne zajęcia", sem: "Semestr", prev: "Poprzedni", next: "Następny", history: "Historia Aktualizacji", privacy: "Prywatność", bug: "Zgłoś Błąd", login: "Zaloguj i Synchronizuj", admin: "Panel Admina (Wnioski)", cat: "Katalog / Zaawansowane", radar: "Radar Kolokwiów", avg: "Średnia Ocen", tasks: "Zbiorcze Zadania", att: "Twoja Frekwencja", theme: "Zmień Motyw", exp: "Eksportuj Kalendarz (.ics)", share: "Udostępnij (Kod QR)", reset: "Twardy Reset Danych", hubTitle: "Centrum Komunikacji", globalChat: "Globalne Forum AiR", backHub: "Wróć do Centrum", mon: "Poniedziałek", tue: "Wtorek", wed: "Środa", thu: "Czwartek", fri: "Piątek", tn: "Nieparzysty (TN)", tp: "Parzysty (TP)", noClass: "Brak zajęć", lec: "Wykład", exe: "Ćwiczenia", lab: "Laboratorium", proj: "Projekt", sem_class: "Seminarium", other: "Inne", room: "Sala", window: "Okienko", startsIn: "Do rozpoczęcia", emptyDay: "Brak zajęć w tym dniu 🎉", footerText: "Stworzone z ❤️ dla inżynierów AiR", qrTitle: "Zeskanuj plan", qrSub: "Aparat w telefonie otworzy ten plan.", close: "Zamknij", attTitle: "Twoja Frekwencja", attSub: "Zestawienie obecności. Rozwiń, by zobaczyć szczegóły dat.", attPres: "Był(a)", attAbs: "Nie był(a)", attGeneral: "Frekwencja ogólna", attBtnPres: "Byłem", attBtnAbs: "Nie byłem", tasksTitle: "Zbiorcze Zadania", tasksSub: "Wszystkie zadania ze wszystkich przedmiotów w jednym miejscu.", gradesTitle: "Średnia Ocen", gradesSub: "Wpisz oceny (np. 5, 4.5, 3).", gradesEmpty: "Brak ocen (np. 4.5, 3)...", radarTitle: "Radar Kolokwiów", radarBtn: "Biorę się za naukę!", radarEmpty: "Czysto! Brak kolokwiów", dirTitle: "Katalog Systemowy", dirLec: "Wykładowcy", dirRoom: "Sale", tabTasks: "Zadania", tabNotes: "Notatki", tabAtt: "Obecność", tabForum: "Forum", btnMail: "Wyślij Maila", btnExamSet: "Ustaw Kolokwium", btnExamDel: "Usuń Kolokwium", btnCancel: "Odwołaj w tym dniu", btnRestore: "Przywróć zajęcia", stampCancel: "ODWOŁANE", stampCancelAdmin: "ODWOŁANE (ADMIN)", badgeExam: "KOLOKWIUM", badgeExamAdmin: "KOLOKWIUM (OGŁOSZENIE)", specificDates: "Tylko w wybrane daty", sendPlaceholder: "Napisz wiadomość...", hubEmpty: "Kliknij przycisk, aby połączyć się z serwerem...", themeLight: "Jasny", themeDark: "Ciemny", themeMatrix: "Matrix", themeCad: "Inżynier CAD", themeUwu: "UWU Anime", themeAns: "Akademia ANS", tasksEmpty: "Brak zadań! Możesz odpoczywać.", tabSubjects: "Przedmioty", tabStudents: "Studenci (DM)" },
    en: { privacyText: "Cloud Sync Policy: Your grades, tasks, attendance, and messages are privately and securely saved to your Google Firebase account upon login.", statsTitle: "Your Stats", avgLabel: "Average", attLabel: "Attendance", streakLabel: "Day Streak", settings: "Settings", search: "Search subjects, rooms...", today: "Today", add: "Add", nextClass: "Next Class", sem: "Semester", prev: "Previous", next: "Next", history: "Changelog", privacy: "Privacy", bug: "Report Bug", login: "Login & Sync", admin: "Admin Panel (Requests)", cat: "Directory / Advanced", radar: "Exam Radar", avg: "Grades Average", tasks: "Global Tasks", att: "Your Attendance", theme: "Change Theme", exp: "Export Calendar (.ics)", share: "Share (QR Code)", reset: "Hard Data Reset", hubTitle: "Communication Hub", globalChat: "Global AiR Forum", backHub: "Back to Hub", mon: "Monday", tue: "Tuesday", wed: "Wednesday", thu: "Thursday", fri: "Friday", tn: "Odd Week (TN)", tp: "Even Week (TP)", noClass: "No classes", lec: "Lecture", exe: "Classes", lab: "Laboratory", proj: "Project", sem_class: "Seminar", other: "Other", room: "Room", window: "Free time", startsIn: "Starts in", emptyDay: "No classes today 🎉", footerText: "Made with ❤️ for AiR engineers", qrTitle: "Scan Schedule", qrSub: "Open this plan with your phone camera.", close: "Close", attTitle: "Your Attendance", attSub: "Attendance summary. Expand to see specific dates.", attPres: "Present", attAbs: "Absent", attGeneral: "Overall attendance", attBtnPres: "Present", attBtnAbs: "Absent", tasksTitle: "Global Tasks", tasksSub: "All tasks from all subjects in one place.", gradesTitle: "Grades Average", gradesSub: "Enter grades (e.g. 5, 4.5, 3).", gradesEmpty: "No grades (e.g. 4.5, 3)...", radarTitle: "Exam Radar", radarBtn: "Let's study!", radarEmpty: "All clear! No exams", dirTitle: "System Directory", dirLec: "Lecturers", dirRoom: "Rooms", tabTasks: "Tasks", tabNotes: "Notes", tabAtt: "Attendance", tabForum: "Forum", btnMail: "Send Email", btnExamSet: "Set Exam", btnExamDel: "Remove Exam", btnCancel: "Cancel Class", btnRestore: "Restore Class", stampCancel: "CANCELLED", stampCancelAdmin: "CANCELLED (ADMIN)", badgeExam: "EXAM", badgeExamAdmin: "EXAM (ANNOUNCEMENT)", specificDates: "Only on selected dates", sendPlaceholder: "Type a message...", hubEmpty: "Click the button to connect...", themeLight: "Light", themeDark: "Dark", themeMatrix: "Matrix", themeCad: "CAD Engineer", themeUwu: "UWU Anime", themeAns: "ANS Academy", tasksEmpty: "No tasks! You can relax.", tabSubjects: "Subjects", tabStudents: "Students (DM)" }
};

// ==========================================
// FUNKCJA ZAPOBIEGAJĄCA ATAKOM XSS
// ==========================================
function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, function(tag) {
        const charsToReplace = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' };
        return charsToReplace[tag] || tag;
    });
}

let currentLang = localStorage.getItem('smartPlanLang') || 'pl';

function t(key) { return TRANSLATIONS[currentLang][key] || key; }
function t_sub(sub) { return currentLang === 'en' ? (SUBJECT_DICT[sub] || sub) : sub; }
function setLanguage(lang) {
    currentLang = lang; localStorage.setItem('smartPlanLang', lang);
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.remove('active'));
    document.getElementById(`lang-btn-${lang}`).classList.add('active');
    applyTranslations();
    renderCalendar(); updateDashboard();
}
function applyTranslations() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if(el.tagName === 'INPUT') el.placeholder = t(key);
        else el.innerText = t(key);
    });
}

firebase.initializeApp(firebaseConfig); const db = firebase.firestore(); const auth = firebase.auth();

let globalAdminEvents = { cancelled: {}, exams: {} };
db.collection("global_state").doc("events").onSnapshot(doc => {
    if (doc.exists) {
        globalAdminEvents = doc.data();
        if(!globalAdminEvents.cancelled) globalAdminEvents.cancelled = {};
        if(!globalAdminEvents.exams) globalAdminEvents.exams = {};
        renderCalendar(); updateDashboard();
    }
});

let scheduleData = JSON.parse(localStorage.getItem('smartPlanData')) || defaultData;
['TN', 'TP'].forEach(w => { for(let d=0; d<5; d++) { scheduleData[w][d].forEach(cls => { if(!cls.todo) cls.todo = []; if(!cls.cancelledDates) cls.cancelledDates = []; if(!cls.exams) cls.exams = []; if(!cls.attendedDates) cls.attendedDates = []; if(!cls.absentDates) cls.absentDates = []; }); } });

function saveData() { 
    localStorage.setItem('smartPlanData', JSON.stringify(scheduleData)); 
    if(auth.currentUser) {
        db.collection("users").doc(auth.currentUser.uid).collection("private").doc("main")
          .set({ plan: scheduleData }, { merge: true });
    }
    updateUserPresence();
}

let gradesData = JSON.parse(localStorage.getItem('smartPlanGrades')) || {};
function saveGrades() { 
    localStorage.setItem('smartPlanGrades', JSON.stringify(gradesData)); 
    if(auth.currentUser) {
        db.collection("users").doc(auth.currentUser.uid).collection("private").doc("main")
          .set({ grades: gradesData }, { merge: true });
    }
    updateUserPresence();
}

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then(reg => console.log('Service Worker zarejestrowany pomyślnie!', reg))
            .catch(err => console.log('Błąd rejestracji Service Workera:', err));
    });
}

if (localStorage.getItem('smartPlanVersion') !== APP_VERSION) { document.getElementById('update-banner').style.display = 'block'; }
function applyUpdate() { localStorage.setItem('smartPlanVersion', APP_VERSION); window.location.reload(true); }

function getSmartStartMonday() { let now = new Date(); let day = now.getDay(); if (day === 6) now.setDate(now.getDate() + 2); if (day === 0) now.setDate(now.getDate() + 1); return getMonday(now); }
function getMonday(d) { d = new Date(d); var day = d.getDay(), diff = d.getDate() - day + (day == 0 ? -6 : 1); return new Date(d.setDate(diff)); }
function formatDateStr(dateObj) { const tzOffset = dateObj.getTimezoneOffset() * 60000; return (new Date(dateObj - tzOffset)).toISOString().split('T')[0]; }
function getWeekTypeForDate(dateObj) { const mondayStr = formatDateStr(getMonday(dateObj)); if (tnWeeksStarts.includes(mondayStr)) return 'TN'; if (tpWeeksStarts.includes(mondayStr)) return 'TP'; return 'INNY'; }
function checkSpecialDay(dateStr) { if (freeDays.includes(dateStr)) return { type: 'WOLNE', title: 'Dzień wolny od zajęć 🌴' }; for (let s of sessionRanges) { if (dateStr >= s.start && dateStr <= s.end) return { type: 'SESJA', title: s.title }; } return null; }

let viewDateStart = getSmartStartMonday();

let pickerCurrentDate = new Date();
function openCustomDatePicker() { pickerCurrentDate = new Date(viewDateStart); renderCustomDatePicker(); document.getElementById('customDatePickerModal').style.display = 'flex'; }
function closeCustomDatePicker() { document.getElementById('customDatePickerModal').style.display = 'none'; }
function changePickerMonth(offset) { pickerCurrentDate.setMonth(pickerCurrentDate.getMonth() + offset); renderCustomDatePicker(); }
function renderCustomDatePicker() { const grid = document.getElementById('pickerDaysGrid'); grid.innerHTML = ''; const monthNames = ['Styczeń', 'Luty', 'Marzec', 'Kwiecień', 'Maj', 'Czerwiec', 'Lipiec', 'Sierpień', 'Wrzesień', 'Październik', 'Listopad', 'Grudzień']; const year = pickerCurrentDate.getFullYear(); const month = pickerCurrentDate.getMonth(); document.getElementById('pickerMonthYear').innerText = `${monthNames[month]} ${year}`; const firstDayOfMonth = new Date(year, month, 1); const lastDayOfMonth = new Date(year, month + 1, 0); const daysInMonth = lastDayOfMonth.getDate(); let firstDayOfWeek = firstDayOfMonth.getDay(); firstDayOfWeek = firstDayOfWeek === 0 ? 6 : firstDayOfWeek - 1; const prevMonthLastDay = new Date(year, month, 0).getDate(); const todayStr = formatDateStr(new Date()); for (let i = firstDayOfWeek - 1; i >= 0; i--) { grid.innerHTML += `<div class="picker-day muted">${prevMonthLastDay - i}</div>`; } for (let i = 1; i <= daysInMonth; i++) { const cellDate = new Date(year, month, i); const cellDateStr = formatDateStr(cellDate); const dMonday = getMonday(cellDate); const isSelectedWeek = formatDateStr(dMonday) === formatDateStr(viewDateStart); const isToday = cellDateStr === todayStr; let classes = 'picker-day'; if (isToday) classes += ' current'; else if (isSelectedWeek) classes += ' selected'; grid.innerHTML += `<div class="${classes}" onclick="selectDateFromCustomPicker('${cellDateStr}')">${i}</div>`; } const totalCells = firstDayOfWeek + daysInMonth; const remainingCells = (7 - (totalCells % 7)) % 7; for (let i = 1; i <= remainingCells; i++) { grid.innerHTML += `<div class="picker-day muted">${i}</div>`; } }
function selectDateFromCustomPicker(dateStr) { viewDateStart = getMonday(new Date(dateStr)); renderCalendar(); closeCustomDatePicker(); }

function renderCalendar() {
    const calendar = document.getElementById('calendar'); calendar.innerHTML = '';
    const daysNames = [t('mon'), t('tue'), t('wed'), t('thu'), t('fri')];
    const typeLabels = { 'wyklad': t('lec'), 'cwiczenia': t('exe'), 'lab': t('lab'), 'projekt': t('proj'), 'seminarium': t('sem_class'), 'inne': t('other') };
    
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const now = new Date(); const todayStr = formatDateStr(now); const currentMins = now.getHours() * 60 + now.getMinutes();
    const friday = new Date(viewDateStart); friday.setDate(viewDateStart.getDate() + 4);
    document.getElementById('week-label').innerText = `${viewDateStart.getDate()}.${viewDateStart.getMonth()+1} - ${friday.getDate()}.${friday.getMonth()+1}.${friday.getFullYear()}`;

    for (let i = 0; i < 5; i++) {
        const column = document.createElement('div'); column.className = 'day-column';
        const columnDateObj = new Date(viewDateStart); columnDateObj.setDate(viewDateStart.getDate() + i);
        const columnDateStr = formatDateStr(columnDateObj); const weekType = getWeekTypeForDate(columnDateObj);
        const specialDay = checkSpecialDay(columnDateStr);
        const weekTypeLabel = specialDay ? specialDay.type : (weekType === 'INNY' ? t('noClass') : (weekType === 'TN' ? t('tn') : t('tp')));
        let colorMarker = '#9ca3af'; if (specialDay && specialDay.type === 'WOLNE') colorMarker = '#3b82f6'; else if (specialDay && specialDay.type === 'SESJA') colorMarker = '#f59e0b'; else if (weekType === 'TN') colorMarker = '#3b82f6'; else if (weekType === 'TP') colorMarker = '#10b981';

        column.innerHTML = `<div class="day-title" style="${columnDateStr === todayStr ? 'background: rgba(79, 70, 229, 0.1); border-radius: 8px;' : ''}">${daysNames[i]}<br><span class="date-subtitle">${columnDateObj.getDate()}.${columnDateObj.getMonth()+1}.${columnDateObj.getFullYear()}</span><span class="week-type-indicator" style="color: ${colorMarker}; border: 1px solid ${colorMarker}">${weekTypeLabel}</span></div>`;
        
        if (specialDay) {
            column.innerHTML += `<div class="empty-gif-container"><img src="https://media.giphy.com/media/l41lFw057lAJQMwg0/giphy.gif" alt="Wolne"><p>${specialDay.title}</p></div>`;
        } else if (weekType !== 'INNY') {
            let classes = scheduleData[weekType][i]; let classesRendered = 0;
            let sortedClasses = classes.map((c, origIdx) => ({...c, origIdx})).sort((a, b) => a.start.localeCompare(b.start));
            let prevEndMins = null;
            
            sortedClasses.forEach((cls, rIndex) => {
                let classIndex = cls.origIdx;
                const cardId = `${weekType}-${i}-${classIndex}`;

                if (cls.specificDates && cls.specificDates.length > 0 && !cls.specificDates.includes(columnDateStr)) return; 
                if (searchTerm && !cls.subject.toLowerCase().includes(searchTerm) && !(cls.room && cls.room.toLowerCase().includes(searchTerm)) && !(cls.lecturer && cls.lecturer.toLowerCase().includes(searchTerm))) return; 

                const startMins = parseInt(cls.start.split(':')[0])*60 + parseInt(cls.start.split(':')[1]);
                const endMins = parseInt(cls.end.split(':')[0])*60 + parseInt(cls.end.split(':')[1]);
                
                if (prevEndMins !== null && (startMins - prevEndMins) >= 45 && !searchTerm) {
                    let gapMins = startMins - prevEndMins; let h = Math.floor(gapMins / 60); let m = gapMins % 60;
                    const okienkoDiv = document.createElement('div'); okienkoDiv.className = 'okienko-card';
                    okienkoDiv.innerHTML = `<i class="fas fa-coffee"></i> ${t('window')}: ${h > 0 ? `${h}h ${m}m` : `${m}m`}`;
                    column.appendChild(okienkoDiv);
                }
                prevEndMins = endMins; classesRendered++;
                
                let isOngoing = (columnDateStr === todayStr && currentMins >= startMins && currentMins <= endMins);
                let progressPercent = isOngoing ? ((currentMins - startMins) / (endMins - startMins)) * 100 : 0;
                
                let isCancelledLocal = cls.cancelledDates && cls.cancelledDates.includes(columnDateStr);
                let isCancelledGlobal = globalAdminEvents.cancelled[cardId] && globalAdminEvents.cancelled[cardId].includes(columnDateStr);
                let isCancelled = isCancelledLocal || isCancelledGlobal;

                let hasExamLocal = cls.exams && cls.exams.includes(columnDateStr);
                let hasExamGlobal = globalAdminEvents.exams[cardId] && globalAdminEvents.exams[cardId].includes(columnDateStr);
                let hasExam = hasExamLocal || hasExamGlobal;

                let hasAttended = cls.attendedDates && cls.attendedDates.includes(columnDateStr); let hasAbsent = cls.absentDates && cls.absentDates.includes(columnDateStr);
                let totalAttended = cls.attendedDates ? cls.attendedDates.length : 0; let totalAbsent = cls.absentDates ? cls.absentDates.length : 0;
                let totalPast = totalAttended + totalAbsent; let freq = totalPast === 0 ? 0 : Math.round((totalAttended / totalPast) * 100);
                
                let todoHtml = (cls.todo || []).map((t_item, tid) => `
                    <div class="todo-item ${t_item.done ? 'done' : ''}">
                        <input type="checkbox" ${t_item.done ? 'checked' : ''} onchange="toggleTodo('${weekType}', ${i}, ${classIndex}, ${tid}, event)">
                        <div contenteditable="true" class="todo-input" onblur="updateTodoText('${weekType}', ${i}, ${classIndex}, ${tid}, this.innerText)" onclick="event.stopPropagation()">${t_item.text}</div>
                        <button class="btn-icon" style="color:var(--danger);" onclick="deleteTodo('${weekType}', ${i}, ${classIndex}, ${tid}, event)"><i class="fas fa-times"></i></button>
                    </div>`).join('');
                
                const card = document.createElement('div');
                card.className = `class-card ${isOngoing && !isCancelled ? 'ongoing' : ''} ${isCancelled ? 'cancelled' : ''}`;
                card.onclick = () => togglePanel(`panel-${cardId}`);
                card.style.animationDelay = `${rIndex * 0.05}s`;
                
                card.innerHTML = `
                    ${isCancelled ? `<div class="cancelled-stamp ${isCancelledGlobal ? 'global' : ''}">${isCancelledGlobal ? t('stampCancelAdmin') : t('stampCancel')}</div>` : ''}
                    <div class="card-header-tags">
                        <span class="type-badge tag-${cls.type || 'inne'}">${typeLabels[cls.type || 'inne']}</span>
                        ${hasExam ? `<span class="${hasExamGlobal ? 'kolokwium-global-badge' : 'kolokwium-badge'}"><i class="fas ${hasExamGlobal ? 'fa-globe' : 'fa-exclamation-triangle'}"></i> ${hasExamGlobal ? t('badgeExamAdmin') : t('badgeExam')}</span>` : ''}
                        <div class="card-actions"><button class="btn-icon" style="border:1px solid var(--toggle-bg) !important;" onclick="editClass('${weekType}', ${i}, ${classIndex}, event)" title="Edytuj"><i class="fas fa-pencil-alt"></i></button></div>
                    </div>
                    <div class="class-time"><i class="far fa-clock"></i> ${cls.start} - ${cls.end} ${isOngoing && !isCancelled ? '<span style="color:var(--success); font-size:0.8rem; margin-left:5px;">(Trwa)</span>' : ''}</div>
                    <div class="class-subject">${t_sub(cls.subject)}</div>
                    <div class="class-details">
                        ${cls.room ? `<span><i class="fas fa-map-marker-alt"></i> ${t('room')}: ${cls.room}</span>` : ''}
                        ${cls.lecturer ? `<span><i class="fas fa-user-tie"></i> ${cls.lecturer}</span>` : ''}
                    </div>
                    ${cls.specificDates && cls.specificDates.length > 0 ? `<span style="font-size:0.75rem; color:var(--primary); font-weight:bold; margin-top:3px;"><i class="fas fa-calendar-check"></i> ${t('specificDates')}</span>` : ''}
                    <div class="progress-container"><div class="progress-bar" style="width: ${progressPercent}%;"></div></div>
                    
                    <div class="card-expanded-panel" id="panel-${cardId}" onclick="event.stopPropagation()">
                        <div class="panel-tabs">
                            <button class="tab-btn active" onclick="switchTab(event, 'tab-todo-${cardId}')">${t('tabTasks')}</button>
                            <button class="tab-btn" onclick="switchTab(event, 'tab-notes-${cardId}')">${t('tabNotes')}</button>
                            <button class="tab-btn" onclick="switchTab(event, 'tab-att-${cardId}')">${t('tabAtt')}</button>
                            <button class="tab-btn" onclick="switchTab(event, 'tab-chat-${cardId}'); listenForMessages('${cardId}')"><i class="fab fa-google"></i> ${t('tabForum')}</button>
                        </div>
                        <div class="panel-content active" id="tab-todo-${cardId}">
                            <div id="todo-list-${cardId}">${todoHtml}</div>
                            <button class="add-todo-btn" onclick="addTodo('${weekType}', ${i}, ${classIndex}, event)">+ ${t('add')} zadanie</button>
                        </div>
                        <div class="panel-content" id="tab-notes-${cardId}">
                            <textarea class="notes-textarea" placeholder="..." onchange="saveNote('${weekType}', ${i}, ${classIndex}, event)">${cls.notes || ''}</textarea>
                        </div>
                        <div class="panel-content" id="tab-att-${cardId}">
                            <div style="text-align: center; padding: 15px; background: var(--bg-color); border-radius: 10px; margin-top: 10px;">
                                <p style="font-size: 0.85rem; color: var(--text-muted); margin-bottom: 10px; font-weight: bold;">Zaznacz w tym dniu (${columnDateStr}):</p>
                                <div style="display: flex; gap: 10px; justify-content: center; margin-bottom: 15px; flex-wrap: wrap;">
                                    <button class="btn ${hasAttended ? '' : 'btn-outline'}" style="${hasAttended ? 'background: var(--success); color: white; border-color: var(--success);' : 'border-color: var(--success); color: var(--success);'}" onclick="markAttendance('${weekType}', ${i}, ${classIndex}, '${columnDateStr}', 'present', event)"><i class="fas fa-check"></i> ${t('attBtnPres')}</button>
                                    <button class="btn ${hasAbsent ? '' : 'btn-outline'}" style="${hasAbsent ? 'background: var(--danger); color: white; border-color: var(--danger);' : 'border-color: var(--danger); color: var(--danger);'}" onclick="markAttendance('${weekType}', ${i}, ${classIndex}, '${columnDateStr}', 'absent', event)"><i class="fas fa-times"></i> ${t('attBtnAbs')}</button>
                                </div>
                                <div style="border-top: 1px dashed var(--toggle-bg); padding-top: 10px; font-size: 0.85rem; color: var(--text-muted);">
                                    <strong>${t('attGeneral')}: <span style="color: ${freq >= 50 ? 'var(--success)' : 'var(--danger)'}; font-size: 1.1rem; font-weight: 900;">${freq}%</span></strong>
                                    <div style="margin-top: 5px;">${t('attPres')}: ${totalAttended} | ${t('attAbs')}: ${totalAbsent}</div>
                                </div>
                            </div>
                        </div>
                        <div class="panel-content" id="tab-chat-${cardId}">
                            <div class="chat-box" id="chat-box-${cardId}">...</div>
                            <div style="display: flex; gap: 5px; margin-top: 8px;">
                                <button class="btn-icon" onclick="toggleEmojiPicker('chat-in-${cardId}')"><i class="far fa-smile" style="color:var(--text-muted); font-size:1.5rem;"></i></button>
                                <input type="text" id="chat-in-${cardId}" placeholder="..." style="flex:1; min-width:0; padding:8px; border-radius:6px; border:1px solid var(--toggle-bg); font-size:0.8rem;" onkeypress="if(event.key === 'Enter') sendChat('${cardId}', event)">
                                <button class="btn-icon" style="background:var(--primary) !important; color:white; width:36px; height:36px;" onclick="sendChat('${cardId}', event)"><i class="fas fa-paper-plane"></i></button>
                            </div>
                        </div>
                        <div class="expanded-actions">
                            <button class="btn-mail" onclick="sendMail('${cls.email}', '${cls.subject}', event)"><i class="fas fa-envelope"></i> ${t('btnMail')}</button>
                            <button class="btn-attendance" style="${hasExam ? 'background: rgba(239, 68, 68, 0.1); color: var(--danger);' : ''}" onclick="markExam('${weekType}', ${i}, ${classIndex}, '${columnDateStr}', event)"><i class="fas ${hasExam ? 'fa-times' : 'fa-bullseye'}"></i> ${hasExam ? t('btnExamDel') : t('btnExamSet')}</button>
                            <button class="btn-cancel-class" onclick="toggleCancelClass('${weekType}', ${i}, ${classIndex}, '${columnDateStr}', event)"><i class="fas ${isCancelled ? 'fa-undo' : 'fa-ban'}"></i> ${isCancelled ? t('btnRestore') : t('btnCancel')}</button>
                        </div>
                    </div>
                `;
                column.appendChild(card);
            });
            if (classesRendered === 0) column.innerHTML += `<div class="empty-gif-container"><img src="https://media.giphy.com/media/dzaUX7CAG0Ihi/giphy.gif" alt="Party"><p>${t('emptyDay')}</p></div>`;
        } else column.innerHTML += `<div class="empty-gif-container"><img src="https://media.giphy.com/media/dzaUX7CAG0Ihi/giphy.gif" alt="Party"><p>${t('emptyDay')}</p></div>`;
        calendar.appendChild(column);
    }
}

function togglePanel(panelId) { document.getElementById(panelId).classList.toggle('active'); }
function switchTab(event, tabId) { event.stopPropagation(); const panel = event.target.closest('.card-expanded-panel'); panel.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active')); panel.querySelectorAll('.panel-content').forEach(content => content.classList.remove('active')); event.target.classList.add('active'); document.getElementById(tabId).classList.add('active'); }
function addTodo(w, d, c, e) { e.stopPropagation(); scheduleData[w][d][c].todo.push({ text: "...", done: false }); saveData(); renderCalendar(); }
function toggleTodo(w, d, c, t_idx, e) { scheduleData[w][d][c].todo[t_idx].done = e.target.checked; saveData(); renderCalendar(); }
function updateTodoText(w, d, c, t_idx, val) { scheduleData[w][d][c].todo[t_idx].text = val; saveData(); }
function deleteTodo(w, d, c, t_idx, e) { e.stopPropagation(); scheduleData[w][d][c].todo.splice(t_idx, 1); saveData(); renderCalendar(); }
function saveNote(w, d, c, e) { scheduleData[w][d][c].notes = e.target.value; saveData(); }
function sendMail(email, sub, e) { e.stopPropagation(); if (!email) return alert("Brak maila."); window.location.href = `mailto:${email}?subject=${sub}`; }

function toggleCancelClass(w, d, c, dateStr, e) { 
    e.stopPropagation(); 
    const user = auth.currentUser;
    const isAdmin = user && ADMIN_UIDS.includes(user.uid);
    const cardId = `${w}-${d}-${c}`;
    const cls = scheduleData[w][d][c];
    
    if (isAdmin) {
        if (confirm("👑 Zalogowano jako Starosta (Admin)!\n\nCzy chcesz odwołać te zajęcia GLOBALNIE dla wszystkich studentów na roku?\n\n[OK] - Zmień Globalnie\n[Anuluj] - Zmień tylko w moim telefonie")) {
            let currentCancelled = globalAdminEvents.cancelled[cardId] || [];
            if (currentCancelled.includes(dateStr)) currentCancelled = currentCancelled.filter(x => x !== dateStr); else currentCancelled.push(dateStr);
            db.collection("global_state").doc("events").set({ cancelled: { ...globalAdminEvents.cancelled, [cardId]: currentCancelled } }, { merge: true });
            return; 
        }
    } 
    else if (user) {
        if (confirm("Czy chcesz zaproponować Adminowi zmianę dla CAŁEGO ROKU?\n\n[OK] - Wyślij prośbę do Starosty (Zaproponuj Globalnie)\n[Anuluj] - Zmień tylko na moim telefonie")) {
            db.collection("admin_requests").add({ 
                type: "cancel", 
                cardId: cardId, 
                dateStr: dateStr, 
                subject: cls.subject, 
                requester: user.displayName || "Student", 
                uid: user.uid, 
                status: "pending", 
                timestamp: firebase.firestore.FieldValue.serverTimestamp() 
            });
            alert("Wysłano prośbę do Admina! Czeka na zatwierdzenie.");
        }
    }

    if (cls.cancelledDates.includes(dateStr)) cls.cancelledDates = cls.cancelledDates.filter(dx => dx !== dateStr); else cls.cancelledDates.push(dateStr); 
    saveData(); renderCalendar(); 
}

function markExam(w, d, c, dateStr, e) { 
    if(e) e.stopPropagation(); 
    const user = auth.currentUser;
    const isAdmin = user && ADMIN_UIDS.includes(user.uid);
    const cardId = `${w}-${d}-${c}`;
    const cls = scheduleData[w][d][c];

    if (isAdmin) {
        if (confirm("👑 Zalogowano jako Starosta (Admin)!\n\nCzy chcesz ustalić to Kolokwium GLOBALNIE dla wszystkich studentów na roku?\n\n[OK] - Ustal Globalnie\n[Anuluj] - Ustal tylko dla siebie")) {
            let currentExams = globalAdminEvents.exams[cardId] || [];
            if (currentExams.includes(dateStr)) currentExams = currentExams.filter(x => x !== dateStr); else currentExams.push(dateStr);
            db.collection("global_state").doc("events").set({ exams: { ...globalAdminEvents.exams, [cardId]: currentExams } }, { merge: true });
            return; 
        }
    }
    else if (user) {
        if (confirm("Czy chcesz zaproponować Adminowi ustawienie tego Kolokwium dla CAŁEGO ROKU?\n\n[OK] - Wyślij prośbę do Starosty (Zaproponuj Globalnie)\n[Anuluj] - Zmień tylko na moim telefonie")) {
            db.collection("admin_requests").add({ 
                type: "exam", 
                cardId: cardId, 
                dateStr: dateStr, 
                subject: cls.subject, 
                requester: user.displayName || "Student", 
                uid: user.uid, 
                status: "pending", 
                timestamp: firebase.firestore.FieldValue.serverTimestamp() 
            });
            alert("Wysłano prośbę do Admina! Czeka na zatwierdzenie.");
        }
    }

    let isLocalExam = cls.exams.includes(dateStr);
    if (isLocalExam) cls.exams = cls.exams.filter(dx => dx !== dateStr); else cls.exams.push(dateStr); 
    saveData(); renderCalendar(); 
}

function markAttendance(w, d, c, dateStr, status, e) { if(e) e.stopPropagation(); let cls = scheduleData[w][d][c]; let isPres = cls.attendedDates.includes(dateStr); let isAbs = cls.absentDates.includes(dateStr); cls.attendedDates = cls.attendedDates.filter(x => x !== dateStr); cls.absentDates = cls.absentDates.filter(x => x !== dateStr); if(status === 'present' && !isPres) cls.attendedDates.push(dateStr); if(status === 'absent' && !isAbs) cls.absentDates.push(dateStr); saveData(); renderCalendar(); openAttendanceModal(); }

function openAdminPanel() {
    toggleSidebar();
    const list = document.getElementById('admin-requests-list');
    list.innerHTML = '<div class="empty-gif-container"><img src="https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif" alt="Szukam"><p>Szukam...</p></div>';
    document.getElementById('adminPanelModal').style.display = 'flex';

    db.collection("admin_requests").where("status", "==", "pending").onSnapshot(snap => {
        if(snap.empty) { list.innerHTML = '<div class="empty-gif-container"><img src="https://media.giphy.com/media/l41lFw057lAJQMwg0/giphy.gif" alt="Czysto"><p>Brak nowych wniosków!</p></div>'; return; }
        list.innerHTML = '';
        snap.forEach(doc => {
            const req = doc.data(); const reqId = doc.id;
            const typeLabel = req.type === 'exam' ? '🔥 Kolokwium' : '🚫 Odwołanie';
            const typeColor = req.type === 'exam' ? 'var(--danger)' : 'var(--text-muted)';
            list.innerHTML += `
                <div class="request-card" style="background:var(--bg-color); padding:10px; border-radius:10px; margin-bottom:10px; border-left:4px solid var(--primary);">
                    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom: 5px;">
                        <strong style="color:var(--primary); font-size:0.85rem;"><i class="fas fa-user"></i> ${req.requester}</strong>
                        <span style="font-size:0.75rem; background:var(--toggle-bg); padding:2px 6px; border-radius:6px;">${req.dateStr}</span>
                    </div>
                    <div style="font-weight:bold; margin-bottom:3px;">${req.subject}</div>
                    <div style="font-size:0.8rem; color:${typeColor}; font-weight:bold; margin-bottom:10px;">Proponuje: ${typeLabel}</div>
                    <div style="display:flex; gap:10px;">
                        <button class="btn btn-outline" style="flex:1; padding:5px; border-color:var(--success); color:var(--success);" onclick="resolveRequest('${reqId}', '${req.type}', '${req.cardId}', '${req.dateStr}', true)"><i class="fas fa-check"></i> Zatwierdź</button>
                        <button class="btn btn-outline" style="flex:1; padding:5px; border-color:var(--danger); color:var(--danger);" onclick="resolveRequest('${reqId}', false, false, false, false)"><i class="fas fa-times"></i> Odrzuć</button>
                    </div>
                </div>`;
        });
    });
}

function resolveRequest(reqId, type, cardId, dateStr, isApproved) {
    if (isApproved) {
        if (type === 'cancel') {
            let current = globalAdminEvents.cancelled[cardId] || [];
            if (!current.includes(dateStr)) current.push(dateStr);
            db.collection("global_state").doc("events").set({ cancelled: { ...globalAdminEvents.cancelled, [cardId]: current } }, { merge: true });
        } else if (type === 'exam') {
            let current = globalAdminEvents.exams[cardId] || [];
            if (!current.includes(dateStr)) current.push(dateStr);
            db.collection("global_state").doc("events").set({ exams: { ...globalAdminEvents.exams, [cardId]: current } }, { merge: true });
        }
    }
    db.collection("admin_requests").doc(reqId).update({ status: isApproved ? "approved" : "rejected" });
}

function openRadar() {
    toggleSidebar(); const radarList = document.getElementById('radar-list'); radarList.innerHTML = '';
    const now = new Date(); now.setHours(0,0,0,0); let examsFound = [];
    ['TN', 'TP'].forEach(week => { 
        for(let d=0; d<5; d++) { 
            scheduleData[week][d].forEach((cls, classIndex) => { 
                let cardId = `${week}-${d}-${classIndex}`;
                let allExams = new Set([...(cls.exams || [])]);
                if (globalAdminEvents.exams[cardId]) { globalAdminEvents.exams[cardId].forEach(ex => allExams.add(ex)); }
                allExams.forEach(examDateStr => { 
                    const exDate = new Date(examDateStr); 
                    if(exDate >= now) { 
                        const diffDays = Math.ceil(Math.abs(exDate - now) / (1000 * 60 * 60 * 24)); 
                        const isGlobal = globalAdminEvents.exams[cardId] && globalAdminEvents.exams[cardId].includes(examDateStr);
                        examsFound.push({ w: week, d: d, cIdx: classIndex, subject: cls.subject, date: examDateStr, days: diffDays, isGlobal: isGlobal }); 
                    } 
                }); 
            }); 
        } 
    });
    examsFound.sort((a,b) => a.days - b.days);
    if(examsFound.length === 0) radarList.innerHTML = `<div class="empty-gif-container"><img src="https://media.giphy.com/media/l0HlHFRbmaZtBRhXG/giphy.gif" alt="Relax"><p>${t('radarEmpty')}</p></div>`;
    else examsFound.forEach(ex => { 
        let c = ex.days <= 3 ? 'var(--danger)' : (ex.days <= 7 ? '#f59e0b' : 'var(--primary)'); 
        radarList.innerHTML += `
            <div style="background: var(--bg-color); border-left: 4px solid ${c}; padding: 12px; border-radius: 8px;">
                <div style="font-weight:bold; font-size: 0.95rem; margin-bottom: 5px; display:flex; justify-content:space-between; align-items:center;">
                    <span>${t_sub(ex.subject)} ${ex.isGlobal ? '<span style="color:#8b5cf6; font-size:0.7rem; margin-left:5px;"><i class="fas fa-globe"></i> ADMIN</span>' : ''}</span>
                    <button class="btn-icon" style="color:var(--danger); padding:0; width: 24px; height: 24px; display: flex; align-items: center; justify-content: center; box-shadow:none;" onclick="markExam('${ex.w}', ${ex.d}, ${ex.cIdx}, '${ex.date}', event); setTimeout(openRadar, 300);"><i class="fas fa-times"></i></button>
                </div>
                <div style="font-size: 0.85rem; color: var(--text-muted); display:flex; justify-content:space-between; align-items: center;">
                    <span><i class="far fa-calendar-alt"></i> ${ex.date}</span>
                    <span style="color: ${c}; font-weight:900; background: rgba(0,0,0,0.05); padding: 3px 8px; border-radius: 6px;">${ex.days === 0 ? 'DZISIAJ!' : `${ex.days} dni`}</span>
                </div>
            </div>`; 
    });
    document.getElementById('radarModal').style.display = 'flex';
}

function calculateGlobalStats() {
    let allGrades = [];
    Object.values(gradesData).forEach(str => {
        if(str) {
            let nums = str.replace(/,/g, '.').split(/[\s;]+/).map(Number).filter(n => !isNaN(n) && n >= 2 && n <= 5);
            allGrades = allGrades.concat(nums);
        }
    });
    let globalAvg = allGrades.length > 0 ? (allGrades.reduce((a,b)=>a+b,0) / allGrades.length).toFixed(2) : '-';

    let totalAtt = 0; let totalAbs = 0;
    ['TN', 'TP'].forEach(w => {
        for(let d=0; d<5; d++) {
            (scheduleData[w][d] || []).forEach(cls => {
                totalAtt += (cls.attendedDates ? cls.attendedDates.length : 0);
                totalAbs += (cls.absentDates ? cls.absentDates.length : 0);
            });
        }
    });
    let globalAtt = (totalAtt + totalAbs) > 0 ? Math.round((totalAtt / (totalAtt + totalAbs)) * 100) + '%' : '-';

    return { avg: globalAvg, att: globalAtt };
}

function updateUserPresence() {
    if(!auth.currentUser) return;
    const uid = auth.currentUser.uid;
    const now = new Date();
    const todayStr = formatDateStr(now);
    
    db.collection("users").doc(uid).get().then(doc => {
        let data = doc.exists ? doc.data() : {};
        let lastActive = data.lastActive || "";
        let streak = data.streak || 0;

        if (lastActive !== todayStr) {
            let yesterday = new Date(); yesterday.setDate(yesterday.getDate() - 1);
            if (lastActive === formatDateStr(yesterday)) {
                streak += 1; 
            } else {
                streak = 1; 
            }
        }

        let stats = calculateGlobalStats();
        let safeName = auth.currentUser.displayName ? auth.currentUser.displayName.split(' ')[0] : (auth.currentUser.email ? auth.currentUser.email.split('@')[0] : "Student");

        db.collection("users").doc(uid).set({
            displayName: safeName,
            photoURL: auth.currentUser.photoURL || '',
            lastActive: todayStr,
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            streak: streak,
            globalAvg: stats.avg,
            globalAtt: stats.att
        }, { merge: true }).then(() => {
            document.getElementById('global-stats-banner').style.display = 'flex';
            document.getElementById('dash-avg').innerText = stats.avg;
            document.getElementById('dash-att').innerText = stats.att;
            document.getElementById('dash-streak').innerText = streak;
        });
    }).catch(e => console.error("Presence error:", e));
}

function updateDashboard() {
    const now = new Date(); const todayStr = formatDateStr(now); const currentMins = now.getHours() * 60 + now.getMinutes(); const currentSecs = now.getSeconds();
    const weekType = getWeekTypeForDate(now); const currentDayIndex = now.getDay() - 1; const specialDay = checkSpecialDay(todayStr);
    let semPercent = ((now.getTime() - semesterStart) / (semesterEnd - semesterStart)) * 100; if (semPercent < 0) semPercent = 0; if (semPercent > 100) semPercent = 100;
    document.getElementById('semester-bar').style.width = semPercent.toFixed(1) + '%'; 
    document.getElementById('semester-text').innerText = `${t('sem')}: ${semPercent.toFixed(1)}%`;

    let nextClass = null; let timeToNextMins = Infinity;
    if (!specialDay && weekType !== 'INNY' && currentDayIndex >= 0 && currentDayIndex <= 4) {
        let sortedClasses = scheduleData[weekType][currentDayIndex].map((cls, idx) => ({...cls, origIdx: idx})).sort((a, b) => a.start.localeCompare(b.start));
        
        for(let cls of sortedClasses) {
            if (cls.specificDates && cls.specificDates.length > 0 && !cls.specificDates.includes(todayStr)) continue;
            let cardId = `${weekType}-${currentDayIndex}-${cls.origIdx}`;
            let isCancelledLocal = cls.cancelledDates && cls.cancelledDates.includes(todayStr);
            let isCancelledGlobal = globalAdminEvents.cancelled[cardId] && globalAdminEvents.cancelled[cardId].includes(todayStr);
            if (isCancelledLocal || isCancelledGlobal) continue;

            const startMin = parseInt(cls.start.split(':')[0])*60 + parseInt(cls.start.split(':')[1]);
            if(startMin > currentMins) { nextClass = cls; timeToNextMins = startMin - currentMins; break; }
        }
    }
    
    const w = document.getElementById('next-class-widget'), wSub = document.getElementById('widget-subtitle'), wText = document.getElementById('next-class-text'), wIcon = document.getElementById('widget-icon'), tCont = document.getElementById('widget-timer-container'), tText = document.getElementById('countdown-timer');
    if (specialDay) {
        w.style.display = 'flex'; tCont.style.display = 'none'; w.style.background = specialDay.type === 'WOLNE' ? 'var(--primary)' : 'var(--danger)'; wIcon.className = specialDay.type === 'WOLNE' ? 'fas fa-umbrella-beach' : 'fas fa-book-reader'; wSub.innerText = t('today'); wText.innerText = specialDay.title;
    } else if (nextClass) {
        w.style.display = 'flex'; tCont.style.display = 'block'; w.style.background = 'linear-gradient(135deg, var(--primary), var(--primary-hover))'; wIcon.className = 'fas fa-rocket'; wSub.innerText = t('nextClass'); wText.innerText = `${t_sub(nextClass.subject)} (${nextClass.room || 'Brak'})`;
        let hrs = Math.floor(timeToNextMins / 60); let mins = timeToNextMins % 60; let secs = 59 - currentSecs; if(secs === 59) { hrs = Math.floor((timeToNextMins-1) / 60); mins = (timeToNextMins-1) % 60; } if(hrs < 0) hrs = 0; if(mins < 0) mins = 0;
        tText.innerText = `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
        if (timeToNextMins === 2 && currentSecs === 0) { document.getElementById('mute-alert-overlay').style.display = 'flex'; if("vibrate" in navigator) navigator.vibrate([500, 200, 500, 200, 500]); }
    } else w.style.display = 'none';
}

function openGradesModal() { toggleSidebar(); const list = document.getElementById('grades-list'); list.innerHTML = ''; let subjects = new Set(); ['TN', 'TP'].forEach(w => { for(let d=0; d<5; d++) { (scheduleData[w][d] || []).forEach(cls => { let name = cls.subject.replace(/ \(wyk\.\)|\.\.\./g, '').trim(); subjects.add(name); }); } }); Array.from(subjects).sort().forEach(sub => { if(!gradesData[sub]) gradesData[sub] = ""; let gradesStr = gradesData[sub]; let avg = calculateAverage(gradesStr); list.innerHTML += `<div style="background: var(--bg-color); padding: 12px; border-radius: 10px; margin-bottom: 10px; border-left: 4px solid ${avg >= 3 ? 'var(--success)' : (avg > 0 ? 'var(--danger)' : 'var(--text-muted)')};"><div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 8px; color: var(--text-main);">${t_sub(sub)}</div><div class="grade-input-wrapper"><input type="text" placeholder="${t('gradesEmpty')}" value="${gradesStr}" onchange="updateGrade('${sub}', this.value)" style="flex: 1; padding: 8px 12px; border-radius: 6px; border: 1px solid var(--toggle-bg); background: var(--card-bg); color: var(--text-main); font-size: 0.9rem; outline: none;"><div style="font-weight: 900; color: ${avg >= 3 ? 'var(--success)' : (avg > 0 ? 'var(--danger)' : 'var(--text-muted)')}; font-size: 1.2rem; min-width: 45px; text-align: center;">${avg > 0 ? avg.toFixed(2) : '-'}</div></div></div>`; }); document.getElementById('gradesModal').style.display = 'flex'; }
function calculateAverage(str) { if(!str) return 0; let nums = str.replace(/,/g, '.').split(/[\s;]+/).map(Number).filter(n => !isNaN(n) && n >= 2 && n <= 5); if(nums.length === 0) return 0; let sum = nums.reduce((a, b) => a + b, 0); return sum / nums.length; }
function updateGrade(sub, val) { gradesData[sub] = val; saveGrades(); openGradesModal(); }

function updateGlobalTodoText(w, d, cIdx, tIdx, val) { scheduleData[w][d][cIdx].todo[tIdx].text = val; saveData(); }
function deleteGlobalTodo(w, d, cIdx, tIdx, e) { e.stopPropagation(); scheduleData[w][d][cIdx].todo.splice(tIdx, 1); saveData(); renderCalendar(); openGlobalTasksModal(); }
function toggleGlobalTodo(w, d, c, t_idx, e) { scheduleData[w][d][c].todo[t_idx].done = e.target.checked; saveData(); renderCalendar(); openGlobalTasksModal(); }

function openGlobalTasksModal() { 
    toggleSidebar(); const list = document.getElementById('global-tasks-list'); list.innerHTML = ''; let hasTasks = false; 
    ['TN', 'TP'].forEach(w => { for(let d=0; d<5; d++) { (scheduleData[w][d] || []).forEach((cls, cIdx) => { 
        if(cls.todo && cls.todo.length > 0) { 
            cls.todo.forEach((t_item, tIdx) => { 
                hasTasks = true; 
                list.innerHTML += `
                    <div class="todo-global-item">
                        <input type="checkbox" ${t_item.done ? 'checked' : ''} onchange="toggleGlobalTodo('${w}', ${d}, ${cIdx}, ${tIdx}, event)">
                        <div style="flex: 1; min-width: 0; text-align: left; display: flex; flex-direction: column;">
                            <span style="font-size: 0.7rem; color: var(--primary); font-weight: 900; text-transform: uppercase; margin-bottom: 2px;">${t_sub(cls.subject)}</span>
                            <div contenteditable="true" class="todo-input" onblur="updateGlobalTodoText('${w}', ${d}, ${cIdx}, ${tIdx}, this.innerText)" onclick="event.stopPropagation()" style="${t_item.done ? 'text-decoration: line-through; color: var(--text-muted); opacity: 0.7;' : 'color: var(--text-main);'}">${t_item.text || '...'}</div>
                        </div>
                        <button class="btn-icon" style="color:var(--danger);" onclick="deleteGlobalTodo('${w}', ${d}, ${cIdx}, ${tIdx}, event)"><i class="fas fa-times"></i></button>
                    </div>`; 
            }); 
        } 
    }); } }); 
    if(!hasTasks) list.innerHTML = `<div class="empty-gif-container"><img src="https://media.giphy.com/media/11s7Ke7jcNxCHS/giphy.gif" alt="Relax"><p>${t('tasksEmpty')}</p></div>`; 
    document.getElementById('globalTasksModal').style.display = 'flex'; 
}

function getPastDatesForClass(weekType, dayIndex, specificDates, cancelledDates, globalCancelled) {
    let pastDates = []; let iterDate = new Date(semesterStart); let today = new Date(); today.setHours(23, 59, 59, 999);
    while(iterDate <= today) {
        let dateStr = formatDateStr(iterDate); let wt = getWeekTypeForDate(iterDate); let dIdx = iterDate.getDay() - 1;
        if (!checkSpecialDay(dateStr) && wt === weekType && dIdx === dayIndex) {
            if (specificDates && specificDates.length > 0 && !specificDates.includes(dateStr)) { } 
            else if ((cancelledDates && cancelledDates.includes(dateStr)) || (globalCancelled && globalCancelled.includes(dateStr))) { } 
            else { pastDates.push(dateStr); }
        }
        iterDate.setDate(iterDate.getDate() + 1);
    }
    return pastDates;
}

function toggleAttendanceDetails(panelId) { const panel = document.getElementById(panelId); panel.style.display = panel.style.display === 'block' ? 'none' : 'block'; }

function openAttendanceModal() {
    if(document.getElementById('sidebar').classList.contains('active')) toggleSidebar();
    const list = document.getElementById('attendance-list'); list.innerHTML = '';
    let attendanceStats = {};
    const typeLabels = { 'wyklad': t('lec'), 'cwiczenia': t('exe'), 'lab': t('lab'), 'projekt': t('proj'), 'seminarium': t('sem_class'), 'inne': t('other') };
    
    ['TN', 'TP'].forEach(w => {
        for(let d=0; d<5; d++) {
            (scheduleData[w][d] || []).forEach((cls, cIdx) => {
                let name = cls.subject; 
                if (!attendanceStats[name]) attendanceStats[name] = { attended: 0, absent: 0, classes: [] };
                attendanceStats[name].attended += (cls.attendedDates ? cls.attendedDates.length : 0);
                attendanceStats[name].absent += (cls.absentDates ? cls.absentDates.length : 0);
                
                const cardId = `${w}-${d}-${cIdx}`;
                const globalCancelled = globalAdminEvents.cancelled[cardId] || [];
                let pastDates = getPastDatesForClass(w, d, cls.specificDates, cls.cancelledDates, globalCancelled);
                
                attendanceStats[name].classes.push({ w, d, cIdx, typeLabel: typeLabels[cls.type || 'inne'], pastDates: pastDates, attended: cls.attendedDates || [], absent: cls.absentDates || [] });
            });
        }
    });

    let hasData = false; let counter = 0;
    Object.keys(attendanceStats).sort().forEach(sub => {
        let stats = attendanceStats[sub]; let total = stats.attended + stats.absent;
        let percent = total > 0 ? Math.round((stats.attended / total) * 100) : 0;
        let color = percent >= 50 ? 'var(--success)' : 'var(--danger)';
        if (total === 0) color = 'var(--text-muted)';
        
        let detailsHtml = ''; let hasPastDates = false;
        stats.classes.forEach(c => {
            if(c.pastDates.length > 0) hasPastDates = true;
            c.pastDates.reverse().forEach(dateStr => {
                let isPres = c.attended.includes(dateStr); let isAbs = c.absent.includes(dateStr);
                detailsHtml += `
                    <div class="att-detail-row">
                        <span><i class="far fa-calendar-alt"></i> ${dateStr} <small style="opacity:0.6">(${c.typeLabel})</small></span>
                        <div style="display:flex; gap:10px;">
                            <button class="att-status-btn ${isPres ? 'active present' : ''}" onclick="markAttendance('${c.w}', ${c.d}, ${c.cIdx}, '${dateStr}', 'present', event)"><i class="fas fa-check-circle"></i></button>
                            <button class="att-status-btn ${isAbs ? 'active absent' : ''}" onclick="markAttendance('${c.w}', ${c.d}, ${c.cIdx}, '${dateStr}', 'absent', event)"><i class="fas fa-times-circle"></i></button>
                        </div>
                    </div>`;
            });
        });
        
        if(hasPastDates) hasData = true;
        const panelId = `att-detail-panel-${counter++}`;

        list.innerHTML += `
            <div style="background: var(--bg-color); padding: 12px; border-radius: 10px; margin-bottom: 10px; border-left: 4px solid ${color}; transition: 0.2s;">
                <div style="font-weight: bold; font-size: 0.95rem; margin-bottom: 5px; color: var(--text-main); display: flex; justify-content: space-between; cursor: pointer;" onclick="toggleAttendanceDetails('${panelId}')">
                    <span>${t_sub(sub)} <i class="fas fa-caret-down" style="font-size:0.8rem; margin-left:5px;"></i></span>
                    <span style="color: ${color}; font-weight: 900;">${total > 0 ? percent + '%' : '-'}</span>
                </div>
                <div style="font-size: 0.75rem; color: var(--text-muted); margin-bottom: 8px;">
                    ${t('attPres')}: <strong>${stats.attended}</strong> | ${t('attAbs')}: <strong>${stats.absent}</strong>
                </div>
                <div style="width: 100%; background: var(--toggle-bg); height: 8px; border-radius: 4px; overflow: hidden;">
                    <div style="height: 100%; background: ${color}; width: ${percent}%; transition: 1s ease-out;"></div>
                </div>
                <div id="${panelId}" style="display:none; margin-top: 10px; border-top: 1px dashed var(--toggle-bg); padding-top: 10px; animation: fadeIn 0.3s;">
                    ${detailsHtml || `<div style="font-size:0.8rem; color:var(--text-muted); text-align:center;">Brak zajęć.</div>`}
                </div>
            </div>`;
    });
    
    if (!hasData) list.innerHTML = '<div style="text-align:center; color: var(--text-muted); padding: 20px; font-weight: bold;"><i class="fas fa-info-circle fa-2x" style="margin-bottom:10px; display:block;"></i>Brak zajęć.</div>';
    document.getElementById('attendanceModal').style.display = 'flex';
}

function openDirectoryModal() { toggleSidebar(); switchDirectoryTab('lecturer'); document.getElementById('directoryModal').style.display = 'flex'; }

function switchDirectoryTab(tab) {
    document.getElementById('dir-tab-lecturer').classList.remove('active'); document.getElementById('dir-tab-room').classList.remove('active');
    document.getElementById(`dir-tab-${tab}`).classList.add('active');

    const list = document.getElementById('directory-list');
    const typeLabels = { 'wyklad': t('lec'), 'cwiczenia': t('exe'), 'lab': t('lab'), 'projekt': t('proj'), 'seminarium': t('sem_class'), 'inne': t('other') };
    list.innerHTML = '';

    let dataMap = {};
    ['TN', 'TP'].forEach(w => {
        for(let d=0; d<5; d++) {
            (scheduleData[w][d] || []).forEach(cls => {
                let key = tab === 'lecturer' ? cls.lecturer : cls.room;
                if (!key || key.trim() === "") key = "Nie przypisano";
                if (!dataMap[key]) dataMap[key] = new Set();
                let typeL = typeLabels[cls.type || 'inne'];
                let info = tab === 'lecturer' ? `${t_sub(cls.subject)} (${typeL})` : `${t_sub(cls.subject)} - ${cls.lecturer || 'Brak'}`;
                dataMap[key].add(info);
            });
        }
    });

    Object.keys(dataMap).sort().forEach(key => {
        let itemsHtml = Array.from(dataMap[key]).map(item => `<div class="directory-item">${item}</div>`).join('');
        let icon = tab === 'lecturer' ? 'fa-user-tie' : 'fa-door-open';
        list.innerHTML += `
            <div class="directory-card">
                <div style="font-weight: 900; color: var(--primary); font-size: 1rem;"><i class="fas ${icon}"></i> ${key}</div>
                <div style="margin-top: 10px;">${itemsHtml}</div>
            </div>`;
    });
}

// 🚨🚨🚨 POPRAWIONA FUNKCJA LOGOWANIA (REDIRECT ZAMIAST POPUP) 🚨🚨🚨
function loginForSync() { 
    const provider = new firebase.auth.GoogleAuthProvider(); 
    auth.signInWithRedirect(provider); 
}

function toggleEmojiPicker(inputId) {
    const picker = document.getElementById('global-emoji-picker');
    if (picker.style.display === 'grid') { picker.style.display = 'none'; } else { picker.style.display = 'grid'; picker.setAttribute('data-target-input', inputId); }
}
function insertEmoji(defaultInputId, emoji) {
    const picker = document.getElementById('global-emoji-picker');
    const targetId = picker.getAttribute('data-target-input') || defaultInputId;
    const input = document.getElementById(targetId);
    if (input) { input.value += emoji; input.focus(); }
    picker.style.display = 'none';
}

function deleteMessage(msgId, e) {
    e.stopPropagation();
    if(confirm("Czy na pewno chcesz usunąć tę wiadomość?")) { db.collection("chats").doc(msgId).delete(); }
}

function sendChat(cardId, e) { 
    if(e) e.stopPropagation(); 
    const user = auth.currentUser; 
    if(!user) { alert("Zaloguj się z Menu, żeby pisać na forum!"); return loginForSync(); } 
    
    const safeName = user.displayName ? user.displayName.split(' ')[0] : (user.email ? user.email.split('@')[0] : "Student");
    const inp = document.getElementById(`chat-in-${cardId}`); if(!inp.value.trim()) return; 
    db.collection("chats").add({ classId: cardId, author: safeName, text: inp.value, photoURL: user.photoURL || '', timestamp: firebase.firestore.FieldValue.serverTimestamp(), uid: user.uid }).then(() => inp.value = ''); 
}

function listenForMessages(cardId) { 
    const box = document.getElementById(`chat-box-${cardId}`); 
    if(!box) return; 
    box.innerHTML = '<div style="text-align:center; padding:10px; font-size:0.8rem; color:var(--text-muted);">Łączenie z chmurą...</div>';
    
    db.collection("chats").where("classId", "==", cardId).orderBy("timestamp", "asc").onSnapshot(snap => { 
        box.innerHTML = snap.empty ? '<div style="text-align:center; opacity:0.5; font-size: 0.8rem; padding: 10px;">Bądź pierwszy!</div>' : ''; 
        snap.forEach(doc => { 
            const m = doc.data(); const msgId = doc.id; 
            const isMe = m.uid === auth.currentUser?.uid; 
            const isAdmin = auth.currentUser && ADMIN_UIDS.includes(auth.currentUser.uid);
            const canDelete = isMe || isAdmin;
            const avatarUrl = m.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(m.author) + '&background=random';
            
            box.innerHTML += `
            <div class="chat-message-wrapper ${isMe ? 'me' : 'other'}">
                ${!isMe ? `<img src="${avatarUrl}" class="chat-avatar" alt="Avatar">` : ''}
                <div class="chat-bubble ${isMe ? 'me' : 'other'}">
                    <div style="font-size: 0.6rem; opacity: 0.7; margin-bottom: 2px; font-weight: bold; display:flex; justify-content:space-between; gap:15px;">
                        <span>${m.author}</span>
                        ${canDelete ? `<i class="fas fa-trash-alt delete-msg-btn" onclick="deleteMessage('${msgId}', event)"></i>` : ''}
                    </div>
                    ${escapeHTML(m.text)}
                </div>
                ${isMe ? `<img src="${avatarUrl}" class="chat-avatar" alt="Avatar">` : ''}
            </div>`; 
        }); 
        box.scrollTop = box.scrollHeight; 
    }, error => {
        box.innerHTML = `<div style="text-align:center; color: var(--danger); font-size: 0.8rem; padding: 10px;"><i class="fas fa-exclamation-triangle"></i> Zaloguj się przez Menu, aby czytać forum.</div>`;
    }); 
}

let currentActiveChatId = null;
let globalChatUnsubscribe = null;
let usersUnsubscribe = null;

function toggleGlobalChat() {
    const win = document.getElementById('global-chat-window');
    if (win.style.display === 'flex') {
        win.style.display = 'none';
        document.getElementById('global-emoji-picker').style.display = 'none';
        if(globalChatUnsubscribe) { globalChatUnsubscribe(); globalChatUnsubscribe = null; }
        if(usersUnsubscribe) { usersUnsubscribe(); usersUnsubscribe = null; }
    } else {
        win.style.display = 'flex';
        switchHubTab('subjects');
    }
}

function switchHubTab(tab) {
    document.getElementById('tab-btn-subjects').classList.remove('active');
    document.getElementById('tab-btn-students').classList.remove('active');
    document.getElementById(`tab-btn-${tab}`).classList.add('active');
    
    document.getElementById('chat-hub-active').style.display = 'none';
    document.getElementById('hub-back-btn').style.display = 'none';
    document.getElementById('chat-hub-tabs').style.display = 'flex'; 
    document.getElementById('hub-title-span').innerHTML = `<i class="fas fa-layer-group"></i> <span>${t('hubTitle')}</span>`;
    
    if(globalChatUnsubscribe) { globalChatUnsubscribe(); globalChatUnsubscribe = null; }
    if(usersUnsubscribe) { usersUnsubscribe(); usersUnsubscribe = null; }

    const sel = document.getElementById('chat-hub-selection');
    sel.style.display = 'flex';
    sel.innerHTML = '';

    if (tab === 'subjects') {
        sel.innerHTML = `<div class="chat-hub-item" onclick="openSpecificChat('GLOBAL', '${t('globalChat')}')" style="border-color:var(--primary); color:var(--primary);"><i class="fas fa-globe"></i> ${t('globalChat')}</div>`;
        let uniqueNames = new Map();
        ['TN', 'TP'].forEach(w => { 
            for(let d=0; d<5; d++) { 
                (scheduleData[w][d] || []).forEach((cls, cIdx) => { 
                    if (!uniqueNames.has(cls.subject)) { uniqueNames.set(cls.subject, `${w}-${d}-${cIdx}`); }
                }); 
            } 
        });
        uniqueNames.forEach((cardId, subjectName) => {
            sel.innerHTML += `<div class="chat-hub-item" onclick="openSpecificChat('${cardId}', '${t_sub(subjectName)}')"><i class="fas fa-comments"></i> ${t_sub(subjectName)}</div>`;
        });
    } else if (tab === 'students') {
        sel.innerHTML = '<div class="empty-gif-container" style="padding:10px;"><img src="https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif" alt="Szukam" style="width:80px;"><p style="font-size:0.8rem;">Szukam studentów...</p></div>';
        usersUnsubscribe = db.collection("users").onSnapshot(snap => {
            sel.innerHTML = '';
            const now = new Date();
            const todayStr = formatDateStr(now);
            let found = 0;

            snap.forEach(doc => {
                const u = doc.data();
                if (u.displayName && doc.id !== auth.currentUser?.uid) { 
                    found++;
                    const avatarUrl = u.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(u.displayName) + '&background=random';
                    let statusClass = "status-offline";
                    if (u.lastActive === todayStr) { statusClass = "status-idle"; }
                    
                    const chatId = [auth.currentUser?.uid, doc.id].sort().join('_'); 

                    sel.innerHTML += `
                    <div class="dm-user-item" onclick="openSpecificChat('${chatId}', '${u.displayName}')">
                        <div class="dm-user-info">
                            <div style="position:relative;">
                                <img src="${avatarUrl}" class="dm-user-avatar">
                                <span class="status-dot ${statusClass}" style="position:absolute; bottom:0; right:0; border:2px solid white;"></span>
                            </div>
                            <div>
                                <div style="font-weight:bold; font-size:0.9rem;">${u.displayName}</div>
                                <div style="font-size:0.7rem; color:var(--text-muted);"><i class="fas fa-fire" style="color:#f59e0b;"></i> ${u.streak || 0} dni</div>
                            </div>
                        </div>
                        <i class="fas fa-paper-plane" style="color:var(--primary); opacity:0.5;"></i>
                    </div>`;
                }
            });
            if (found === 0) sel.innerHTML = '<div style="text-align:center; padding:20px; font-size:0.9rem; color:var(--text-muted);">Zaproś znajomych z roku do zalogowania!</div>';
        }, e => { console.error(e); sel.innerHTML = '<div style="text-align:center; color:var(--danger); padding:10px;">Brak dostępu lub błąd sieci.</div>'; });
    }
}

function goBackToHub() {
    const activeTabBtn = document.querySelector('.hub-tab-btn.active');
    const tabToLoad = activeTabBtn ? activeTabBtn.id.replace('tab-btn-', '') : 'subjects';
    switchHubTab(tabToLoad);
}

function openSpecificChat(cardId, title) {
    currentActiveChatId = cardId;
    document.getElementById('chat-hub-selection').style.display = 'none';
    document.getElementById('chat-hub-tabs').style.display = 'none'; 
    document.getElementById('chat-hub-active').style.display = 'flex';
    document.getElementById('hub-back-btn').style.display = 'block';
    document.getElementById('hub-title-span').innerHTML = `<i class="fas fa-comments"></i> ${title}`;
    
    const box = document.getElementById('global-chat-messages');
    box.innerHTML = '<div class="empty-gif-container"><img src="https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif" alt="Szukam" style="width:100px;"><p style="font-size:0.8rem;">Szukam wiadomości...</p></div>';
    
    if(globalChatUnsubscribe) globalChatUnsubscribe();
    if(usersUnsubscribe) { usersUnsubscribe(); usersUnsubscribe = null; }
    
    globalChatUnsubscribe = db.collection("chats").where("classId", "==", cardId).orderBy("timestamp", "asc").onSnapshot(snap => { 
        box.innerHTML = snap.empty ? `<div style="text-align:center; opacity:0.5; font-size: 0.8rem; padding: 10px;">Brak wiadomości. Bądź pierwszy!</div>` : ''; 
        snap.forEach(doc => { 
            const m = doc.data(); const msgId = doc.id;
            const isMe = m.uid === auth.currentUser?.uid; 
            const isAdmin = auth.currentUser && ADMIN_UIDS.includes(auth.currentUser.uid);
            const canDelete = isMe || isAdmin;
            const avatarUrl = m.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(m.author) + '&background=random';
            
            box.innerHTML += `
            <div class="chat-message-wrapper ${isMe ? 'me' : 'other'}">
                ${!isMe ? `<img src="${avatarUrl}" class="chat-avatar" alt="Avatar">` : ''}
                <div class="chat-bubble ${isMe ? 'me' : 'other'}">
                    <div style="font-size: 0.65rem; opacity: 0.7; margin-bottom: 2px; font-weight: bold; display:flex; justify-content:space-between; gap:15px;">
                        <span>${m.author}</span>
                        ${canDelete ? `<i class="fas fa-trash-alt delete-msg-btn" onclick="deleteMessage('${msgId}', event)"></i>` : ''}
                    </div>
                    ${escapeHTML(m.text)}
                </div>
                ${isMe ? `<img src="${avatarUrl}" class="chat-avatar" alt="Avatar">` : ''}
            </div>`; 
        }); 
        box.scrollTop = box.scrollHeight; 
    }, error => {
        box.innerHTML = `<div style="text-align:center; color: var(--danger); font-size: 0.8rem; padding: 10px;"><i class="fas fa-exclamation-triangle"></i> Zaloguj się przez Menu, aby czytać forum.</div>`;
    }); 
}

function sendHubChat() {
    const user = auth.currentUser; 
    if(!user) { alert("Zaloguj się z Menu!"); return loginForSync(); } 
    if(!currentActiveChatId) return;
    const safeName = user.displayName ? user.displayName.split(' ')[0] : (user.email ? user.email.split('@')[0] : "Student");
    const inp = document.getElementById(`global-chat-input`); if(!inp.value.trim()) return; 
    db.collection("chats").add({ 
        classId: currentActiveChatId, 
        author: safeName, 
        text: inp.value, 
        photoURL: user.photoURL || '',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(), 
        uid: user.uid 
    }).then(() => {
        inp.value = '';
        document.getElementById('global-emoji-picker').style.display = 'none';
    }); 
}

auth.onAuthStateChanged(user => {
    const loginText = document.getElementById('login-text');
    const loginIcon = document.getElementById('login-icon');
    const adminBtn = document.getElementById('admin-panel-btn');
    
    if(user) {
        const safeName = user.displayName ? user.displayName.split(' ')[0] : (user.email ? user.email.split('@')[0] : "Student");
        const safeAvatar = user.photoURL || 'https://ui-avatars.com/api/?name=' + encodeURIComponent(safeName) + '&background=random';
        
        if(loginText) { loginText.removeAttribute('data-i18n'); loginText.innerText = safeName; }
        if(loginIcon) {
            loginIcon.className = '';
            loginIcon.style.color = '';
            loginIcon.innerHTML = `<img src="${safeAvatar}" style="width: 26px; height: 26px; border-radius: 50%; object-fit: cover; box-shadow: 0 2px 5px rgba(0,0,0,0.2);">`;
        }
        
        if (adminBtn) adminBtn.style.display = ADMIN_UIDS.includes(user.uid) ? 'flex' : 'none';

        // --- BEZPIECZNA MIGRACJA I ODCZYT DANYCH ---
        db.collection("users").doc(user.uid).get().then(docRoot => {
            let oldData = docRoot.exists ? docRoot.data() : {};

            db.collection("users").doc(user.uid).collection("private").doc("main").get().then(docPriv => {
                let planToLoad = null;
                let gradesToLoad = null;
                let newData = docPriv.exists ? docPriv.data() : {};

                if (newData.plan) planToLoad = newData.plan;
                if (newData.grades) gradesToLoad = newData.grades;

                let needsMigration = false;
                let migratedPlan = null;
                let migratedGrades = null;

                // Próba odzyskania starych danych, jeśli w nowym sejfie jest pusto
                if (!planToLoad && oldData.plan) {
                    try { migratedPlan = JSON.parse(oldData.plan); needsMigration = true; } 
                    catch(e) { console.warn("Błąd parsowania starego planu:", e); }
                }
                if (!gradesToLoad && oldData.grades) {
                    try { migratedGrades = JSON.parse(oldData.grades); needsMigration = true; } 
                    catch(e) { console.warn("Błąd parsowania starych ocen:", e); }
                }

                if (needsMigration) {
                    console.log("Migracja do sejfu...");
                    if (migratedPlan) planToLoad = migratedPlan;
                    if (migratedGrades) gradesToLoad = migratedGrades;

                    let payload = {};
                    if (migratedPlan) payload.plan = migratedPlan;
                    if (migratedGrades) payload.grades = migratedGrades;
                    
                    // Zapisujemy jako bezpieczne obiekty w podkolekcji
                    db.collection("users").doc(user.uid).collection("private").doc("main").set(payload, { merge: true });

                    // Sprzątanie starych, wrażliwych pól z profilu głównego
                    db.collection("users").doc(user.uid).update({
                        plan: firebase.firestore.FieldValue.delete(),
                        grades: firebase.firestore.FieldValue.delete()
                    }).catch(e => console.log("Sprzątanie zakończone lub brak uprawnień."));
                }

                if (planToLoad) { scheduleData = planToLoad; localStorage.setItem('smartPlanData', JSON.stringify(scheduleData)); }
                if (gradesToLoad) { gradesData = gradesToLoad; localStorage.setItem('smartPlanGrades', JSON.stringify(gradesData)); }
                
                renderCalendar(); updateDashboard();
            });
        }).catch(e => console.error("Błąd chmury:", e));

        updateUserPresence();

    } else {
        if(loginText) { loginText.setAttribute('data-i18n', 'login'); loginText.innerText = t('login'); }
        if(loginIcon) { loginIcon.innerHTML = ''; loginIcon.className = 'fab fa-google'; loginIcon.style.color = '#4285F4'; }
        if(adminBtn) adminBtn.style.display = 'none';
        document.getElementById('global-stats-banner').style.display = 'none';
    }
});

function toggleSidebar() { const s = document.getElementById('sidebar'); s.classList.toggle('active'); document.getElementById('sidebar-overlay').style.display = s.classList.contains('active') ? 'block' : 'none'; }
function toggleThemeMenu() { const m = document.getElementById('theme-options'); m.style.display = m.style.display === 'none' ? 'flex' : 'none'; }
function setTheme(t_val) { document.body.className = ''; if (t_val !== 'light') document.body.classList.add(`theme-${t_val}`); localStorage.setItem('smartPlanTheme', t_val); const m = document.getElementById('meta-theme-color'); if(t_val === 'matrix') m.content = '#000000'; else if(t_val === 'cad') m.content = '#004488'; else if(t_val === 'dark') m.content = '#111827'; else if(t_val === 'uwu') m.content = '#ff66b2'; else if(t_val === 'ans') m.content = '#006633'; else m.content = '#4f46e5'; }
function exportICS() { let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//SmartPlan//Student//PL\nCALSCALE:GREGORIAN\n"; const generateUID = () => Math.random().toString(36).substring(2, 15) + "@smartplan.pl"; const dtStamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + "Z"; [{ type: 'TN', starts: tnWeeksStarts }, { type: 'TP', starts: tpWeeksStarts }].forEach(weekData => { weekData.starts.forEach(mondayStr => { const baseMonday = new Date(mondayStr); for (let dayIndex = 0; dayIndex < 5; dayIndex++) { const eventDate = new Date(baseMonday); eventDate.setDate(eventDate.getDate() + dayIndex); const dateStrFormat = eventDate.toISOString().split('T')[0]; const icsDateStr = dateStrFormat.replace(/-/g, ''); if (checkSpecialDay(dateStrFormat)) continue; scheduleData[weekData.type][dayIndex].forEach(cls => { if (cls.specificDates && cls.specificDates.length > 0 && !cls.specificDates.includes(dateStrFormat)) return; if (cls.cancelledDates && cls.cancelledDates.includes(dateStrFormat)) return; icsContent += `BEGIN:VEVENT\nUID:${generateUID()}\nDTSTAMP:${dtStamp}\nSUMMARY:${cls.exams && cls.exams.includes(dateStrFormat) ? '[KOLOKWIUM] ' : ''}${cls.subject}\nLOCATION:${cls.room || ''}\nDTSTART;TZID=Europe/Warsaw:${icsDateStr}T${cls.start.replace(':','')}00\nDTEND;TZID=Europe/Warsaw:${icsDateStr}T${cls.end.replace(':','')}00\nEND:VEVENT\n`; }); } }); }); icsContent += "END:VCALENDAR"; const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' }); const link = document.createElement('a'); link.href = window.URL.createObjectURL(blob); link.download = 'smart_plan.ics'; link.click(); }

function changeWeek(offset) { viewDateStart.setDate(viewDateStart.getDate() + (offset * 7)); renderCalendar(); }
function jumpToToday() { viewDateStart = getSmartStartMonday(); renderCalendar(); }
function showQRCode() { document.getElementById('qrModal').style.display = 'flex'; document.getElementById('qrcode').innerHTML = ''; new QRCode(document.getElementById('qrcode'), { text: window.location.href.split('#')[0], width: 200, height: 200, colorDark : "#1f2937", colorLight : "#ffffff", correctLevel : QRCode.CorrectLevel.H }); }
function openModal() { document.getElementById('modalTitle').innerText = "Dodaj zajęcia"; document.getElementById('saveBtn').innerText = "Zapisz"; document.getElementById('editClassIndex').value = "-1"; document.getElementById('classModal').style.display = 'flex'; }
function closeModal() { document.getElementById('classModal').style.display = 'none'; }
function saveClass() { const w = document.getElementById('weekTypeSelect').value; const d = document.getElementById('daySelect').value; const eIdx = parseInt(document.getElementById('editClassIndex').value); const oDIdx = parseInt(document.getElementById('editDayIndex').value); const datesInput = document.getElementById('specificDates').value; let pDates = []; if(datesInput.trim() !== "") pDates = datesInput.split(',').map(dx => dx.trim()); const classData = { start: document.getElementById('timeStart').value, end: document.getElementById('timeEnd').value, subject: document.getElementById('subject').value, type: document.getElementById('classType').value, room: document.getElementById('room').value, lecturer: document.getElementById('lecturer').value, specificDates: pDates, notes: eIdx !== -1 ? scheduleData[w][oDIdx][eIdx].notes : "", todo: eIdx !== -1 ? scheduleData[w][oDIdx][eIdx].todo : [], cancelledDates: eIdx !== -1 ? scheduleData[w][oDIdx][eIdx].cancelledDates : [], exams: eIdx !== -1 ? scheduleData[w][oDIdx][eIdx].exams : [], attendedDates: eIdx !== -1 && scheduleData[w][oDIdx][eIdx].attendedDates ? scheduleData[w][oDIdx][eIdx].attendedDates : [], absentDates: eIdx !== -1 && scheduleData[w][oDIdx][eIdx].absentDates ? scheduleData[w][oDIdx][eIdx].absentDates : [] }; if(!classData.start || !classData.end || !classData.subject) { alert("Wypełnij pola!"); return; } if (eIdx === -1) scheduleData[w][d].push(classData); else scheduleData[w][oDIdx][eIdx] = classData; saveData(); closeModal(); renderCalendar(); updateDashboard(); }
function editClass(week, dayIndex, classIndex, event) { event.stopPropagation(); const cls = scheduleData[week][dayIndex][classIndex]; document.getElementById('modalTitle').innerText = "Edytuj zajęcia"; document.getElementById('saveBtn').innerText = "Zapisz"; document.getElementById('weekTypeSelect').value = week; document.getElementById('daySelect').value = dayIndex; document.getElementById('editDayIndex').value = dayIndex; document.getElementById('editClassIndex').value = classIndex; document.getElementById('timeStart').value = cls.start; document.getElementById('timeEnd').value = cls.end; document.getElementById('subject').value = cls.subject; document.getElementById('room').value = cls.room || ""; document.getElementById('lecturer').value = cls.lecturer || ""; document.getElementById('classType').value = cls.type || "inne"; document.getElementById('specificDates').value = cls.specificDates ? cls.specificDates.join(', ') : ""; document.getElementById('classModal').style.display = 'flex'; }
function openBugModal() { document.getElementById('bugModal').style.display = 'flex'; }
function sendBugReport() { const desc = document.getElementById('bugDescription').value; if(!desc.trim()) return alert("Pusto!"); window.location.href = `mailto:hubertwieczorekk@gmail.com?subject=Bug&body=${encodeURIComponent(desc)}`; document.getElementById('bugModal').style.display = 'none'; }
function releaseTheCat() { let cat = document.getElementById('nyan-cat'); if (!cat) { cat = document.createElement('img'); cat.id = 'nyan-cat'; cat.src = 'https://media1.giphy.com/media/sIIhZliB2McAo/giphy.gif'; cat.style.position = 'fixed'; cat.style.bottom = '100px'; cat.style.left = '-200px'; cat.style.width = '150px'; cat.style.zIndex = '9999'; cat.style.pointerEvents = 'none'; document.body.appendChild(cat); } cat.style.transition = 'none'; cat.style.left = '-200px'; cat.style.display = 'block'; setTimeout(() => { cat.style.transition = 'left 4s linear'; cat.style.left = window.innerWidth + 'px'; }, 50); setTimeout(() => { cat.style.display = 'none'; }, 4100); }

setInterval(() => {
    if (document.querySelectorAll('.card-expanded-panel.active').length === 0) {
        renderCalendar();
    }
}, 60000);
setInterval(updateDashboard, 1000);

const savedTheme = localStorage.getItem('smartPlanTheme'); if (savedTheme) setTheme(savedTheme);
document.getElementById('global-chat-window').style.display = 'none';
applyTranslations();
renderCalendar(); updateDashboard();
