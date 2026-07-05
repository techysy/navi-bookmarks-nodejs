const STORAGE_KEY = 'bookmarks';
const CATEGORY_STORAGE_KEY = 'categoryOrder';
const LANG_STORAGE_KEY = 'languagePreference';
const ICON_CACHE_KEY = 'popupIconCache';
const DEFAULT_CATEGORIES = ['常用', '开发工具', '搜索引擎', '学习资源', '社区论坛', '其他'];

let langPacks = {};
let activeLocale = 'zh_CN';
let currentIconType = 'emoji';
let currentIconValue = '🌐';

function i18n(key, substitutions) {
    if (langPacks[activeLocale] && langPacks[activeLocale][key]) {
        var msg = langPacks[activeLocale][key].message;
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
}

function applyI18n() {
    document.querySelectorAll('[data-i18n]').forEach(function(el) {
        var msg = i18n(el.dataset.i18n);
        if (msg) el.textContent = msg;
    });
    var titleEl = document.querySelector('[data-i18n="appName"]');
    if (titleEl) {
        var titleMsg = i18n('appName');
        if (titleMsg) document.title = titleMsg;
    }
}

function detectSystemLocale() {
    var lang = (typeof chrome !== 'undefined' && chrome.i18n) ? chrome.i18n.getUILanguage() : navigator.language;
    if (lang.startsWith('zh')) {
        if (lang === 'zh-TW' || lang === 'zh-HK' || lang === 'zh-MO') return 'zh_TW';
        return 'zh_CN';
    }
    if (lang.startsWith('ja')) return 'ja';
    if (lang.startsWith('ko')) return 'ko';
    if (lang.startsWith('de')) return 'de';
    if (lang.startsWith('fr')) return 'fr';
    if (lang.startsWith('vi')) return 'vi';
    if (lang.startsWith('th')) return 'th';
    if (lang.startsWith('ms')) return 'ms';
    return 'en';
}

function loadLangPacks() {
    return new Promise(function(resolve) {
        var locales = ['zh_CN', 'zh_TW', 'en', 'ja', 'ko', 'de', 'fr', 'vi', 'th', 'ms'];
        var loaded = 0;
        locales.forEach(function(locale) {
            var url = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL)
                ? chrome.runtime.getURL('_locales/' + locale + '/messages.json')
                : '_locales/' + locale + '/messages.json';
            fetch(url).then(function(r) { return r.json(); }).then(function(data) {
                langPacks[locale] = data;
                loaded++;
                if (loaded === locales.length) resolve();
            }).catch(function() {
                loaded++;
                if (loaded === locales.length) resolve();
            });
        });
    });
}

function loadLanguagePreference() {
    return new Promise(function(resolve) {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(LANG_STORAGE_KEY, function(result) {
                resolve(result[LANG_STORAGE_KEY] || 'system');
            });
        } else {
            resolve(localStorage.getItem(LANG_STORAGE_KEY) || 'system');
        }
    });
}

function categoryLabel(cat) {
    var map = {
        '常用': i18n('catFrequent') || '常用',
        '开发工具': i18n('catDevTools') || '开发工具',
        '搜索引擎': i18n('catSearchEngines') || '搜索引擎',
        '学习资源': i18n('catLearning') || '学习资源',
        '社区论坛': i18n('catCommunity') || '社区论坛',
        '其他': i18n('catOther') || '其他'
    };
    return map[cat] || cat;
}

async function getCurrentTab() {
    if (typeof chrome !== 'undefined' && chrome.tabs) {
        try {
            var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs && tabs.length > 0) return tabs[0];
        } catch (e) {}
    }
    return null;
}

function loadCategories() {
    return new Promise(function(resolve) {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(CATEGORY_STORAGE_KEY, function(result) {
                resolve(result[CATEGORY_STORAGE_KEY] || DEFAULT_CATEGORIES);
            });
        } else {
            resolve(DEFAULT_CATEGORIES);
        }
    });
}

function loadBookmarks() {
    return new Promise(function(resolve) {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(STORAGE_KEY, function(result) {
                resolve(result[STORAGE_KEY] || []);
            });
        } else {
            resolve([]);
        }
    });
}

function saveBookmarks(bookmarks) {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ [STORAGE_KEY]: bookmarks });
    }
}

function showToast(msg) {
    var toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = msg;
    document.body.appendChild(toast);
    setTimeout(function() { toast.remove(); }, 1600);
}

function getFaviconUrl(url) {
    try {
        var hostname = new URL(url).hostname;
        return 'https://www.google.com/s2/favicons?domain=' + hostname + '&sz=64';
    } catch (e) {
        return null;
    }
}

function fetchFavicon(url, callback) {
    var faviconUrl = getFaviconUrl(url);
    if (!faviconUrl) { callback(null); return; }
    fetch(faviconUrl).then(function(resp) {
        if (!resp.ok) throw new Error('fetch failed');
        var ct = resp.headers.get('content-type') || '';
        if (!ct.includes('image/')) throw new Error('not image');
        return resp.blob();
    }).then(function(blob) {
        return new Promise(function(resolve, reject) {
            var reader = new FileReader();
            reader.onloadend = function() { resolve(reader.result); };
            reader.onerror = reject;
            reader.readAsDataURL(blob);
        });
    }).then(function(dataUrl) {
        callback(dataUrl);
    }).catch(function() {
        callback(null);
    });
}

function updateIconPreview(imgUrl) {
    var previewText = document.getElementById('iconPreviewText');
    var previewImg = document.getElementById('iconPreviewImg');
    if (imgUrl) {
        previewText.style.display = 'none';
        previewImg.style.display = 'block';
        previewImg.src = imgUrl;
        currentIconType = 'favicon';
        currentIconValue = imgUrl;
    } else {
        previewImg.style.display = 'none';
        previewText.style.display = 'block';
        currentIconType = 'emoji';
        currentIconValue = '🌐';
        previewText.textContent = currentIconValue;
    }
}

function resetIcon() {
    currentIconType = 'emoji';
    currentIconValue = '🌐';
    document.getElementById('iconPreviewText').textContent = '🌐';
    document.getElementById('iconPreviewImg').style.display = 'none';
    document.getElementById('iconPreviewText').style.display = 'block';
}

async function init() {
    await loadLangPacks();
    var langPref = await loadLanguagePreference();
    activeLocale = langPref === 'system' ? detectSystemLocale() : langPref;
    applyI18n();

    var tab = await getCurrentTab();
    var titleEl = document.getElementById('tabTitle');
    var urlEl = document.getElementById('tabUrl');
    var addBtn = document.getElementById('addTabBtn');
    var categorySelect = document.getElementById('categorySelect');

    var categories = await loadCategories();
    categorySelect.innerHTML = categories
        .map(function(c) { return '<option value="' + c + '">' + categoryLabel(c) + '</option>'; })
        .join('');

    if (!tab || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        titleEl.textContent = i18n('alertNoTab') || '无法获取当前标签页';
        urlEl.textContent = '';
        addBtn.classList.add('popup-disabled');
        addBtn.disabled = true;
        return;
    }

    titleEl.textContent = tab.title || '(untitled)';
    urlEl.textContent = tab.url;

    var bookmarks = await loadBookmarks();
    var existingBookmark = bookmarks.find(function(b) { return b.url === tab.url; });
    var isAdded = !!existingBookmark;

    if (isAdded) {
        addBtn.textContent = i18n('btnUpdateCategory') || '更新分类';
        categorySelect.value = existingBookmark.category || '常用';
    }

    fetchFavicon(tab.url, function(faviconUrl) {
        if (faviconUrl) {
            if (existingBookmark && existingBookmark.iconType === 'favicon' && existingBookmark.iconValue) {
                updateIconPreview(existingBookmark.iconValue);
            } else {
                updateIconPreview(faviconUrl);
            }
        }
    });

    var pageDescription = '';
    fetch(tab.url).then(function(r) { return r.text(); }).then(function(html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var meta = doc.querySelector('meta[name="description"]') || doc.querySelector('meta[property="og:description"]');
        if (meta) {
            var desc = meta.getAttribute('content');
            if (desc && desc.trim()) {
                pageDescription = desc.trim();
            }
        }
    }).catch(function() {});

    document.getElementById('resetIconBtn').addEventListener('click', function() {
        resetIcon();
    });

    document.getElementById('fetchFaviconBtn').addEventListener('click', function() {
        if (!tab || !tab.url) return;
        fetchFavicon(tab.url, function(faviconUrl) {
            if (faviconUrl) {
                updateIconPreview(faviconUrl);
            }
        });
    });

    addBtn.addEventListener('click', async function() {
        if (addBtn.disabled) return;
        var category = categorySelect.value;

        if (isAdded) {
            bookmarks = bookmarks.map(function(b) {
                if (b.url === tab.url) {
                    return Object.assign({}, b, { category: category });
                }
                return b;
            });
            saveBookmarks(bookmarks);
            showToast(i18n('alertCategoryUpdated') ? i18n('alertCategoryUpdated').replace('$1', category) : '✓ 分类已更新为 ' + category);
            setTimeout(function() { window.close(); }, 800);
            return;
        }

        var maxId = bookmarks.length > 0 ? Math.max.apply(null, bookmarks.map(function(b) { return b.id; })) : 0;
        var icons = ['🌟', '⭐', '🔥', '💎', '🎯', '🎨', '🚀', '💡', '⚡', '🌈'];
        var randomIcon = icons[Math.floor(Math.random() * icons.length)];
        var bookmarkIcon = currentIconType === 'favicon' && currentIconValue ? currentIconValue : randomIcon;
        bookmarks.push({
            id: maxId + 1,
            name: tab.title || '',
            url: tab.url,
            icon: bookmarkIcon,
            iconType: currentIconType,
            iconValue: currentIconValue,
            description: pageDescription,
            category: category,
            order: bookmarks.length
        });
        saveBookmarks(bookmarks);
        showToast(i18n('alertImportSuccess') ? i18n('alertImportSuccess').replace('$1', '1') : '✓ 已添加');
        addBtn.disabled = true;
        addBtn.textContent = i18n('btnAdded') || '已添加';
        isAdded = true;
        existingBookmark = bookmarks[bookmarks.length - 1];
        setTimeout(function() { window.close(); }, 800);
    });

    document.getElementById('openNewTabBtn').addEventListener('click', function() {
        if (typeof chrome !== 'undefined' && chrome.tabs) {
            chrome.tabs.create({ url: 'newtab.html' });
        } else {
            window.open('newtab.html', '_blank');
        }
        window.close();
    });
}

document.addEventListener('DOMContentLoaded', init);
