// ==========================================
// 📤 EKSPORT KALENDARZA .ICS
// uwzględnia local + global admin events
// ==========================================

function escapeICSValue(value) {
    return safeText(value)
        .replace(/\\/g, '\\\\')
        .replace(/\n/g, '\\n')
        .replace(/,/g, '\\,')
        .replace(/;/g, '\\;');
}

function makeICSDateTime(dateStr, timeStr) {
    const safeDate = safeText(dateStr).replace(/-/g, '');
    const safeTime = safeText(timeStr).replace(':', '');
    return `${safeDate}T${safeTime}00`;
}

function generateICSUid(cardId, dateStr, start, end) {
    return `${safeText(cardId)}-${safeText(dateStr)}-${safeText(start)}-${safeText(end)}@smartplan.pl`
        .replace(/\s+/g, '-')
        .toLowerCase();
}

function buildICSDescription(cls, hasExam) {
    const lines = [];

    if (safeText(cls.lecturer).trim()) {
        lines.push(`Prowadzący: ${safeText(cls.lecturer).trim()}`);
    }

    if (safeText(cls.room).trim()) {
        lines.push(`Sala: ${safeText(cls.room).trim()}`);
    }

    if (safeText(cls.type).trim()) {
        lines.push(`Typ: ${safeText(cls.type).trim()}`);
    }

    if (hasExam) {
        lines.push('Uwaga: oznaczone jako kolokwium.');
    }

    return escapeICSValue(lines.join('\n'));
}

function exportICS() {
    let icsContent = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//SmartPlan//Student//PL',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH'
    ].join('\n') + '\n';

    const dtStamp =
        new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const exportedKeys = new Set();

    [
        { type: 'TN', starts: tnWeeksStarts },
        { type: 'TP', starts: tpWeeksStarts }
    ].forEach(weekData => {
        weekData.starts.forEach(mondayStr => {
            const baseMonday = new Date(mondayStr);
            if (isNaN(baseMonday.getTime())) return;

            for (let dayIndex = 0; dayIndex < 5; dayIndex++) {
                const eventDate = new Date(baseMonday);
                eventDate.setDate(eventDate.getDate() + dayIndex);

                const dateStrFormat = formatDateStr(eventDate);
                const specialDay = checkSpecialDay(dateStrFormat);

                if (specialDay) continue;

                const dayClasses = scheduleData?.[weekData.type]?.[dayIndex] || [];

                dayClasses.forEach((cls, classIndex) => {
                    if (!cls) return;

                    const specificDates = Array.isArray(cls.specificDates) ? cls.specificDates : [];
                    const cancelledDates = Array.isArray(cls.cancelledDates) ? cls.cancelledDates : [];
                    const exams = Array.isArray(cls.exams) ? cls.exams : [];

                    if (specificDates.length > 0 && !specificDates.includes(dateStrFormat)) {
                        return;
                    }

                    const cardId = `${weekData.type}-${dayIndex}-${classIndex}`;

                    const globalCancelled = getGlobalDates('cancelled', cardId);
                    const globalExams = getGlobalDates('exams', cardId);

                    const isCancelled =
                        cancelledDates.includes(dateStrFormat) ||
                        globalCancelled.includes(dateStrFormat);

                    if (isCancelled) return;

                    const hasExam =
                        exams.includes(dateStrFormat) ||
                        globalExams.includes(dateStrFormat);

                    const start = safeText(cls.start).trim();
                    const end = safeText(cls.end).trim();
                    const subject = safeText(cls.subject).trim();

                    if (!start || !end || !subject) return;

                    const uniqueKey = `${cardId}|${dateStrFormat}|${start}|${end}|${subject}`;
                    if (exportedKeys.has(uniqueKey)) return;
                    exportedKeys.add(uniqueKey);

                    const summaryPrefix = hasExam ? '[KOLOKWIUM] ' : '';
                    const summary = escapeICSValue(`${summaryPrefix}${subject}`);
                    const location = escapeICSValue(safeText(cls.room).trim());
                    const description = buildICSDescription(cls, hasExam);
                    const uid = generateICSUid(cardId, dateStrFormat, start, end);

                    icsContent += [
                        'BEGIN:VEVENT',
                        `UID:${uid}`,
                        `DTSTAMP:${dtStamp}`,
                        `SUMMARY:${summary}`,
                        `LOCATION:${location}`,
                        `DESCRIPTION:${description}`,
                        `DTSTART;TZID=Europe/Warsaw:${makeICSDateTime(dateStrFormat, start)}`,
                        `DTEND;TZID=Europe/Warsaw:${makeICSDateTime(dateStrFormat, end)}`,
                        'END:VEVENT'
                    ].join('\n') + '\n';
                });
            }
        });
    });

    icsContent += 'END:VCALENDAR';

    const blob = new Blob([icsContent], {
        type: 'text/calendar;charset=utf-8'
    });

    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = 'smart_plan.ics';
    link.click();

    setTimeout(() => {
        window.URL.revokeObjectURL(link.href);
    }, 1000);
}