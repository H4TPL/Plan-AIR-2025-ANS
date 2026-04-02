// ==========================================
// 🎨 MOTYWY / MENU MOTYWÓW / SIDEBAR
// ==========================================

function toggleSidebar() {
    const s = document.getElementById('sidebar');
    s.classList.toggle('active');

    document.getElementById('sidebar-overlay').style.display =
        s.classList.contains('active') ? 'block' : 'none';
}

function toggleThemeMenu() {
    const m = document.getElementById('theme-options');
    m.style.display = m.style.display === 'none' ? 'flex' : 'none';
}

function setTheme(t_val) {
    document.body.className = '';

    if (t_val !== 'light') {
        document.body.classList.add(`theme-${t_val}`);
    }

    localStorage.setItem('smartPlanTheme', t_val);

    const m = document.getElementById('meta-theme-color');
    if (!m) return;

    if (t_val === 'matrix') m.content = '#000000';
    else if (t_val === 'cad') m.content = '#004488';
    else if (t_val === 'dark') m.content = '#111827';
    else if (t_val === 'uwu') m.content = '#ff66b2';
    else if (t_val === 'ans') m.content = '#006633';
    else m.content = '#4f46e5';
}

function initTheme() {
    const savedTheme = localStorage.getItem('smartPlanTheme');
    if (savedTheme) {
        setTheme(savedTheme);
    }
}