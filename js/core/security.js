// ==========================================
// 🛡️ SECURITY HELPERS
// ==========================================

function safeText(value, fallback = '') {
    if (value === null || value === undefined) return fallback;
    return String(value);
}

function escapeHTML(str) {
    return safeText(str).replace(/[&<>'"]/g, function(tag) {
        const charsToReplace = {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        };

        return charsToReplace[tag] || tag;
    });
}

function normalizePlainText(value, maxLength = 500) {
    let text = safeText(value)
        .replace(/\r?\n/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

    if (typeof maxLength === 'number' && maxLength > 0) {
        text = text.slice(0, maxLength);
    }

    return text;
}

function setSafeText(element, value, fallback = '') {
    if (!element) return;
    element.textContent = safeText(value, fallback);
}

function clearElement(element) {
    if (!element) return;
    element.replaceChildren();
}

function sanitizeImageUrl(url, fallback = '') {
    const raw = safeText(url).trim();
    if (!raw) return fallback;

    try {
        const parsed = new URL(raw, window.location.origin);
        const allowedProtocols = ['http:', 'https:', 'data:', 'blob:'];

        if (!allowedProtocols.includes(parsed.protocol)) {
            return fallback;
        }

        return parsed.href;
    } catch (e) {
        return fallback;
    }
}

function createElement(tag, options = {}) {
    const el = document.createElement(tag);

    if (options.className) el.className = options.className;
    if (options.id) el.id = options.id;
    if (options.type) el.type = options.type;
    if (options.placeholder !== undefined) el.placeholder = options.placeholder;
    if (options.value !== undefined) el.value = options.value;
    if (options.text !== undefined) el.textContent = safeText(options.text);
    if (options.contentEditable !== undefined) {
        el.contentEditable = options.contentEditable ? 'true' : 'false';
    }
    if (options.cssText) el.style.cssText = options.cssText;

    if (options.attrs) {
        Object.entries(options.attrs).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                el.setAttribute(key, value);
            }
        });
    }

    if (options.dataset) {
        Object.entries(options.dataset).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                el.dataset[key] = String(value);
            }
        });
    }

    if (options.events) {
        Object.entries(options.events).forEach(([eventName, handler]) => {
            if (typeof handler === 'function') {
                el.addEventListener(eventName, handler);
            }
        });
    }

    if (Array.isArray(options.children)) {
        options.children.forEach(child => {
            if (!child) return;

            if (child instanceof Node) {
                el.appendChild(child);
            } else {
                el.appendChild(document.createTextNode(safeText(child)));
            }
        });
    }

    return el;
}