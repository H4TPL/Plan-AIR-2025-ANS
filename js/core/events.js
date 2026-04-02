// ==========================================
// 🖱️ STATYCZNE EVENTY / MODALE / UI
// ==========================================

function showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function initModalCloseEvents() {
    if (window.__modalCloseEventsInitialized) return;
    window.__modalCloseEventsInitialized = true;

    document.addEventListener('click', e => {
        const closeBtn = e.target.closest('[data-close-modal]');
        if (closeBtn) {
            e.preventDefault();
            e.stopPropagation();

            const modalId = closeBtn.getAttribute('data-close-modal');
            if (modalId) {
                hideModal(modalId);
            }
            return;
        }

        const modal = e.target.closest('.modal');
        if (modal && e.target === modal) {
            modal.style.display = 'none';
        }
    });
}

function initStaticEvents() {
    if (window.__staticEventsInitialized) return;
    window.__staticEventsInitialized = true;

    const on = (id, eventName, handler) => {
        const el = document.getElementById(id);
        if (el) el.addEventListener(eventName, handler);
    };

    // ==========================================
    // Overlay / sidebar / topbar
    // ==========================================
    on('mute-alert-done-btn', 'click', () => {
        const overlay = document.getElementById('mute-alert-overlay');
        if (overlay) overlay.style.display = 'none';
    });

    on('update-banner', 'click', applyUpdate);
    on('sidebar-overlay', 'click', toggleSidebar);
    on('sidebar-close-btn', 'click', toggleSidebar);

    on('title-group-btn', 'click', releaseTheCat);

    on('hamburger-btn', 'click', e => {
        e.stopPropagation();
        toggleSidebar();
    });

    // ==========================================
    // Language
    // ==========================================
    on('lang-btn-pl', 'click', () => setLanguage('pl'));
    on('lang-btn-en', 'click', () => setLanguage('en'));

    // ==========================================
    // Sidebar menu
    // ==========================================
    on('login-menu-btn', 'click', loginForSync);
    on('admin-panel-btn', 'click', openAdminPanel);
    on('directory-open-btn', 'click', openDirectoryModal);
    on('radar-open-btn', 'click', openRadar);
    on('grades-open-btn', 'click', openGradesModal);
    on('tasks-open-btn', 'click', openGlobalTasksModal);
    on('attendance-open-btn', 'click', openAttendanceModal);
    on('theme-toggle-btn', 'click', toggleThemeMenu);
    on('export-btn', 'click', exportICS);
    on('qr-open-btn', 'click', showQRCode);

    on('hard-reset-btn', 'click', () => {
        if (!confirm('Czy na pewno chcesz usunąć lokalne dane aplikacji?')) return;

        if (typeof hardResetLocalData === 'function') {
            hardResetLocalData();
        } else {
            localStorage.removeItem('smartPlanData');
            localStorage.removeItem('smartPlanGrades');
        }

        window.location.reload();
    });

    // ==========================================
    // Theme buttons
    // ==========================================
    on('theme-light-btn', 'click', () => setTheme('light'));
    on('theme-dark-btn', 'click', () => setTheme('dark'));
    on('theme-matrix-btn', 'click', () => setTheme('matrix'));
    on('theme-cad-btn', 'click', () => setTheme('cad'));
    on('theme-uwu-btn', 'click', () => setTheme('uwu'));
    on('theme-ans-btn', 'click', () => setTheme('ans'));

    // ==========================================
    // Search / week nav / top actions
    // ==========================================
    on('searchInput', 'input', renderCalendar);
    on('today-btn', 'click', jumpToToday);
    on('open-class-modal-btn', 'click', openModal);
    on('prev-week-btn', 'click', () => changeWeek(-1));
    on('next-week-btn', 'click', () => changeWeek(1));
    on('open-date-picker-btn', 'click', openCustomDatePicker);

    // ==========================================
    // Footer links
    // ==========================================
    on('open-changelog-btn', 'click', e => {
        e.preventDefault();
        showModal('changelogModal');
    });

    on('privacy-btn', 'click', e => {
        e.preventDefault();
        alert(t('privacyText'));
    });

    on('bug-open-btn', 'click', e => {
        e.preventDefault();
        openBugModal();
    });

    // ==========================================
    // Global chat
    // ==========================================
    on('global-chat-btn', 'click', toggleGlobalChat);
    on('global-chat-close-btn', 'click', toggleGlobalChat);
    on('hub-back-btn', 'click', goBackToHub);
    on('tab-btn-subjects', 'click', () => switchHubTab('subjects'));
    on('tab-btn-students', 'click', () => switchHubTab('students'));
    on('global-chat-emoji-btn', 'click', () => toggleEmojiPicker('global-chat-input'));
    on('global-chat-send-btn', 'click', sendHubChat);

    on('global-chat-input', 'keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendHubChat();
        }
    });

    // delegacja emoji
    document.addEventListener('click', e => {
        const emojiItem = e.target.closest('.emoji-item');
        if (!emojiItem) return;

        insertEmoji('global-chat-input', emojiItem.dataset.emoji || emojiItem.textContent || '');
    });

    // ==========================================
    // Class modal
    // ==========================================
    on('class-modal-cancel-btn', 'click', closeModal);
    on('saveBtn', 'click', saveClass);

    // ==========================================
    // Custom date picker
    // ==========================================
    on('picker-prev-btn', 'click', () => changePickerMonth(-1));
    on('picker-next-btn', 'click', () => changePickerMonth(1));
    on('picker-today-btn', 'click', () => {
        jumpToToday();
        closeCustomDatePicker();
    });

    // ==========================================
    // Bug modal
    // ==========================================
    on('bug-send-btn', 'click', sendBugReport);

    // ==========================================
    // Directory tabs
    // ==========================================
    on('dir-tab-lecturer', 'click', () => switchDirectoryTab('lecturer'));
    on('dir-tab-room', 'click', () => switchDirectoryTab('room'));
}