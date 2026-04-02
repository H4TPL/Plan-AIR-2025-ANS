// ==========================================
// 👑 PANEL ADMINA / WNIOSKI
// bez inline eventów, bez innerHTML +=
// ==========================================

let adminRequestsUnsubscribe = null;

function createAdminStateBox(imgSrc, altText, message) {
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

function createAdminActionButton({
    iconClass,
    label,
    color,
    borderColor,
    dataset = {},
    extraClass = ''
}) {
    const button = createElement('button', {
        className: `btn btn-outline ${extraClass}`.trim(),
        type: 'button',
        dataset,
        cssText: `
            flex: 1;
            padding: 5px;
            border-color: ${borderColor};
            color: ${color};
        `
    });

    button.appendChild(createElement('i', { className: iconClass }));
    button.appendChild(document.createTextNode(` ${label}`));

    return button;
}

function createAdminRequestCard(reqId, req) {
    const type = safeText(req.type).trim();
    const requester = safeText(req.requester, 'Nieznany użytkownik');
    const dateStr = safeText(req.dateStr, '-');
    const subject = safeText(req.subject, 'Brak przedmiotu');
    const cardId = safeText(req.cardId);

    const isExam = type === 'exam';
    const typeLabel = isExam ? '🔥 Kolokwium' : '🚫 Odwołanie';
    const typeColor = isExam ? 'var(--danger)' : 'var(--text-muted)';

    const card = createElement('div', {
        className: 'request-card',
        cssText: `
            background: var(--bg-color);
            padding: 10px;
            border-radius: 10px;
            margin-bottom: 10px;
            border-left: 4px solid var(--primary);
        `
    });

    const header = createElement('div', {
        cssText: `
            display: flex;
            justify-content: space-between;
            align-items: center;
            gap: 10px;
            margin-bottom: 5px;
            flex-wrap: wrap;
        `
    });

    const requesterEl = createElement('strong', {
        cssText: 'color: var(--primary); font-size: 0.85rem;'
    });
    requesterEl.appendChild(createElement('i', { className: 'fas fa-user' }));
    requesterEl.appendChild(document.createTextNode(` ${requester}`));

    const dateBadge = createElement('span', {
        cssText: `
            font-size: 0.75rem;
            background: var(--toggle-bg);
            padding: 2px 6px;
            border-radius: 6px;
        `,
        text: dateStr
    });

    header.appendChild(requesterEl);
    header.appendChild(dateBadge);

    const subjectEl = createElement('div', {
        cssText: 'font-weight: bold; margin-bottom: 3px;',
        text: subject
    });

    const typeEl = createElement('div', {
        cssText: `
            font-size: 0.8rem;
            color: ${typeColor};
            font-weight: bold;
            margin-bottom: 10px;
        `,
        text: `Proponuje: ${typeLabel}`
    });

    const actions = createElement('div', {
        cssText: 'display:flex; gap:10px;'
    });

    const approveBtn = createAdminActionButton({
        iconClass: 'fas fa-check',
        label: 'Zatwierdź',
        color: 'var(--success)',
        borderColor: 'var(--success)',
        dataset: {
            action: 'approve',
            reqId,
            type,
            cardId,
            dateStr
        },
        extraClass: 'js-admin-request-action'
    });

    const rejectBtn = createAdminActionButton({
        iconClass: 'fas fa-times',
        label: 'Odrzuć',
        color: 'var(--danger)',
        borderColor: 'var(--danger)',
        dataset: {
            action: 'reject',
            reqId,
            type,
            cardId,
            dateStr
        },
        extraClass: 'js-admin-request-action'
    });

    actions.appendChild(approveBtn);
    actions.appendChild(rejectBtn);

    card.appendChild(header);
    card.appendChild(subjectEl);
    card.appendChild(typeEl);
    card.appendChild(actions);

    return card;
}

function renderAdminRequestsSnapshot(list, snap) {
    if (!list) return;

    clearElement(list);

    if (snap.empty) {
        list.appendChild(
            createAdminStateBox(
                'https://media.giphy.com/media/l41lFw057lAJQMwg0/giphy.gif',
                'Czysto',
                'Brak nowych wniosków!'
            )
        );
        return;
    }

    const fragment = document.createDocumentFragment();

    snap.forEach(docSnap => {
        const req = docSnap.data() || {};
        const reqId = docSnap.id;

        fragment.appendChild(createAdminRequestCard(reqId, req));
    });

    list.appendChild(fragment);
}

function openAdminPanel() {
    toggleSidebar();

    const list = document.getElementById('admin-requests-list');
    const modal = document.getElementById('adminPanelModal');

    if (!list || !modal) return;

    clearElement(list);
    list.appendChild(
        createAdminStateBox(
            'https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif',
            'Szukam',
            'Szukam...'
        )
    );

    modal.style.display = 'flex';

    if (typeof adminRequestsUnsubscribe === 'function') {
        adminRequestsUnsubscribe();
        adminRequestsUnsubscribe = null;
    }

    adminRequestsUnsubscribe = db.collection('admin_requests')
        .where('status', '==', 'pending')
        .onSnapshot(
            snap => {
                renderAdminRequestsSnapshot(list, snap);
            },
            err => {
                console.error('Błąd nasłuchu admin_requests:', err);

                clearElement(list);
                list.appendChild(
                    createAdminStateBox(
                        'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
                        'Błąd',
                        'Nie udało się pobrać wniosków.'
                    )
                );
            }
        );
}

async function resolveRequest(reqId, type, cardId, dateStr, isApproved) {
    const safeReqId = safeText(reqId).trim();
    const safeType = safeText(type).trim();
    const safeCardId = safeText(cardId).trim();
    const safeDateStr = safeText(dateStr).trim();

    if (!safeReqId) return;

    try {
        if (isApproved) {
            if (safeType === 'cancel') {
                await setGlobalDateIncluded('cancelled', safeCardId, safeDateStr, true);
            } else if (safeType === 'exam') {
                await setGlobalDateIncluded('exams', safeCardId, safeDateStr, true);
            }
        }

        await setAdminRequestStatus(safeReqId, isApproved ? 'approved' : 'rejected');
    } catch (error) {
        console.error('Błąd rozpatrywania wniosku:', error);
        alert('Nie udało się zaktualizować wniosku.');
    }
}

function initAdminDelegation() {
    if (window.__adminDelegationInitialized) return;
    window.__adminDelegationInitialized = true;

    document.addEventListener('click', e => {
        const btn = e.target.closest('.js-admin-request-action');
        if (!btn) return;

        e.preventDefault();
        e.stopPropagation();

        const action = safeText(btn.dataset.action).trim();
        const reqId = safeText(btn.dataset.reqId).trim();

        if (!reqId) return;

        if (action === 'approve') {
            resolveRequest(
                reqId,
                btn.dataset.type,
                btn.dataset.cardId,
                btn.dataset.dateStr,
                true
            );
        } else if (action === 'reject') {
            resolveRequest(
                reqId,
                btn.dataset.type,
                btn.dataset.cardId,
                btn.dataset.dateStr,
                false
            );
        }
    });
}

initAdminDelegation();