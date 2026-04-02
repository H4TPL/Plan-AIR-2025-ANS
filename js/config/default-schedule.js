// ==========================================
// 📚 DOMYŚLNY PLAN
// ==========================================

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