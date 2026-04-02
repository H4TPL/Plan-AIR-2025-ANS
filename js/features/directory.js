// ==========================================
// 📚 KATALOG / WYKŁADOWCY / SALE
// bez surowego innerHTML dla danych
// ==========================================

function openDirectoryModal() {
    toggleSidebar();
    switchDirectoryTab('lecturer');

    const modal = document.getElementById('directoryModal');
    if (modal) {
        modal.style.display = 'flex';
    }
}

function createDirectoryEmptyState() {
    return createElement('div', {
        className: 'empty-gif-container',
        children: [
            createElement('img', {
                attrs: {
                    src: 'https://media.giphy.com/media/3o7TKMt1VVNkHV2PaE/giphy.gif',
                    alt: 'Brak danych'
                }
            }),
            createElement('p', {
                text: 'Brak danych do wyświetlenia.'
            })
        ]
    });
}

function createDirectoryItem(text) {
    return createElement('div', {
        className: 'directory-item',
        text: safeText(text)
    });
}

function createDirectoryCard(key, items, tab) {
    const icon = tab === 'lecturer' ? 'fa-user-tie' : 'fa-door-open';

    const card = createElement('div', {
        className: 'directory-card'
    });

    const title = createElement('div', {
        cssText: 'font-weight: 900; color: var(--primary); font-size: 1rem;'
    });

    title.appendChild(createElement('i', {
        className: `fas ${icon}`
    }));
    title.appendChild(document.createTextNode(` ${safeText(key)}`));

    const itemsWrap = createElement('div', {
        cssText: 'margin-top: 10px;'
    });

    items.forEach(item => {
        itemsWrap.appendChild(createDirectoryItem(item));
    });

    card.appendChild(title);
    card.appendChild(itemsWrap);

    return card;
}

function switchDirectoryTab(tab) {
    const lecturerTab = document.getElementById('dir-tab-lecturer');
    const roomTab = document.getElementById('dir-tab-room');
    const activeTab = document.getElementById(`dir-tab-${tab}`);
    const list = document.getElementById('directory-list');

    if (!lecturerTab || !roomTab || !activeTab || !list) return;

    lecturerTab.classList.remove('active');
    roomTab.classList.remove('active');
    activeTab.classList.add('active');

    const typeLabels = {
        wyklad: t('lec'),
        cwiczenia: t('exe'),
        lab: t('lab'),
        projekt: t('proj'),
        seminarium: t('sem_class'),
        inne: t('other')
    };

    clearElement(list);

    const dataMap = {};

    ['TN', 'TP'].forEach(w => {
        for (let d = 0; d < 5; d++) {
            (scheduleData?.[w]?.[d] || []).forEach(cls => {
                const rawKey = tab === 'lecturer'
                    ? safeText(cls.lecturer).trim()
                    : safeText(cls.room).trim();

                const key = rawKey || 'Nie przypisano';

                if (!dataMap[key]) {
                    dataMap[key] = new Set();
                }

                const typeLabel = typeLabels[cls.type || 'inne'] || typeLabels.inne;

                const info = tab === 'lecturer'
                    ? `${t_sub(cls.subject)} (${typeLabel})`
                    : `${t_sub(cls.subject)} - ${safeText(cls.lecturer).trim() || 'Brak'}`;

                dataMap[key].add(info);
            });
        }
    });

    const sortedKeys = Object.keys(dataMap).sort((a, b) => a.localeCompare(b, 'pl'));

    if (sortedKeys.length === 0) {
        list.appendChild(createDirectoryEmptyState());
        return;
    }

    const fragment = document.createDocumentFragment();

    sortedKeys.forEach(key => {
        const items = Array.from(dataMap[key]).sort((a, b) => a.localeCompare(b, 'pl'));
        fragment.appendChild(createDirectoryCard(key, items, tab));
    });

    list.appendChild(fragment);
}