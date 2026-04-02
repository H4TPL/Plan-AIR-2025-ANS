// ==========================================
// 📚 STAŁE DANE APLIKACJI
// ==========================================

const tnWeeksStarts = [
    '2026-02-23',
    '2026-03-09',
    '2026-03-23',
    '2026-04-06',
    '2026-04-20',
    '2026-05-04',
    '2026-05-18',
    '2026-06-01'
];

const tpWeeksStarts = [
    '2026-03-02',
    '2026-03-16',
    '2026-03-30',
    '2026-04-13',
    '2026-04-27',
    '2026-05-11',
    '2026-05-25',
    '2026-06-08'
];

const freeDays = [
    '2026-04-03',
    '2026-04-06',
    '2026-04-07',
    '2026-04-08',
    '2026-05-01',
    '2026-06-04'
];

const sessionRanges = [
    { start: '2026-06-15', end: '2026-06-28', title: 'Sesja Letnia 📚' },
    { start: '2026-09-07', end: '2026-09-20', title: 'Sesja Poprawkowa 📝' }
];

const semesterStart = new Date('2026-02-23').getTime();
const semesterEnd = new Date('2026-06-14').getTime();

const defaultData = {
    TN: {
        0: [
            {
                start: "12:45",
                end: "15:00",
                subject: "Przetwarzanie sygnałów",
                type: "lab",
                room: "202t",
                lecturer: "dr inż. A.Kubacki",
                specificDates: ['2026-03-09', '2026-03-23', '2026-04-20', '2026-05-04', '2026-05-18']
            },
            {
                start: "15:05",
                end: "19:35",
                subject: "Przetwarzanie sygnałów (wyk.)",
                type: "wyklad",
                room: "202t",
                lecturer: "dr inż. A.Kubacki",
                specificDates: ['2026-03-09', '2026-03-23', '2026-04-20', '2026-05-04', '2026-05-18']
            }
        ],
        1: [
            {
                start: "09:45",
                end: "11:15",
                subject: "English for Automation...",
                type: "cwiczenia",
                room: "18t",
                lecturer: "dr inż. M.Muszyńska"
            },
            {
                start: "13:30",
                end: "15:00",
                subject: "Pracownia automatyki...",
                type: "lab",
                room: "202t",
                lecturer: "dr inż. T.Kapłon"
            },
            {
                start: "15:15",
                end: "16:45",
                subject: "Projektowanie linii...",
                type: "wyklad",
                room: "18t",
                lecturer: "prof. Milecki"
            }
        ],
        2: [
            {
                start: "15:15",
                end: "16:45",
                subject: "Rachunek kosztów (wyk.)",
                type: "wyklad",
                room: "109t",
                lecturer: "dr B.Bryl"
            },
            {
                start: "17:00",
                end: "18:30",
                subject: "Rachunek kosztów",
                type: "cwiczenia",
                room: "109t",
                lecturer: "dr B.Bryl"
            }
        ],
        3: [],
        4: []
    },

    TP: {
        0: [
            {
                start: "09:45",
                end: "13:00",
                subject: "Sieci i wizualizacja",
                type: "lab",
                room: "113t",
                lecturer: "dr hab. W.Stankiewicz"
            },
            {
                start: "15:00",
                end: "18:00",
                subject: "Seminarium",
                type: "seminarium",
                room: "113t",
                lecturer: "dr R.Roszak"
            }
        ],
        1: [
            {
                start: "15:30",
                end: "17:00",
                subject: "Projektowanie linii...",
                type: "projekt",
                room: "18t",
                lecturer: "mgr inż. M.Wadelski"
            },
            {
                start: "17:10",
                end: "19:25",
                subject: "Rapid Prototyping",
                type: "lab",
                room: "207t",
                lecturer: "mgr inż. R.Bajdek",
                specificDates: ['2026-03-17', '2026-03-31', '2026-04-14', '2026-04-28', '2026-05-12']
            }
        ],
        2: [
            {
                start: "09:45",
                end: "11:15",
                subject: "Rapid Prototyping (wyk.)",
                type: "wyklad",
                room: "109t",
                lecturer: "dr inż. R.Cieślak"
            },
            {
                start: "13:00",
                end: "16:00",
                subject: "Projektowanie chwytaków (wyk.)",
                type: "wyklad",
                room: "18t",
                lecturer: "dr inż. A.Myszkowski",
                specificDates: ['2026-03-04', '2026-03-18', '2026-04-01', '2026-04-15']
            },
            {
                start: "16:15",
                end: "19:15",
                subject: "Projektowanie chwytaków",
                type: "projekt",
                room: "18t",
                lecturer: "dr inż. A.Myszkowski",
                specificDates: ['2026-03-04', '2026-03-18', '2026-04-01', '2026-04-15']
            }
        ],
        3: [],
        4: []
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
    pl: {
        privacyText: "Polityka Cloud Sync: Po zalogowaniu Twoje oceny, zadania, obecności i wiadomości są zapisywane prywatnie i bezpiecznie na Twoim koncie Google Firebase.",
        statsTitle: "Twoje Statystyki",
        avgLabel: "Średnia",
        attLabel: "Obecność",
        streakLabel: "Passa dni",
        settings: "Ustawienia",
        search: "Szukaj przedmiotu, sali...",
        today: "Dziś",
        add: "Dodaj",
        nextClass: "Następne zajęcia",
        sem: "Semestr",
        prev: "Poprzedni",
        next: "Następny",
        history: "Historia Aktualizacji",
        privacy: "Prywatność",
        bug: "Zgłoś Błąd",
        login: "Zaloguj i Synchronizuj",
        admin: "Panel Admina (Wnioski)",
        cat: "Katalog / Zaawansowane",
        radar: "Radar Kolokwiów",
        avg: "Średnia Ocen",
        tasks: "Zbiorcze Zadania",
        att: "Twoja Frekwencja",
        theme: "Zmień Motyw",
        exp: "Eksportuj Kalendarz (.ics)",
        share: "Udostępnij (Kod QR)",
        reset: "Twardy Reset Danych",
        hubTitle: "Centrum Komunikacji",
        globalChat: "Globalne Forum AiR",
        backHub: "Wróć do Centrum",
        mon: "Poniedziałek",
        tue: "Wtorek",
        wed: "Środa",
        thu: "Czwartek",
        fri: "Piątek",
        tn: "Nieparzysty (TN)",
        tp: "Parzysty (TP)",
        noClass: "Brak zajęć",
        lec: "Wykład",
        exe: "Ćwiczenia",
        lab: "Laboratorium",
        proj: "Projekt",
        sem_class: "Seminarium",
        other: "Inne",
        room: "Sala",
        window: "Okienko",
        startsIn: "Do rozpoczęcia",
        emptyDay: "Brak zajęć w tym dniu 🎉",
        footerText: "Stworzone z ❤️ dla inżynierów AiR",
        qrTitle: "Zeskanuj plan",
        qrSub: "Aparat w telefonie otworzy ten plan.",
        close: "Zamknij",
        attTitle: "Twoja Frekwencja",
        attSub: "Zestawienie obecności. Rozwiń, by zobaczyć szczegóły dat.",
        attPres: "Był(a)",
        attAbs: "Nie był(a)",
        attGeneral: "Frekwencja ogólna",
        attBtnPres: "Byłem",
        attBtnAbs: "Nie byłem",
        tasksTitle: "Zbiorcze Zadania",
        tasksSub: "Wszystkie zadania ze wszystkich przedmiotów w jednym miejscu.",
        gradesTitle: "Średnia Ocen",
        gradesSub: "Wpisz oceny (np. 5, 4.5, 3).",
        gradesEmpty: "Brak ocen (np. 4.5, 3)...",
        radarTitle: "Radar Kolokwiów",
        radarBtn: "Biorę się za naukę!",
        radarEmpty: "Czysto! Brak kolokwiów",
        dirTitle: "Katalog Systemowy",
        dirLec: "Wykładowcy",
        dirRoom: "Sale",
        tabTasks: "Zadania",
        tabNotes: "Notatki",
        tabAtt: "Obecność",
        tabForum: "Forum",
        btnMail: "Wyślij Maila",
        btnExamSet: "Ustaw Kolokwium",
        btnExamDel: "Usuń Kolokwium",
        btnCancel: "Odwołaj w tym dniu",
        btnRestore: "Przywróć zajęcia",
        stampCancel: "ODWOŁANE",
        stampCancelAdmin: "ODWOŁANE (ADMIN)",
        badgeExam: "KOLOKWIUM",
        badgeExamAdmin: "KOLOKWIUM (OGŁOSZENIE)",
        specificDates: "Tylko w wybrane daty",
        sendPlaceholder: "Napisz wiadomość...",
        hubEmpty: "Kliknij przycisk, aby połączyć się z serwerem...",
        themeLight: "Jasny",
        themeDark: "Ciemny",
        themeMatrix: "Matrix",
        themeCad: "Inżynier CAD",
        themeUwu: "UWU Anime",
        themeAns: "Akademia ANS",
        tasksEmpty: "Brak zadań! Możesz odpoczywać.",
        tabSubjects: "Przedmioty",
        tabStudents: "Studenci (DM)"
    },

    en: {
        privacyText: "Cloud Sync Policy: Your grades, tasks, attendance, and messages are privately and securely saved to your Google Firebase account upon login.",
        statsTitle: "Your Stats",
        avgLabel: "Average",
        attLabel: "Attendance",
        streakLabel: "Day Streak",
        settings: "Settings",
        search: "Search subjects, rooms...",
        today: "Today",
        add: "Add",
        nextClass: "Next Class",
        sem: "Semester",
        prev: "Previous",
        next: "Next",
        history: "Changelog",
        privacy: "Privacy",
        bug: "Report Bug",
        login: "Login & Sync",
        admin: "Admin Panel (Requests)",
        cat: "Directory / Advanced",
        radar: "Exam Radar",
        avg: "Grades Average",
        tasks: "Global Tasks",
        att: "Your Attendance",
        theme: "Change Theme",
        exp: "Export Calendar (.ics)",
        share: "Share (QR Code)",
        reset: "Hard Data Reset",
        hubTitle: "Communication Hub",
        globalChat: "Global AiR Forum",
        backHub: "Back to Hub",
        mon: "Monday",
        tue: "Tuesday",
        wed: "Wednesday",
        thu: "Thursday",
        fri: "Friday",
        tn: "Odd Week (TN)",
        tp: "Even Week (TP)",
        noClass: "No classes",
        lec: "Lecture",
        exe: "Classes",
        lab: "Laboratory",
        proj: "Project",
        sem_class: "Seminar",
        other: "Other",
        room: "Room",
        window: "Free time",
        startsIn: "Starts in",
        emptyDay: "No classes today 🎉",
        footerText: "Made with ❤️ for AiR engineers",
        qrTitle: "Scan Schedule",
        qrSub: "Open this plan with your phone camera.",
        close: "Close",
        attTitle: "Your Attendance",
        attSub: "Attendance summary. Expand to see specific dates.",
        attPres: "Present",
        attAbs: "Absent",
        attGeneral: "Overall attendance",
        attBtnPres: "Present",
        attBtnAbs: "Absent",
        tasksTitle: "Global Tasks",
        tasksSub: "All tasks from all subjects in one place.",
        gradesTitle: "Grades Average",
        gradesSub: "Enter grades (e.g. 5, 4.5, 3).",
        gradesEmpty: "No grades (e.g. 4.5, 3)...",
        radarTitle: "Exam Radar",
        radarBtn: "Let's study!",
        radarEmpty: "All clear! No exams",
        dirTitle: "System Directory",
        dirLec: "Lecturers",
        dirRoom: "Rooms",
        tabTasks: "Tasks",
        tabNotes: "Notes",
        tabAtt: "Attendance",
        tabForum: "Forum",
        btnMail: "Send Email",
        btnExamSet: "Set Exam",
        btnExamDel: "Remove Exam",
        btnCancel: "Cancel Class",
        btnRestore: "Restore Class",
        stampCancel: "CANCELLED",
        stampCancelAdmin: "CANCELLED (ADMIN)",
        badgeExam: "EXAM",
        badgeExamAdmin: "EXAM (ANNOUNCEMENT)",
        specificDates: "Only on selected dates",
        sendPlaceholder: "Type a message...",
        hubEmpty: "Click the button to connect...",
        themeLight: "Light",
        themeDark: "Dark",
        themeMatrix: "Matrix",
        themeCad: "CAD Engineer",
        themeUwu: "UWU Anime",
        themeAns: "ANS Academy",
        tasksEmpty: "No tasks! You can relax.",
        tabSubjects: "Subjects",
        tabStudents: "Students (DM)"
    }
};