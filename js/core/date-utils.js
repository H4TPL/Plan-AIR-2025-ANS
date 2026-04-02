// ==========================================
// 📅 HELPERY DAT / TYGODNI / DNI SPECJALNYCH
// ==========================================

function getSmartStartMonday() {
    let now = new Date();
    let day = now.getDay();

    if (day === 6) now.setDate(now.getDate() + 2);
    if (day === 0) now.setDate(now.getDate() + 1);

    return getMonday(now);
}

function getMonday(d) {
    d = new Date(d);
    var day = d.getDay(),
        diff = d.getDate() - day + (day == 0 ? -6 : 1);

    return new Date(d.setDate(diff));
}

function formatDateStr(dateObj) {
    const tzOffset = dateObj.getTimezoneOffset() * 60000;
    return (new Date(dateObj - tzOffset)).toISOString().split('T')[0];
}

function getWeekTypeForDate(dateObj) {
    const mondayStr = formatDateStr(getMonday(dateObj));

    if (tnWeeksStarts.includes(mondayStr)) return 'TN';
    if (tpWeeksStarts.includes(mondayStr)) return 'TP';

    return 'INNY';
}

function checkSpecialDay(dateStr) {
    if (freeDays.includes(dateStr)) {
        return {
            type: 'WOLNE',
            title: 'Dzień wolny od zajęć 🌴'
        };
    }

    for (let s of sessionRanges) {
        if (dateStr >= s.start && dateStr <= s.end) {
            return {
                type: 'SESJA',
                title: s.title
            };
        }
    }

    return null;
}