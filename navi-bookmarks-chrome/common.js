// Shared utilities for Navi Bookmarks extension
// Used by both newtab.js and popup.js

const DEFAULT_CATEGORIES = ['常用', '开发工具', '搜索引擎', '学习资源', '社区论坛', '其他'];

const faviconServiceUrls = [
    'https://icon.horse/icon/',
    'https://favicon.im/',
    'https://www.google.com/s2/favicons?domain='
];

function escapeHtml(text) {
    if (text == null) return '';
    return String(text)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}

function isAllowedUrl(url) {
    if (!url || typeof url !== 'string') return false;
    return /^https?:\/\//i.test(url);
}

function normalizeUrl(url) {
    if (!url || typeof url !== 'string') return '';
    url = url.trim();
    if (!url) return '';
    if (/^(javascript|data|vbscript|file|about):/i.test(url)) return '';
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }
    return url;
}

function getRootDomain(url) {
    try {
        var hostname = new URL(url).hostname;
        var parts = hostname.split('.');
        return parts.length > 2 ? parts.slice(-2).join('.') : hostname;
    } catch (e) {
        return null;
    }
}

function imageToDataUrl(img) {
    var c = document.createElement('canvas');
    c.width = 64;
    c.height = 64;
    var ctx = c.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, 64, 64);
    ctx.drawImage(img, 0, 0, 64, 64);
    return c.toDataURL('image/png');
}

function loadFaviconAsImage(url, callback) {
    var img = new Image();
    var done = false;
    img.onload = function() {
        if (done) return;
        done = true;
        try {
            callback(null, imageToDataUrl(img));
        } catch (e) {
            callback(null, url);
        }
    };
    img.onerror = function() {
        if (done) return;
        done = true;
        callback('load failed');
    };
    img.src = url;
}

function fetchFavicon(url, callback) {
    var rootDomain = getRootDomain(url);
    if (!rootDomain) { callback(null); return; }
    var tried = 0;
    function tryNext() {
        if (tried >= faviconServiceUrls.length) { callback(null); return; }
        var service = faviconServiceUrls[tried];
        var serviceUrl = service.includes('domain=') ? service + rootDomain + '&sz=64' : service + rootDomain;
        tried++;
        var timeoutId = setTimeout(function() { tryNext(); }, 5000);
        loadFaviconAsImage(serviceUrl, function(err, result) {
            clearTimeout(timeoutId);
            if (err) {
                tryNext();
            } else {
                callback(result);
            }
        });
    }
    tryNext();
}

// Simple i18n helper that falls back to chrome.i18n.getMessage when available
function createI18nHelper(langPacks, activeLocale) {
    return function i18n(key, substitutions) {
        var pack = langPacks[activeLocale];
        if (pack && pack[key]) {
            var msg = pack[key].message;
            if (substitutions) {
                substitutions.forEach(function(val, idx) {
                    msg = msg.replace('$' + (idx + 1), val);
                });
            }
            return msg;
        }
        if (typeof chrome !== 'undefined' && chrome.i18n && chrome.i18n.getMessage) {
            return chrome.i18n.getMessage(key, substitutions);
        }
        return '';
    };
}
