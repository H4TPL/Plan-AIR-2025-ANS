// ==========================================
// 💬 CHAT / FORUM / HUB / DM / EMOJI
// bez inline onclick
// bez innerHTML += dla danych z bazy
// ==========================================

let currentActiveChatId = null;
let globalChatUnsubscribe = null;
let usersUnsubscribe = null;
const classChatUnsubscribers = {};

function getUserShortName(user) {
    if (!user) return 'Student';

    const fromDisplayName = safeText(user.displayName).trim();
    if (fromDisplayName) {
        return fromDisplayName.split(' ')[0];
    }

    const fromEmail = safeText(user.email).trim();
    if (fromEmail.includes('@')) {
        return fromEmail.split('@')[0];
    }

    return 'Student';
}

function sanitizeChatMessageText(value) {
    return normalizePlainText(value, 1000);
}

function getAvatarUrl(photoURL, authorName) {
    const safePhoto = sanitizeImageUrl(photoURL, '');
    if (safePhoto) return safePhoto;

    return `https://ui-avatars.com/api/?name=${encodeURIComponent(safeText(authorName, 'User'))}&background=random`;
}

function createChatInfoMessage(text, options = {}) {
    return createElement('div', {
        text: safeText(text),
        cssText: options.cssText || 'text-align:center; opacity:0.6; font-size:0.8rem; padding:10px;'
    });
}

function createChatLoadingState(text = 'Łączenie z chmurą...') {
    return createChatInfoMessage(text, {
        cssText: 'text-align:center; padding:10px; font-size:0.8rem; color:var(--text-muted);'
    });
}

function createChatErrorState(text = 'Zaloguj się przez Menu, aby czytać forum.') {
    const wrapper = createElement('div', {
        cssText: 'text-align:center; color: var(--danger); font-size: 0.8rem; padding: 10px;'
    });

    wrapper.appendChild(createElement('i', {
        className: 'fas fa-exclamation-triangle'
    }));
    wrapper.appendChild(document.createTextNode(` ${text}`));

    return wrapper;
}

function createChatEmptyGif(text) {
    return createElement('div', {
        className: 'empty-gif-container',
        children: [
            createElement('img', {
                attrs: {
                    src: 'https://media.giphy.com/media/xT5LMHxhOfscxPfIfm/giphy.gif',
                    alt: 'Szukam'
                },
                cssText: 'width:100px;'
            }),
            createElement('p', {
                cssText: 'font-size:0.8rem;',
                text
            })
        ]
    });
}

function createDeleteMessageButton(msgId) {
    const btn = createElement('button', {
        type: 'button',
        className: 'delete-msg-btn js-delete-msg',
        dataset: {
            messageId: msgId
        },
        cssText: 'background:none; border:none; cursor:pointer; padding:0;'
    });

    btn.appendChild(createElement('i', {
        className: 'fas fa-trash-alt'
    }));

    return btn;
}

function createChatMessageElement(message, msgId, isMe, canDelete) {
    const author = safeText(message.author, 'Student');
    const text = safeText(message.text);
    const avatarUrl = getAvatarUrl(message.photoURL, author);

    const wrapper = createElement('div', {
        className: `chat-message-wrapper ${isMe ? 'me' : 'other'}`
    });

    const avatar = createElement('img', {
        className: 'chat-avatar',
        attrs: {
            src: avatarUrl,
            alt: 'Avatar'
        }
    });

    const bubble = createElement('div', {
        className: `chat-bubble ${isMe ? 'me' : 'other'}`
    });

    const meta = createElement('div', {
        cssText: `
            font-size: 0.65rem;
            opacity: 0.7;
            margin-bottom: 2px;
            font-weight: bold;
            display:flex;
            justify-content:space-between;
            gap:15px;
            align-items:center;
        `
    });

    const authorSpan = createElement('span', {
        text: author
    });

    meta.appendChild(authorSpan);

    if (canDelete) {
        meta.appendChild(createDeleteMessageButton(msgId));
    }

    const textNode = createElement('div', {
        text
    });

    if (!isMe) wrapper.appendChild(avatar);
    bubble.appendChild(meta);
    bubble.appendChild(textNode);
    wrapper.appendChild(bubble);
    if (isMe) wrapper.appendChild(avatar);

    return wrapper;
}

function renderMessagesIntoBox(box, snap) {
    if (!box) return;

    clearElement(box);

    if (snap.empty) {
        box.appendChild(createChatInfoMessage('Bądź pierwszy!'));
        return;
    }

    const fragment = document.createDocumentFragment();

    snap.forEach(docSnap => {
        const m = docSnap.data() || {};
        const msgId = docSnap.id;
        const isMe = m.uid === auth.currentUser?.uid;
        const isAdmin = !!(auth.currentUser && ADMIN_UIDS.includes(auth.currentUser.uid));
        const canDelete = isMe || isAdmin;

        fragment.appendChild(
            createChatMessageElement(m, msgId, isMe, canDelete)
        );
    });

    box.appendChild(fragment);
    box.scrollTop = box.scrollHeight;
}

function toggleEmojiPicker(inputId) {
    const picker = document.getElementById('global-emoji-picker');
    if (!picker) return;

    if (picker.style.display === 'grid') {
        picker.style.display = 'none';
        picker.removeAttribute('data-target-input');
    } else {
        picker.style.display = 'grid';
        picker.setAttribute('data-target-input', inputId);
    }
}

function insertEmoji(defaultInputId, emoji) {
    const picker = document.getElementById('global-emoji-picker');
    if (!picker) return;

    const targetId = picker.getAttribute('data-target-input') || defaultInputId;
    const input = document.getElementById(targetId);

    if (input) {
        input.value += safeText(emoji);
        input.focus();
    }

    picker.style.display = 'none';
}

function deleteMessage(msgId) {
    const safeMsgId = safeText(msgId).trim();
    if (!safeMsgId) return;

    if (confirm('Czy na pewno chcesz usunąć tę wiadomość?')) {
        db.collection('chats').doc(safeMsgId).delete();
    }
}

function sendChat(cardId) {
    const user = auth.currentUser;
    if (!user) {
        alert('Zaloguj się z Menu, żeby pisać na forum!');
        loginForSync();
        return;
    }

    const inp = document.getElementById(`chat-in-${cardId}`);
    if (!inp) return;

    const cleaned = sanitizeChatMessageText(inp.value);
    if (!cleaned) return;

    db.collection('chats').add({
        classId: safeText(cardId),
        author: getUserShortName(user),
        text: cleaned,
        photoURL: sanitizeImageUrl(user.photoURL || '', ''),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user.uid
    }).then(() => {
        inp.value = '';
    });
}

function stopClassChatListener(cardId) {
    if (classChatUnsubscribers[cardId]) {
        classChatUnsubscribers[cardId]();
        delete classChatUnsubscribers[cardId];
    }
}

function listenForMessages(cardId) {
    const box = document.getElementById(`chat-box-${cardId}`);
    if (!box) return;

    clearElement(box);
    box.appendChild(createChatLoadingState('Łączenie z chmurą...'));

    stopClassChatListener(cardId);

    classChatUnsubscribers[cardId] = db.collection('chats')
        .where('classId', '==', cardId)
        .orderBy('timestamp', 'asc')
        .onSnapshot(
            snap => {
                renderMessagesIntoBox(box, snap);
            },
            () => {
                clearElement(box);
                box.appendChild(createChatErrorState('Zaloguj się przez Menu, aby czytać forum.'));
            }
        );
}

function stopHubListeners() {
    if (globalChatUnsubscribe) {
        globalChatUnsubscribe();
        globalChatUnsubscribe = null;
    }

    if (usersUnsubscribe) {
        usersUnsubscribe();
        usersUnsubscribe = null;
    }
}

function toggleGlobalChat() {
    const win = document.getElementById('global-chat-window');
    if (!win) return;

    if (win.style.display === 'flex') {
        win.style.display = 'none';

        const picker = document.getElementById('global-emoji-picker');
        if (picker) picker.style.display = 'none';

        stopHubListeners();
    } else {
        win.style.display = 'flex';
        switchHubTab('subjects');
    }
}

function createHubItem(chatId, title, iconClass, extraStyles = '') {
    const item = createElement('div', {
        className: 'chat-hub-item js-open-specific-chat',
        dataset: {
            chatId,
            title: safeText(title)
        },
        cssText: extraStyles
    });

    item.appendChild(createElement('i', {
        className: `fas ${iconClass}`
    }));
    item.appendChild(document.createTextNode(` ${safeText(title)}`));

    return item;
}

function createDmUserItem(chatId, userData, userId, todayStr) {
    const displayName = safeText(userData.displayName, 'Student');
    const avatarUrl = getAvatarUrl(userData.photoURL, displayName);

    let statusClass = 'status-offline';
    if (userData.lastActive === todayStr) {
        statusClass = 'status-idle';
    }

    const item = createElement('div', {
        className: 'dm-user-item js-open-specific-chat',
        dataset: {
            chatId,
            title: displayName
        }
    });

    const info = createElement('div', {
        className: 'dm-user-info'
    });

    const avatarWrap = createElement('div', {
        cssText: 'position:relative;'
    });

    const avatar = createElement('img', {
        className: 'dm-user-avatar',
        attrs: {
            src: avatarUrl,
            alt: 'Avatar'
        }
    });

    const statusDot = createElement('span', {
        className: `status-dot ${statusClass}`,
        cssText: 'position:absolute; bottom:0; right:0; border:2px solid white;'
    });

    avatarWrap.appendChild(avatar);
    avatarWrap.appendChild(statusDot);

    const textWrap = createElement('div');

    const nameEl = createElement('div', {
        cssText: 'font-weight:bold; font-size:0.9rem;',
        text: displayName
    });

    const streakEl = createElement('div', {
        cssText: 'font-size:0.7rem; color:var(--text-muted);'
    });
    streakEl.appendChild(createElement('i', {
        className: 'fas fa-fire',
        cssText: 'color:#f59e0b;'
    }));
    streakEl.appendChild(document.createTextNode(` ${userData.streak || 0} dni`));

    textWrap.appendChild(nameEl);
    textWrap.appendChild(streakEl);

    info.appendChild(avatarWrap);
    info.appendChild(textWrap);

    const sendIcon = createElement('i', {
        className: 'fas fa-paper-plane',
        cssText: 'color:var(--primary); opacity:0.5;'
    });

    item.appendChild(info);
    item.appendChild(sendIcon);

    return item;
}

function switchHubTab(tab) {
    document.getElementById('tab-btn-subjects')?.classList.remove('active');
    document.getElementById('tab-btn-students')?.classList.remove('active');
    document.getElementById(`tab-btn-${tab}`)?.classList.add('active');

    const active = document.getElementById('chat-hub-active');
    const backBtn = document.getElementById('hub-back-btn');
    const tabs = document.getElementById('chat-hub-tabs');
    const titleSpan = document.getElementById('hub-title-span');
    const sel = document.getElementById('chat-hub-selection');

    if (active) active.style.display = 'none';
    if (backBtn) backBtn.style.display = 'none';
    if (tabs) tabs.style.display = 'flex';
    if (titleSpan) {
        clearElement(titleSpan);
        titleSpan.appendChild(createElement('i', { className: 'fas fa-layer-group' }));
        titleSpan.appendChild(document.createTextNode(` ${t('hubTitle')}`));
    }

    stopHubListeners();

    if (!sel) return;

    sel.style.display = 'flex';
    clearElement(sel);

    if (tab === 'subjects') {
        sel.appendChild(
            createHubItem(
                'GLOBAL',
                t('globalChat'),
                'fa-globe',
                'border-color:var(--primary); color:var(--primary);'
            )
        );

        const uniqueNames = new Map();

        ['TN', 'TP'].forEach(w => {
            for (let d = 0; d < 5; d++) {
                (scheduleData[w][d] || []).forEach((cls, cIdx) => {
                    const subjectName = safeText(cls.subject).trim();
                    if (subjectName && !uniqueNames.has(subjectName)) {
                        uniqueNames.set(subjectName, `${w}-${d}-${cIdx}`);
                    }
                });
            }
        });

        uniqueNames.forEach((chatId, subjectName) => {
            sel.appendChild(
                createHubItem(chatId, t_sub(subjectName), 'fa-comments')
            );
        });

    } else if (tab === 'students') {
        sel.appendChild(createChatEmptyGif('Szukam studentów...'));

        usersUnsubscribe = db.collection('users').onSnapshot(
            snap => {
                clearElement(sel);

                const now = new Date();
                const todayStr = formatDateStr(now);
                let found = 0;

                snap.forEach(docSnap => {
                    const u = docSnap.data() || {};

                    if (u.displayName && docSnap.id !== auth.currentUser?.uid) {
                        found++;

                        const chatId = [auth.currentUser?.uid, docSnap.id].sort().join('_');
                        sel.appendChild(
                            createDmUserItem(chatId, u, docSnap.id, todayStr)
                        );
                    }
                });

                if (found === 0) {
                    sel.appendChild(
                        createChatInfoMessage('Zaproś znajomych z roku do zalogowania!', {
                            cssText: 'text-align:center; padding:20px; font-size:0.9rem; color:var(--text-muted);'
                        })
                    );
                }
            },
            () => {
                clearElement(sel);
                sel.appendChild(
                    createChatInfoMessage('Brak dostępu lub błąd sieci.', {
                        cssText: 'text-align:center; color:var(--danger); padding:10px;'
                    })
                );
            }
        );
    }
}

function goBackToHub() {
    const activeTabBtn = document.querySelector('.hub-tab-btn.active');
    const tabToLoad = activeTabBtn ? activeTabBtn.id.replace('tab-btn-', '') : 'subjects';
    switchHubTab(tabToLoad);
}

function openSpecificChat(cardId, title) {
    currentActiveChatId = safeText(cardId).trim();

    const selection = document.getElementById('chat-hub-selection');
    const active = document.getElementById('chat-hub-active');
    const backBtn = document.getElementById('hub-back-btn');
    const tabs = document.getElementById('chat-hub-tabs');
    const titleSpan = document.getElementById('hub-title-span');
    const box = document.getElementById('global-chat-messages');

    if (selection) selection.style.display = 'none';
    if (active) active.style.display = 'flex';
    if (backBtn) backBtn.style.display = 'block';
    if (tabs) tabs.style.display = 'none';
    if (titleSpan) {
        clearElement(titleSpan);
        titleSpan.appendChild(createElement('i', { className: 'fas fa-comments' }));
        titleSpan.appendChild(document.createTextNode(` ${safeText(title)}`));
    }

    if (box) {
        clearElement(box);
        box.appendChild(createChatEmptyGif('Szukam wiadomości...'));
    }

    stopHubListeners();

    globalChatUnsubscribe = db.collection('chats')
        .where('classId', '==', currentActiveChatId)
        .orderBy('timestamp', 'asc')
        .onSnapshot(
            snap => {
                renderMessagesIntoBox(box, snap);
            },
            () => {
                if (!box) return;
                clearElement(box);
                box.appendChild(createChatErrorState('Zaloguj się przez Menu, aby czytać forum.'));
            }
        );
}

function sendHubChat() {
    const user = auth.currentUser;

    if (!user) {
        alert('Zaloguj się z Menu!');
        loginForSync();
        return;
    }

    if (!currentActiveChatId) return;

    const inp = document.getElementById('global-chat-input');
    if (!inp) return;

    const cleaned = sanitizeChatMessageText(inp.value);
    if (!cleaned) return;

    db.collection('chats').add({
        classId: currentActiveChatId,
        author: getUserShortName(user),
        text: cleaned,
        photoURL: sanitizeImageUrl(user.photoURL || '', ''),
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        uid: user.uid
    }).then(() => {
        inp.value = '';
        const picker = document.getElementById('global-emoji-picker');
        if (picker) picker.style.display = 'none';
    });
}

function initChatDelegation() {
    if (window.__chatDelegationInitialized) return;
    window.__chatDelegationInitialized = true;

    document.addEventListener('click', e => {
        const deleteBtn = e.target.closest('.js-delete-msg');
        if (deleteBtn) {
            e.preventDefault();
            e.stopPropagation();
            deleteMessage(deleteBtn.dataset.messageId);
            return;
        }

        const openChatBtn = e.target.closest('.js-open-specific-chat');
        if (openChatBtn) {
            e.preventDefault();
            e.stopPropagation();
            openSpecificChat(openChatBtn.dataset.chatId, openChatBtn.dataset.title);
        }
    });
}

initChatDelegation();