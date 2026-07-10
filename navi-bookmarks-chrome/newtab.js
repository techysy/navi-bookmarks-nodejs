const STORAGE_KEY = 'bookmarks';
const CATEGORY_STORAGE_KEY = 'categoryOrder';
const BG_STORAGE_KEY = 'backgroundStyle';
const LANG_STORAGE_KEY = 'languagePreference';
const OPEN_CURRENT_TAB_KEY = 'openWithCurrentTab';
const DEFAULT_ENGINE_KEY = 'defaultSearchEngine';

const CONFIG = {
    enableImportExport: true
};

let langPacks = {};
let currentLangPref = 'system';
let activeLocale = 'zh_CN';

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
    document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
        var msg = i18n(el.dataset.i18nPlaceholder);
        if (msg) el.placeholder = msg;
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
                currentLangPref = result[LANG_STORAGE_KEY] || 'system';
                resolve();
            });
        } else {
            currentLangPref = localStorage.getItem(LANG_STORAGE_KEY) || 'system';
            resolve();
        }
    });
}

function saveLanguagePreference(pref) {
    currentLangPref = pref;
    activeLocale = pref === 'system' ? detectSystemLocale() : pref;
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ [LANG_STORAGE_KEY]: pref });
    } else {
        localStorage.setItem(LANG_STORAGE_KEY, pref);
    }
}

function initLangSelector() {
    var select = document.getElementById('langSelect');
    if (!select) return;
    select.value = currentLangPref;
    select.addEventListener('change', function() {
        saveLanguagePreference(this.value);
        applyI18n();
        refreshDynamicContent();
    });
}

function refreshDynamicContent() {
    var engineInfo = searchEngines[currentSearchEngine];
    document.getElementById('currentEngineIcon').textContent = engineInfo.icon;
    document.getElementById('currentEngineName').textContent = engineInfo.nameKey ? i18n(engineInfo.nameKey) : engineInfo.name;
    renderCategories();
    renderBookmarks();
    var catList = document.getElementById('categoryList');
    if (catList && catList.innerHTML) {
        renderCategoryList();
    }
}

function categoryLabel(cat) {
    var map = {
        '常用': i18n('catFrequent') || '常用',
        '开发工具': i18n('catDevTools') || '开发工具',
        '搜索引擎': i18n('catSearchEngines') || '搜索引擎',
        '学习资源': i18n('catLearning') || '学习资源',
        '社区论坛': i18n('catCommunity') || '社区论坛',
        '其他': i18n('catOther') || '其他',
        '全部': i18n('catAll') || '全部'
    };
    return map[cat] || cat;
}

const bgPresets = [
    { id: 'gradient1', labelKey: 'bgPresetPurpleBlue', css: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { id: 'gradient2', labelKey: 'bgPresetSunset', css: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' },
    { id: 'gradient3', labelKey: 'bgPresetDeepSea', css: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' },
    { id: 'gradient4', labelKey: 'bgPresetForest', css: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)' },
    { id: 'gradient5', labelKey: 'bgPresetNightPurple', css: 'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)' },
    { id: 'gradient6', labelKey: 'bgPresetAurora', css: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' },
    { id: 'grassland', labelKey: 'bgPresetZoige', css: 'Zoigê.JPG', thumb: 'Zoigê - mini.JPG' }
];

let currentBgStyle = null;

const defaultBookmarks = [
    { id: 1, nameKey: 'myWeibo', url: 'https://weibo.com', icon: '📱', category: '常用' },
    { id: 2, nameKey: 'myGithub', url: 'https://github.com', icon: '👨‍💻', category: '常用' },
    { id: 3, name: 'Google', url: 'https://www.google.com', icon: '🔍', category: '搜索引擎' },
    { id: 4, name: 'GitHub', url: 'https://github.com', icon: '💻', category: '开发工具' },
    { id: 5, name: 'Stack Overflow', url: 'https://stackoverflow.com', icon: '❓', category: '社区论坛' },
    { id: 6, name: 'MDN Web Docs', url: 'https://developer.mozilla.org', icon: '📖', category: '学习资源' },
    { id: 7, name: 'Vue.js', url: 'https://vuejs.org', icon: '💚', category: '开发工具' },
    { id: 8, name: 'React', url: 'https://react.dev', icon: '⚛️', category: '开发工具' },
    { id: 9, name: 'TypeScript', url: 'https://www.typescriptlang.org', icon: '📘', category: '开发工具' },
    { id: 10, nameKey: 'juejin', url: 'https://juejin.cn', icon: '⛏️', category: '社区论坛' },
    { id: 11, name: 'SegmentFault', url: 'https://segmentfault.com', icon: '💡', category: '社区论坛' },
    { id: 12, name: 'CSDN', url: 'https://www.csdn.net', icon: '📝', category: '社区论坛' },
    { id: 13, name: 'LeetCode', url: 'https://leetcode.cn', icon: '🧮', category: '学习资源' },
    { id: 14, name: 'Baidu', url: 'https://www.baidu.com', icon: '🅱️', category: '搜索引擎' },
    { id: 15, name: 'npm', url: 'https://www.npmjs.com', icon: '📦', category: '开发工具' },
    { id: 16, name: 'Docker', url: 'https://www.docker.com', icon: '🐳', category: '开发工具' }
];

function getBookmarkName(bookmark) {
    if (bookmark.nameKey) return i18n(bookmark.nameKey) || bookmark.nameKey;
    return bookmark.name || '';
}

let defaultCategories = ['常用', '开发工具', '搜索引擎', '学习资源', '社区论坛', '其他'];
let categories = ['全部', ...defaultCategories];
let bookmarks = [];
let currentCategory = '常用';
let draggedItem = null;
let currentSearchEngine = 'google';

const searchEngines = {
    google: { name: 'Google', icon: '🔍', url: 'https://www.google.com/search?q=' },
    baidu: { nameKey: 'baidu', icon: '🔍', url: 'https://www.baidu.com/s?wd=' },
    bing: { nameKey: 'bing', icon: '🅱️', url: 'https://www.bing.com/search?q=' },
    duckduckgo: { name: 'DuckDuckGo', icon: '🦆', url: 'https://duckduckgo.com/?q=' }
};

function createBubbleOverlay() {
    var overlay = document.createElement('div');
    overlay.className = 'bubble-overlay';
    document.body.appendChild(overlay);
    return overlay;
}

function showAlert(message) {
    return new Promise(function(resolve) {
        var overlay = createBubbleOverlay();
        var bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.innerHTML =
            '<div class="bubble-message">' + message + '</div>' +
            '<div class="bubble-btn-group">' +
            '<button class="bubble-btn bubble-btn-ok">' + i18n('btnOk') + '</button>' +
            '</div>';
        overlay.appendChild(bubble);
        bubble.querySelector('.bubble-btn-ok').addEventListener('click', function() {
            overlay.remove();
            resolve();
        });
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) { overlay.remove(); resolve(); }
        });
    });
}

function showToast(message) {
    var toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.textContent = message;
    document.body.appendChild(toast);
    requestAnimationFrame(function() { toast.classList.add('show'); });
    setTimeout(function() {
        toast.classList.remove('show');
        setTimeout(function() { toast.remove(); }, 300);
    }, 1500);
}

function showConfirm(message, danger) {
    return new Promise(function(resolve) {
        var overlay = createBubbleOverlay();
        var bubble = document.createElement('div');
        bubble.className = 'bubble';
        var confirmClass = danger ? 'bubble-btn bubble-btn-danger' : 'bubble-btn bubble-btn-confirm';
        bubble.innerHTML =
            '<div class="bubble-message">' + message + '</div>' +
            '<div class="bubble-btn-group">' +
            '<button class="bubble-btn bubble-btn-cancel">' + i18n('btnCancel') + '</button>' +
            '<button class="' + confirmClass + '">' + i18n('btnConfirm') + '</button>' +
            '</div>';
        overlay.appendChild(bubble);
        bubble.querySelector('.bubble-btn-cancel').addEventListener('click', function() {
            overlay.remove();
            resolve(false);
        });
        bubble.querySelector('[class*="btn-confirm"], [class*="btn-danger"]').addEventListener('click', function() {
            overlay.remove();
            resolve(true);
        });
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) { overlay.remove(); resolve(false); }
        });
    });
}

function showPrompt(message, defaultValue) {
    return new Promise(function(resolve) {
        var overlay = createBubbleOverlay();
        var bubble = document.createElement('div');
        bubble.className = 'bubble';
        bubble.innerHTML =
            '<div class="bubble-message">' + message + '</div>' +
            '<input class="bubble-input" type="text" value="' + (defaultValue || '') + '">' +
            '<div class="bubble-btn-group">' +
            '<button class="bubble-btn bubble-btn-cancel">' + i18n('btnCancel') + '</button>' +
            '<button class="bubble-btn bubble-btn-confirm">' + i18n('btnConfirm') + '</button>' +
            '</div>';
        overlay.appendChild(bubble);
        var input = bubble.querySelector('.bubble-input');
        input.focus();
        input.select();
        bubble.querySelector('.bubble-btn-cancel').addEventListener('click', function() {
            overlay.remove();
            resolve(null);
        });
        bubble.querySelector('.bubble-btn-confirm').addEventListener('click', function() {
            overlay.remove();
            resolve(input.value);
        });
        input.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                overlay.remove();
                resolve(input.value);
            } else if (e.key === 'Escape') {
                overlay.remove();
                resolve(null);
            }
        });
        overlay.addEventListener('click', function(e) {
            if (e.target === overlay) { overlay.remove(); resolve(null); }
        });
    });
}

function openBookmark(url) {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(OPEN_CURRENT_TAB_KEY, function(result) {
            var openInCurrent = !!result[OPEN_CURRENT_TAB_KEY];
            if (openInCurrent) {
                window.location.href = url;
            } else {
                if (typeof chrome !== 'undefined' && chrome.tabs) {
                    chrome.tabs.create({ url: url });
                } else {
                    window.open(url, '_blank');
                }
            }
        });
    } else {
        window.open(url, '_blank');
    }
}

function truncateUrl(url) {
    const maxLength = 20;
    if (url.length <= maxLength) return url;
    return url.substring(0, maxLength) + '...';
}

function loadCategoryOrder() {
    return new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(CATEGORY_STORAGE_KEY, (result) => {
                if (result[CATEGORY_STORAGE_KEY]) {
                    defaultCategories = result[CATEGORY_STORAGE_KEY];
                }
                resolve();
            });
        } else {
            const saved = localStorage.getItem(CATEGORY_STORAGE_KEY);
            if (saved) {
                try {
                    defaultCategories = JSON.parse(saved);
                } catch {
                    defaultCategories = ['常用', '开发工具', '搜索引擎', '学习资源', '社区论坛', '其他'];
                }
            }
            resolve();
        }
    });
}

function loadBookmarks() {
    return new Promise((resolve) => {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(STORAGE_KEY, (result) => {
                if (result[STORAGE_KEY]) {
                    bookmarks = result[STORAGE_KEY].map((item, index) => ({
                        ...item,
                        nameKey: item.nameKey || undefined,
                        order: item.order !== undefined ? item.order : index
                    }));
                    bookmarks.sort((a, b) => a.order - b.order);
                } else {
                    bookmarks = defaultBookmarks.map((item, index) => ({
                        ...item,
                        order: index
                    }));
                }
                resolve();
            });
        } else {
            const stored = localStorage.getItem(STORAGE_KEY);
            if (stored) {
                bookmarks = JSON.parse(stored);
            } else {
                bookmarks = defaultBookmarks.map((item, index) => ({
                    ...item,
                    order: index
                }));
            }
            resolve();
        }
    });
}

function saveBookmarks() {
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ [STORAGE_KEY]: bookmarks });
    } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(bookmarks));
    }
}

function toggleSearchEngineDropdown() {
    document.getElementById('searchEngineDropdown').classList.toggle('active');
}

function selectSearchEngine(engine) {
    if (engine === 'bookmarks') engine = 'google';
    currentSearchEngine = engine;
    const engineInfo = searchEngines[engine];
    document.getElementById('currentEngineIcon').textContent = engineInfo.icon;
    document.getElementById('currentEngineName').textContent = engineInfo.nameKey ? i18n(engineInfo.nameKey) : engineInfo.name;
    document.querySelectorAll('.search-dropdown-item').forEach(item => {
        item.classList.remove('selected');
    });
    var targetItem = document.querySelector('[data-engine="' + engine + '"]');
    if (targetItem) targetItem.classList.add('selected');
    document.getElementById('searchEngineDropdown').classList.remove('active');
    var defaultSelect = document.getElementById('defaultEngineSelect');
    if (defaultSelect) defaultSelect.value = engine;
    const input = document.getElementById('searchInput');
    if (input.value.trim()) {
        performSearch(input.value.trim());
    }
}

function searchBookmarks(query) {
    const lowerQuery = query.toLowerCase();
    return bookmarks.filter(bookmark =>
        bookmark.name.toLowerCase().includes(lowerQuery) ||
        bookmark.url.toLowerCase().includes(lowerQuery) ||
        bookmark.description && bookmark.description.toLowerCase().includes(lowerQuery) ||
        bookmark.category.toLowerCase().includes(lowerQuery)
    );
}

function performSearch(query) {
    const results = searchBookmarks(query);
    const resultsContainer = document.getElementById('searchResults');

    if (results.length === 0) {
        resultsContainer.innerHTML =
            '<div class="search-no-results">' + i18n('noResults') + '</div>' +
            '<div class="search-suggestions">' +
            '<div class="suggestion-title">' + i18n('searchInEngines') + '</div>' +
            '<div class="suggestion-item" data-action="search-engine" data-engine="bing" data-query="' + query + '">' +
            '<span class="search-icon">🅱️</span>' +
            '<span class="text">' + i18n('bingSearch') + ' "' + query + '"</span>' +
            '</div>' +
            '<div class="suggestion-item" data-action="search-engine" data-engine="baidu" data-query="' + query + '">' +
            '<span class="search-icon">🔍</span>' +
            '<span class="text">' + i18n('baiduSearch') + ' "' + query + '"</span>' +
            '</div>' +
            '</div>';
    } else {
        resultsContainer.innerHTML = results.map(function(bookmark) {
            return '<div class="search-result-item" data-action="open-bookmark" data-url="' + bookmark.url + '">' +
                '<div class="icon">' + bookmark.icon + '</div>' +
                '<div class="info">' +
                '<div class="name">' + getBookmarkName(bookmark) + '</div>' +
                '<div class="url">' + truncateUrl(bookmark.url) + '</div>' +
                '</div>' +
                '<span class="category">' + bookmark.category + '</span>' +
                '</div>';
        }).join('');
    }
}

function performEnterSearch() {
    const input = document.getElementById('searchInput');
    const query = input.value.trim();
    if (query) {
        const results = searchBookmarks(query);
        if (results.length > 0) {
            openBookmark(results[0].url);
        } else {
            openBookmark(searchEngines[currentSearchEngine].url + encodeURIComponent(query));
        }
        document.getElementById('searchResults').innerHTML = '';
        input.value = '';
    }
}

function updateCategories() {
    const allCategories = [...new Set(bookmarks.map(function(b) { return b.category; }))];
    const defaultCats = defaultCategories.filter(function(cat) { return cat !== '其他'; });
    const sortedCategories = [...defaultCats];
    const customCategories = allCategories.filter(function(cat) { return !defaultCats.includes(cat) && cat !== '其他'; });
    customCategories.sort();
    sortedCategories.push(...customCategories);
    if (allCategories.includes('其他') || !sortedCategories.includes('其他')) {
        sortedCategories.push('其他');
    }
    categories = ['全部', ...sortedCategories];
    renderCategories();
    updateCategorySelect();
}

function updateCategorySelect() {
    const select = document.getElementById('categoryInput');
    const currentValue = select.value;
    select.innerHTML = categories
        .filter(function(c) { return c !== '全部'; })
        .map(function(c) { return '<option value="' + c + '">' + categoryLabel(c) + '</option>'; })
        .join('') + '<option value="__new__">' + i18n('btnAddNewCategory') + '</option>';
    if (categories.includes(currentValue)) {
        select.value = currentValue;
    }
}

function renderCategories() {
    const filter = document.getElementById('categoryFilter');
    filter.innerHTML = categories.map(function(cat) {
        return '<button class="category-tag ' + (cat === currentCategory ? 'active' : '') + '" data-category="' + cat + '">' + categoryLabel(cat) + '</button>';
    }).join('');
}

function filterByCategory(category) {
    currentCategory = category;
    renderCategories();
    renderBookmarks();
}

function renderBookmarks() {
    const content = document.getElementById('bookmarkContent');

    if (bookmarks.length === 0) {
        content.innerHTML = '<div class="empty-state"><h3>' + i18n('emptyStateTitle') + '</h3><p>' + i18n('emptyStateDesc') + '</p></div>';
        return;
    }

    const grouped = bookmarks.reduce(function(groups, bookmark) {
        if (!groups[bookmark.category]) {
            groups[bookmark.category] = [];
        }
        groups[bookmark.category].push(bookmark);
        return groups;
    }, {});

    let displayCategories;
    if (currentCategory === '全部') {
        const defaultCats = defaultCategories.filter(function(cat) { return cat !== '其他' && Object.keys(grouped).includes(cat); });
        displayCategories = Object.keys(grouped).sort(function(a, b) {
            if (a === '其他') return 1;
            if (b === '其他') return -1;
            const indexA = defaultCats.indexOf(a);
            const indexB = defaultCats.indexOf(b);
            if (indexA !== -1 && indexB !== -1) return indexA - indexB;
            if (indexA !== -1) return -1;
            if (indexB !== -1) return 1;
            return a.localeCompare(b);
        });
    } else {
        displayCategories = [currentCategory];
    }

    content.innerHTML = displayCategories.map(function(category) {
        const items = grouped[category] || [];
        return '<div class="bookmark-section">' +
            '<div class="section-header"><h2>' + categoryLabel(category) + '</h2><span class="count">' + items.length + '</span></div>' +
            '<div class="bookmark-grid">' +
            (items.length > 0 ? items.map(function(bookmark) {
                var iconHtml = renderBookmarkIcon(bookmark);
                return '<div class="bookmark-card" draggable="true" data-id="' + bookmark.id + '">' +
                    '<div class="card-click-area" data-action="open-bookmark" data-url="' + bookmark.url + '">' +
                    '<div class="icon">' + iconHtml + '</div>' +
                    '<h3>' + getBookmarkName(bookmark) + '</h3>' +
                    '</div>' +
                    '<p>' + truncateUrl(bookmark.url) + '</p>' +
                    (bookmark.description ? '<p class="description" data-action="edit" data-id="' + bookmark.id + '" title="' + i18n('btnEdit') + '">' + bookmark.description + '</p>' : '') +
                    '<span class="category-badge">' + categoryLabel(bookmark.category) + '</span>' +
                    '<div class="actions">' +
                    '<button class="edit-btn" data-action="edit" data-id="' + bookmark.id + '">' + i18n('btnEdit') + '</button>' +
                    '<button class="delete-btn" data-action="delete" data-id="' + bookmark.id + '">' + i18n('btnDelete') + '</button>' +
                    '</div>' +
                    '</div>';
            }).join('') :
            '<div class="bookmark-card add-card" data-action="add-with-category" data-category="' + category + '">' +
            '<div class="add-icon">+</div><h3>' + i18n('addCardTitle') + '</h3><p>' + i18n('addCardDesc') + '</p></div>') +
            '</div></div>';
    }).join('');
}

function setupBookmarkEvents() {
    var content = document.getElementById('bookmarkContent');

    content.addEventListener('click', function(e) {
        var clickArea = e.target.closest('.card-click-area');
        if (clickArea) {
            e.preventDefault();
            openBookmark(clickArea.dataset.url);
            return;
        }
        var target = e.target.closest('[data-action]');
        if (!target) return;
        var action = target.dataset.action;
        if (action === 'edit') {
            e.stopPropagation();
            openEditModal(parseInt(target.dataset.id));
        } else if (action === 'delete') {
            e.stopPropagation();
            deleteBookmark(parseInt(target.dataset.id));
        } else if (action === 'add-with-category') {
            openAddModalWithCategory(target.dataset.category);
        }
    });

    content.addEventListener('dragstart', function(e) {
        var card = e.target.closest('.bookmark-card');
        if (!card) return;
        draggedItem = card;
        card.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', card.dataset.id);
        document.getElementById('categoryFilter').classList.add('drag-active');
    });

    content.addEventListener('dragend', function(e) {
        if (draggedItem) {
            draggedItem.classList.remove('dragging');
        }
        document.querySelectorAll('.bookmark-card').forEach(function(card) {
            card.classList.remove('drag-over');
        });
        document.getElementById('categoryFilter').classList.remove('drag-active');
        document.querySelectorAll('.category-tag').forEach(function(tag) {
            tag.classList.remove('drag-over');
        });
        draggedItem = null;
    });

    content.addEventListener('dragover', function(e) {
        if (!draggedItem) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        document.querySelectorAll('.bookmark-card').forEach(function(card) {
            if (card !== draggedItem) card.classList.remove('drag-over');
        });
        var card = e.target.closest('.bookmark-card');
        if (card) card.classList.add('drag-over');
    });

    content.addEventListener('drop', function(e) {
        if (!draggedItem) return;
        e.preventDefault();
        var draggedId = parseInt(draggedItem.dataset.id);
        var dropTarget = e.target.closest('.bookmark-card');
        if (!dropTarget || draggedId === parseInt(dropTarget.dataset.id)) return;
        var dropId = parseInt(dropTarget.dataset.id);
        var draggedIndex = bookmarks.findIndex(function(b) { return b.id === draggedId; });
        var dropIndex = bookmarks.findIndex(function(b) { return b.id === dropId; });
        if (draggedIndex !== -1 && dropIndex !== -1) {
            var draggedItemData = bookmarks.splice(draggedIndex, 1)[0];
            bookmarks.splice(dropIndex, 0, draggedItemData);
            bookmarks.forEach(function(bookmark, index) { bookmark.order = index; });
            saveBookmarks();
            renderBookmarks();
        }
    });
}

let formDirty = false;
function setFormDirty() { formDirty = true; }
function clearFormDirtyFlag() { formDirty = false; }
function hasUnsavedChanges() { return formDirty; }

function openAddModal() {
    clearFormDirtyFlag();
    document.getElementById('modalTitle').textContent = i18n('modalAddBookmark');
    document.getElementById('editId').value = '';
    document.getElementById('nameInput').value = '';
    document.getElementById('urlInput').value = '';
    document.getElementById('descriptionInput').value = '';
    document.getElementById('categoryInput').value = currentCategory === '全部' ? '常用' : currentCategory;
    document.getElementById('newCategoryGroup').style.display = 'none';
    resetIcon();
    document.getElementById('faviconList').style.display = 'none';
    document.getElementById('modalOverlay').classList.add('active');
}

function openAddModalWithCategory(category) {
    clearFormDirtyFlag();
    document.getElementById('modalTitle').textContent = i18n('modalAddBookmark');
    document.getElementById('editId').value = '';
    document.getElementById('nameInput').value = '';
    document.getElementById('urlInput').value = '';
    document.getElementById('descriptionInput').value = '';
    document.getElementById('categoryInput').value = category;
    document.getElementById('newCategoryGroup').style.display = 'none';
    resetIcon();
    document.getElementById('faviconList').style.display = 'none';
    document.getElementById('modalOverlay').classList.add('active');
}

async function openAddModalWithCurrentTab() {
    var tab = null;
    if (typeof chrome !== 'undefined' && chrome.tabs) {
        try {
            var tabs = await chrome.tabs.query({ active: true, currentWindow: true });
            if (tabs && tabs.length > 0) tab = tabs[0];
        } catch (e) {}
    }
    if (!tab || !tab.url || tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        showAlert(i18n('alertNoTab'));
        return;
    }
    clearFormDirtyFlag();
    document.getElementById('modalTitle').textContent = i18n('modalAddBookmark');
    document.getElementById('editId').value = '';
    document.getElementById('nameInput').value = tab.title || '';
    document.getElementById('urlInput').value = tab.url || '';
    document.getElementById('descriptionInput').value = '';
    document.getElementById('categoryInput').value = currentCategory === '全部' ? '常用' : currentCategory;
    document.getElementById('newCategoryGroup').style.display = 'none';
    resetIcon();
    document.getElementById('faviconList').style.display = 'none';
    document.getElementById('modalOverlay').classList.add('active');
    document.getElementById('fabMenu').classList.remove('active');
}

function openEditModal(id) {
    clearFormDirtyFlag();
    const bookmark = bookmarks.find(function(b) { return b.id === id; });
    if (bookmark) {
        document.getElementById('modalTitle').textContent = i18n('modalEditBookmark');
        document.getElementById('editId').value = id;
        document.getElementById('nameInput').value = getBookmarkName(bookmark);
        document.getElementById('urlInput').value = bookmark.url;
        document.getElementById('descriptionInput').value = bookmark.description || '';
        document.getElementById('categoryInput').value = bookmark.category;
        document.getElementById('newCategoryGroup').style.display = 'none';
        currentIconType = bookmark.iconType || 'emoji';
        currentIconValue = bookmark.iconValue || bookmark.icon || '🌟';
        document.getElementById('iconTypeInput').value = currentIconType;
        document.getElementById('iconValueInput').value = currentIconValue;
        if (currentIconType === 'favicon' && currentIconValue) {
            document.getElementById('iconPreviewText').style.display = 'none';
            document.getElementById('iconPreviewImg').style.display = 'block';
            document.getElementById('iconPreviewImg').src = currentIconValue;
        } else {
            document.getElementById('iconPreviewImg').style.display = 'none';
            document.getElementById('iconPreviewText').style.display = 'block';
            document.getElementById('iconPreviewText').textContent = currentIconValue;
        }
        document.getElementById('faviconList').style.display = 'none';
        document.getElementById('modalOverlay').classList.add('active');
    }
}

async function closeModal(force) {
    if (!force && hasUnsavedChanges()) {
        if (!await showConfirm(i18n('confirmUnsavedChanges'))) return;
    }
    document.getElementById('modalOverlay').classList.remove('active');
    clearFormDirtyFlag();
}

function saveBookmark() {
    const id = document.getElementById('editId').value;
    const name = document.getElementById('nameInput').value.trim();
    let url = document.getElementById('urlInput').value.trim();
    const description = document.getElementById('descriptionInput').value.trim();
    let category = document.getElementById('categoryInput').value;
    const iconType = document.getElementById('iconTypeInput').value || 'emoji';
    const iconValue = document.getElementById('iconValueInput').value || '';

    if (!name || !url) {
        showAlert(i18n('alertFillComplete'));
        return;
    }
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
        url = 'http://' + url;
    }
    if (category === '__new__') {
        const newCategory = document.getElementById('newCategoryInput').value.trim();
        if (!newCategory) {
            showAlert(i18n('alertEnterNewCategoryName'));
            return;
        }
        category = newCategory;
    }

    const icons = ['🌟', '⭐', '🔥', '💎', '🎯', '🎨', '🚀', '💡', '🎯', '⚡', '🌈', '🎪', '🎭', '🎬', '🎨'];
    const randomIcon = icons[Math.floor(Math.random() * icons.length)];

    var bookmarkIcon = iconType === 'favicon' && iconValue ? iconValue : (iconValue || randomIcon);
    var bookmarkIconType = iconType;
    var bookmarkIconValue = iconValue || randomIcon;

    if (id) {
        bookmarks = bookmarks.map(function(b) {
            return b.id === parseInt(id) ? Object.assign({}, b, {
                name: name, url: url, description: description, category: category,
                iconType: bookmarkIconType, iconValue: bookmarkIconValue, icon: bookmarkIcon
            }) : b;
        });
    } else {
        const newId = bookmarks.length > 0 ? Math.max(...bookmarks.map(function(b) { return b.id; })) + 1 : 1;
        bookmarks.push({
            id: newId, name: name, url: url, icon: bookmarkIcon,
            iconType: bookmarkIconType, iconValue: bookmarkIconValue,
            category: category, order: bookmarks.length
        });
    }

    saveBookmarks();
    updateCategories();
    renderBookmarks();
    closeModal(true);
}

async function deleteBookmark(id) {
    if (await showConfirm(i18n('confirmDeleteBookmark'), true)) {
        bookmarks = bookmarks.filter(function(b) { return b.id !== id; });
        bookmarks.forEach(function(bookmark, index) { bookmark.order = index; });
        saveBookmarks();
        renderBookmarks();
    }
}

function openCategoryModal() {
    document.getElementById('categoryModalOverlay').classList.add('active');
    renderCategoryList();
}

function closeCategoryModal() {
    document.getElementById('categoryModalOverlay').classList.remove('active');
    document.getElementById('newCatName').value = '';
}

let draggedCategory = null;

function renderCategoryList() {
    const allCategories = [...new Set(bookmarks.map(function(b) { return b.category; }))];
    const sortedCategories = [];
    const defaultCats = defaultCategories.filter(function(cat) { return cat !== '其他'; });

    sortedCategories.push(...defaultCats);
    const customCategories = allCategories.filter(function(cat) { return !defaultCats.includes(cat) && cat !== '其他'; });
    customCategories.sort();
    sortedCategories.push(...customCategories);
    if (!sortedCategories.includes('其他')) {
        sortedCategories.push('其他');
    }

    const list = document.getElementById('categoryList');
    list.innerHTML = sortedCategories.map(function(cat) {
        const count = bookmarks.filter(function(b) { return b.category === cat; }).length;
        const isDefault = defaultCats.includes(cat);
        return '<div class="category-item" draggable="true" data-category="' + cat + '">' +
            '<div><span class="category-name">📁 ' + categoryLabel(cat) + '</span><span class="category-count">(' + i18n('bookmarksCount', [String(count)]) + ')</span></div>' +
            '<div class="category-actions">' +
            '<button class="category-btn rename" data-action="rename-category" data-category="' + cat + '">' + i18n('btnRename') + '</button>' +
            (!isDefault ? '<button class="category-btn delete" data-action="delete-category" data-category="' + cat + '">' + i18n('btnDelete') + '</button>' : '<button class="category-btn disabled" disabled>' + i18n('btnDefault') + '</button>') +
            '</div></div>';
    }).join('');
}

function setupCategoryModalEvents() {
    const categoryList = document.getElementById('categoryList');
    categoryList.addEventListener('click', function(e) {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        e.stopPropagation();
        const action = target.dataset.action;
        const cat = target.dataset.category;
        if (action === 'rename-category') {
            renameCategory(cat);
        } else if (action === 'delete-category') {
            deleteCategory(cat);
        }
    });

    categoryList.addEventListener('dragstart', function(e) {
        const item = e.target.closest('.category-item');
        if (!item) return;
        draggedCategory = item;
        item.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
        e.dataTransfer.setData('text/plain', item.dataset.category);
    });

    categoryList.addEventListener('dragend', function(e) {
        if (draggedCategory) draggedCategory.classList.remove('dragging');
        document.querySelectorAll('.category-item').forEach(function(item) {
            item.classList.remove('drag-over');
        });
        draggedCategory = null;
    });

    categoryList.addEventListener('dragover', function(e) {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        document.querySelectorAll('.category-item').forEach(function(item) {
            if (item !== draggedCategory) item.classList.remove('drag-over');
        });
        const item = e.target.closest('.category-item');
        if (item) item.classList.add('drag-over');
    });

    categoryList.addEventListener('drop', function(e) {
        e.preventDefault();
        const draggedCat = e.dataTransfer.getData('text/plain');
        const dropTarget = e.target.closest('.category-item');
        if (!dropTarget || draggedCat === dropTarget.dataset.category) return;
        const dropCat = dropTarget.dataset.category;
        const allCats = [...new Set(bookmarks.map(function(b) { return b.category; }))];
        const defaultCats = defaultCategories.filter(function(cat) { return cat !== '其他'; });
        const sortedCats = [];
        defaultCats.forEach(function(cat) { if (allCats.includes(cat)) sortedCats.push(cat); });
        const customCats = allCats.filter(function(cat) { return !defaultCats.includes(cat) && cat !== '其他'; });
        customCats.sort();
        sortedCats.push(...customCats);
        if (allCats.includes('其他')) sortedCats.push('其他');

        const draggedIndex = sortedCats.indexOf(draggedCat);
        const dropIndex = sortedCats.indexOf(dropCat);
        if (draggedIndex !== -1 && dropIndex !== -1) {
            const newCategories = [...sortedCats];
            newCategories.splice(draggedIndex, 1);
            newCategories.splice(dropIndex, 0, draggedCat);
            const newDefaultCategories = newCategories.filter(function(cat) { return defaultCats.includes(cat) || cat === '其他'; });
            if (typeof chrome !== 'undefined' && chrome.storage) {
                chrome.storage.local.set({ [CATEGORY_STORAGE_KEY]: newCategories });
            } else {
                localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(newCategories));
            }
            defaultCategories.length = 0;
            defaultCategories.push(...newDefaultCategories);
            updateCategories();
            renderBookmarks();
            renderCategoryList();
        }
    });
}

async function addCategory() {
    const name = document.getElementById('newCatName').value.trim();
    if (!name) { showAlert(i18n('alertEnterCategoryName')); return; }
    if (bookmarks.some(function(b) { return b.category === name; })) { showAlert(i18n('alertCategoryExists')); return; }
    bookmarks.push({
        id: bookmarks.length > 0 ? Math.max(...bookmarks.map(function(b) { return b.id; })) + 1 : 1,
        name: name, url: '#', icon: '📁', category: name, order: bookmarks.length
    });
    saveBookmarks();
    updateCategories();
    document.getElementById('newCatName').value = '';
    renderCategoryList();
}

async function renameCategory(oldName) {
    const newName = await showPrompt(i18n('promptNewCategoryName'), oldName);
    if (!newName || newName.trim() === '') return;
    if (bookmarks.some(function(b) { return b.category === newName.trim(); })) { showAlert(i18n('alertCategoryExists')); return; }
    bookmarks = bookmarks.map(function(b) {
        return b.category === oldName ? Object.assign({}, b, { category: newName.trim() }) : b;
    });
    const index = defaultCategories.indexOf(oldName);
    if (index !== -1) defaultCategories[index] = newName.trim();
    saveBookmarks();
    updateCategories();
    renderCategoryList();
    renderBookmarks();
}

async function deleteCategory(name) {
    if (await showConfirm(i18n('confirmDeleteCategory', [name]), true)) {
        bookmarks = bookmarks.map(function(b) {
            return b.category === name ? Object.assign({}, b, { category: '其他' }) : b;
        });
        const index = defaultCategories.indexOf(name);
        if (index !== -1) defaultCategories.splice(index, 1);
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({ [CATEGORY_STORAGE_KEY]: defaultCategories });
        } else {
            localStorage.setItem(CATEGORY_STORAGE_KEY, JSON.stringify(defaultCategories));
        }
        saveBookmarks();
        updateCategories();
        renderCategoryList();
        renderBookmarks();
    }
}

function exportBookmarks() {
    const blob = new Blob([JSON.stringify(bookmarks, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const now = new Date();
    const pad = function(n) { return n < 10 ? '0' + n : n; };
    const dateStr = String(now.getFullYear()).slice(2) + pad(now.getMonth() + 1) + pad(now.getDate()) + '_' + pad(now.getHours()) + pad(now.getMinutes());
    a.download = 'bookmarks_' + dateStr + '.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    document.getElementById('fabMenu').classList.remove('active');
}

function toggleImportExport() {
    document.getElementById('fabMenu').classList.toggle('active');
}

function triggerImport() {
    document.getElementById('importFile').click();
    document.getElementById('fabMenu').classList.remove('active');
}

async function handleImportFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    try {
        const text = await file.text();
        const importedData = JSON.parse(text);
        if (!Array.isArray(importedData)) { showAlert(i18n('alertInvalidFormat')); return; }
        if (importedData.length === 0) { showAlert(i18n('alertImportEmpty')); return; }
        const importMode = await showPrompt(i18n('promptImportMode', [String(importedData.length)]));
        if (importMode !== '1' && importMode !== '2') { showAlert(i18n('alertImportCancelled')); return; }
        let maxId = Math.max(...bookmarks.map(function(b) { return b.id; }), 0);
        if (importMode === '2') { bookmarks = []; maxId = 0; }
        const existingCategories = [...new Set(bookmarks.map(function(b) { return b.category; }))];
        const newCategories = new Set();
        importedData.forEach(function(item, index) {
            const bookmarkCategory = item.category || '其他';
            if (!existingCategories.includes(bookmarkCategory) && !bookmarks.some(function(b) { return b.category === bookmarkCategory; })) {
                newCategories.add(bookmarkCategory);
            }
            bookmarks.push({
                id: ++maxId, name: item.name || '未命名', url: item.url || '',
                icon: item.icon || '🔗', category: bookmarkCategory,
                order: bookmarks.length + index, description: item.description || ''
            });
        });
        saveBookmarks();
        updateCategories();
        renderBookmarks();
        let message = i18n('alertImportSuccess', [String(importedData.length)]);
        if (newCategories.size > 0) message += '<br><br>' + i18n('labelNewCategories') + [...newCategories].join('、');
        showAlert(message);
    } catch (error) {
        showAlert(i18n('alertImportFailed'));
    }
    e.target.value = '';
}

function loadBackgroundPreference() {
    return new Promise(function(resolve) {
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.get(BG_STORAGE_KEY, function(result) {
                currentBgStyle = result[BG_STORAGE_KEY] || null;
                resolve();
            });
        } else {
            currentBgStyle = localStorage.getItem(BG_STORAGE_KEY) || null;
            resolve();
        }
    });
}

function saveBackgroundPreference(style) {
    currentBgStyle = style;
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.set({ [BG_STORAGE_KEY]: style });
    } else {
        localStorage.setItem(BG_STORAGE_KEY, style);
    }
}

function showBody() {
    document.body.style.opacity = '1';
}

function loadBackgroundImage() {
    if (currentBgStyle && currentBgStyle.startsWith('custom:')) {
        var dataUrl = currentBgStyle.substring(7);
        document.body.style.background = 'url(' + dataUrl + ') center/cover fixed';
        showBody();
        return;
    }
    if (currentBgStyle && currentBgStyle.startsWith('linear-gradient')) {
        document.body.style.background = currentBgStyle;
        showBody();
        return;
    }
    if (currentBgStyle === 'Zoigê.JPG' || !currentBgStyle) {
        var imgUrl = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) ? chrome.runtime.getURL('Zoigê.JPG') : 'Zoigê.JPG';
        var img = new Image();
        img.onload = function() {
            document.body.style.background = 'url(' + imgUrl + ') center/cover fixed';
            showBody();
        };
        img.onerror = function() {
            document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
            showBody();
        };
        img.src = imgUrl;
        return;
    }
    document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    showBody();
}

function showBgPicker() {
    let picker = document.getElementById('bgPickerOverlay');
    if (picker) { picker.remove(); return; }

    picker = document.createElement('div');
    picker.id = 'bgPickerOverlay';
    picker.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.15);backdrop-filter:blur(1px);-webkit-backdrop-filter:blur(1px);z-index:2000;display:flex;align-items:center;justify-content:center;animation:bubbleFadeIn 0.1s ease;';

    var panel = document.createElement('div');
    panel.style.cssText = 'background:white;border-radius:16px;padding:28px 28px 20px;max-width:360px;width:90%;box-shadow:0 20px 60px rgba(0,0,0,0.25);animation:bubblePop 0.125s cubic-bezier(0.175, 0.885, 0.32, 1.275);';

    var title = document.createElement('h3');
    title.textContent = i18n('chooseBackground');
    title.style.cssText = 'margin:0 0 16px 0;color:#333;font-size:1.1rem;';
    panel.appendChild(title);

    var grid = document.createElement('div');
    grid.style.cssText = 'display:grid;grid-template-columns:repeat(4,1fr);gap:10px;margin-bottom:16px;';

    bgPresets.forEach(function(preset) {
        var item = document.createElement('div');
        item.style.cssText = 'cursor:pointer;border-radius:10px;overflow:hidden;border:2px solid ' + (currentBgStyle === preset.css ? '#667eea' : 'transparent') + ';transition:all 0.2s;';
        item.dataset.bg = preset.css;

        var preview = document.createElement('div');
        if (preset.thumb) {
            var thumbUrl = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) ? chrome.runtime.getURL(preset.thumb) : preset.thumb;
            preview.style.cssText = 'height:50px;background:url(' + thumbUrl + ') center/cover;';
        } else if (preset.css.endsWith('.JPG') || preset.css.endsWith('.jpg')) {
            var imgUrl = (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.getURL) ? chrome.runtime.getURL(preset.css) : preset.css;
            preview.style.cssText = 'height:50px;background:url(' + imgUrl + ') center/cover;';
        } else {
            preview.style.cssText = 'height:50px;background:' + preset.css + ';';
        }
        item.appendChild(preview);

        var label = document.createElement('div');
        label.textContent = i18n(preset.labelKey);
        label.style.cssText = 'text-align:center;font-size:0.7rem;color:#666;padding:4px 0;';
        item.appendChild(label);

        item.addEventListener('click', function() {
            saveBackgroundPreference(preset.css);
            loadBackgroundImage();
            document.getElementById('bgPickerOverlay').remove();
        });

        item.addEventListener('mouseenter', function() { item.style.transform = 'scale(1.05)'; });
        item.addEventListener('mouseleave', function() { item.style.transform = 'scale(1)'; });

        grid.appendChild(item);
    });
    panel.appendChild(grid);

    var fileRow = document.createElement('div');
    fileRow.style.cssText = 'border-top:1px solid #eee;padding-top:12px;';

    var fileBtn = document.createElement('button');
    fileBtn.textContent = i18n('uploadCustomBackground');
    fileBtn.style.cssText = 'width:100%;padding:10px;border:2px dashed #ccc;border-radius:10px;background:transparent;color:#666;font-size:0.85rem;cursor:pointer;transition:all 0.2s;';
    fileBtn.addEventListener('mouseenter', function() { fileBtn.style.borderColor = '#667eea'; fileBtn.style.color = '#667eea'; });
    fileBtn.addEventListener('mouseleave', function() { fileBtn.style.borderColor = '#ccc'; fileBtn.style.color = '#666'; });

    var fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';
    fileInput.style.display = 'none';
    fileInput.addEventListener('change', function(e) {
        var file = e.target.files[0];
        if (!file) return;
        var reader = new FileReader();
        reader.onload = function(ev) {
            var dataUrl = ev.target.result;
            saveBackgroundPreference('custom:' + dataUrl);
            document.body.style.background = 'url(' + dataUrl + ') center/cover fixed';
            showBody();
            document.getElementById('bgPickerOverlay').remove();
        };
        reader.readAsDataURL(file);
    });

    fileBtn.addEventListener('click', function() { fileInput.click(); });
    fileRow.appendChild(fileBtn);
    fileRow.appendChild(fileInput);
    panel.appendChild(fileRow);

    var closeRow = document.createElement('div');
    closeRow.style.cssText = 'text-align:center;margin-top:12px;';
    var closeBtn = document.createElement('button');
    closeBtn.textContent = i18n('btnClose');
    closeBtn.style.cssText = 'padding:6px 20px;border:none;border-radius:8px;background:#f0f0f0;color:#666;cursor:pointer;font-size:0.85rem;';
    closeBtn.addEventListener('click', function() { document.getElementById('bgPickerOverlay').remove(); });
    closeRow.appendChild(closeBtn);
    panel.appendChild(closeRow);

    picker.appendChild(panel);
    picker.addEventListener('click', function(e) {
        if (e.target === picker) picker.remove();
    });
    document.body.appendChild(picker);
}

function setupCategoryScroll() {
    const filter = document.getElementById('categoryFilter');
    const bookmarkContent = document.getElementById('bookmarkContent');
    let isHoveringFilter = false;
    let isHoveringBookmarks = false;

    filter.addEventListener('mouseenter', function() { isHoveringFilter = true; });
    filter.addEventListener('mouseleave', function() { isHoveringFilter = false; });
    bookmarkContent.addEventListener('mouseenter', function() { isHoveringBookmarks = true; });
    bookmarkContent.addEventListener('mouseleave', function() { isHoveringBookmarks = false; });

    function handleWheel(e) {
        if (!isHoveringFilter && !isHoveringBookmarks) return;
        if (currentCategory === '全部') return;
        e.preventDefault();
        const nonAllCategories = categories.filter(function(c) { return c !== '全部'; });
        let currentIndex = nonAllCategories.indexOf(currentCategory);
        if (currentIndex === -1) currentIndex = 0;
        if (e.deltaX > 0 || e.deltaY > 0) {
            currentIndex = (currentIndex + 1) % nonAllCategories.length;
        } else if (e.deltaX < 0 || e.deltaY < 0) {
            currentIndex = (currentIndex - 1 + nonAllCategories.length) % nonAllCategories.length;
        }
        filterByCategory(nonAllCategories[currentIndex]);
    }

    filter.addEventListener('wheel', handleWheel);
    bookmarkContent.addEventListener('wheel', handleWheel);
}

function setupCategoryFilterDragDrop() {
    var filter = document.getElementById('categoryFilter');

    filter.addEventListener('dragover', function(e) {
        if (!draggedItem) return;
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        filter.querySelectorAll('.category-tag').forEach(function(tag) {
            tag.classList.remove('drag-over');
        });
        var tag = e.target.closest('.category-tag');
        if (tag) tag.classList.add('drag-over');
    });

    filter.addEventListener('dragleave', function(e) {
        var tag = e.target.closest('.category-tag');
        if (tag) tag.classList.remove('drag-over');
    });

    filter.addEventListener('drop', function(e) {
        if (!draggedItem) return;
        e.preventDefault();
        var tag = e.target.closest('.category-tag');
        if (!tag) return;
        tag.classList.remove('drag-over');

        var draggedId = parseInt(draggedItem.dataset.id);
        var targetCategory = tag.dataset.category;
        var bookmark = bookmarks.find(function(b) { return b.id === draggedId; });
        if (!bookmark || bookmark.category === targetCategory) return;

        bookmark.category = targetCategory;
        saveBookmarks();
        showToast(i18n('alertBookmarkMoved', [categoryLabel(targetCategory)]));
        renderBookmarks();
    });
}

const defaultEmojiIcons = ['🌟', '⭐', '🔥', '💎', '🎯', '🎨', '🚀', '💡', '⚡', '🌈', '🎪', '🎭', '🎬', '📱', '💻', '🔧', '📦', '🎓', '📖', '🎵'];

const emojiList = [
    '🌟', '⭐', '🔥', '💎', '🎯', '🎨', '🚀', '💡', '⚡', '🌈',
    '📱', '💻', '🔧', '📦', '🎓', '📖', '🎵', '🎬', '🎪', '🎭',
    '🔍', '🅰️', '🔷', '🦆', '❓', '📝', '🧮', '⛏️', '💡', '✅',
    '🌍', '🔗', '📬', '🔔', '⚙️', '🏠', '🔑', '🎁', '🎮', '🏆',
    '📊', '📈', '🗂️', '🗓️', '🧪', '🔬', '🖥️', '📡', '🔌', '💾'
];

let currentIconType = 'emoji';
let currentIconValue = '';

var faviconServiceIndex = 0;
var faviconServiceUrls = [
    'https://icon.horse/icon/',
    'https://favicon.im/',
    'https://www.google.com/s2/favicons?domain='
];

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
    img.onload = function() {
        try {
            callback(null, imageToDataUrl(img));
        } catch (e) {
            callback(null, url);
        }
    };
    img.onerror = function() {
        callback('load failed');
    };
    img.src = url;
}

function fetchFaviconFromUrl(url) {
    var rootDomain = getRootDomain(url);
    if (!rootDomain) return;
    var tried = 0;
    function tryNext() {
        if (tried >= faviconServiceUrls.length) {
            updateIconPreview(null);
            return;
        }
        var service = faviconServiceUrls[tried];
        var serviceUrl = service.includes('domain=') ? service + rootDomain + '&sz=64' : service + rootDomain;
        tried++;
        loadFaviconAsImage(serviceUrl, function(err, result) {
            if (err) {
                tryNext();
            } else {
                updateIconPreview(result);
                showFaviconOptions(result);
            }
        });
    }
    tryNext();
}

function fetchWebsiteDescription(url) {
    fetch(url).then(function(r) { return r.text(); }).then(function(html) {
        var doc = new DOMParser().parseFromString(html, 'text/html');
        var title = doc.querySelector('title');
        if (title && title.textContent.trim()) {
            var nameInput = document.getElementById('nameInput');
            if (!nameInput.value.trim()) {
                nameInput.value = title.textContent.trim();
            }
        }
        var meta = doc.querySelector('meta[name="description"]') || doc.querySelector('meta[property="og:description"]');
        if (meta) {
            var desc = meta.getAttribute('content');
            if (desc && desc.trim()) {
                document.getElementById('descriptionInput').value = desc.trim();
            }
        }
    }).catch(function() {});
}

function updateIconPreview(imgUrl) {
    var previewText = document.getElementById('iconPreviewText');
    var previewImg = document.getElementById('iconPreviewImg');
    var typeInput = document.getElementById('iconTypeInput');
    var valueInput = document.getElementById('iconValueInput');

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
        currentIconValue = currentIconValue || '🌟';
        previewText.textContent = currentIconValue;
    }
    typeInput.value = currentIconType;
    valueInput.value = currentIconValue;
}

function showFaviconOptions(faviconUrl) {
    var list = document.getElementById('faviconList');
    list.innerHTML = '';
    list.style.display = 'block';
    var item = document.createElement('div');
    item.className = 'favicon-option';
    var img = document.createElement('img');
    img.width = 32;
    img.height = 32;
    img.src = faviconUrl;
    var span = document.createElement('span');
    span.textContent = i18n('iconFavicon');
    item.appendChild(img);
    item.appendChild(span);
    item.addEventListener('click', function() {
        updateIconPreview(faviconUrl);
        list.style.display = 'none';
    });
    list.appendChild(item);
}

function resetIcon() {
    var defaultIcon = defaultEmojiIcons[Math.floor(Math.random() * defaultEmojiIcons.length)];
    currentIconType = 'emoji';
    currentIconValue = defaultIcon;
    document.getElementById('iconTypeInput').value = 'emoji';
    document.getElementById('iconValueInput').value = defaultIcon;
    document.getElementById('iconPreviewText').textContent = defaultIcon;
    document.getElementById('iconPreviewImg').style.display = 'none';
    document.getElementById('iconPreviewText').style.display = 'block';
    document.getElementById('faviconList').style.display = 'none';
}

function initEmojiPicker() {
    var grid = document.getElementById('emojiGrid');
    if (grid.children.length > 0) return;
    emojiList.forEach(function(emoji) {
        var item = document.createElement('span');
        item.className = 'emoji-item';
        item.textContent = emoji;
        item.addEventListener('click', function() {
            currentIconType = 'emoji';
            currentIconValue = emoji;
            document.getElementById('iconTypeInput').value = 'emoji';
            document.getElementById('iconValueInput').value = emoji;
            document.getElementById('iconPreviewText').textContent = emoji;
            document.getElementById('iconPreviewImg').style.display = 'none';
            document.getElementById('iconPreviewText').style.display = 'block';
            document.getElementById('faviconList').style.display = 'none';
        });
        grid.appendChild(item);
    });
}

function setupIconPicker() {
    document.getElementById('fetchFaviconBtn').addEventListener('click', function() {
        var url = document.getElementById('urlInput').value.trim();
        if (!url) {
            showAlert(i18n('alertEnterUrlFirst'));
            return;
        }
        fetchFaviconFromUrl(url);
    });

    document.getElementById('iconResetBtn').addEventListener('click', function() {
        resetIcon();
    });

    document.getElementById('urlInput').addEventListener('blur', function() {
        var url = this.value.trim();
        if (!url) return;
        if (document.getElementById('iconTypeInput').value === 'emoji') {
            fetchFaviconFromUrl(url);
        }
        var descInput = document.getElementById('descriptionInput');
        if (!descInput.value.trim()) {
            fetchWebsiteDescription(url);
        }
    });

    document.getElementById('urlInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            var url = this.value.trim();
            if (!url) return;
            if (document.getElementById('iconTypeInput').value === 'emoji') {
                fetchFaviconFromUrl(url);
            }
            var descInput = document.getElementById('descriptionInput');
            if (!descInput.value.trim()) {
                fetchWebsiteDescription(url);
            }
            this.blur();
        }
    });

    initEmojiPicker();
}

function renderBookmarkIcon(bookmark) {
    if (bookmark.iconType === 'favicon' && bookmark.iconValue) {
        return '<img src="' + bookmark.iconValue + '" alt="" style="width:100%;height:100%;border-radius:50%;object-fit:cover;" onerror="this.style.display=\'none\';this.parentElement.textContent=\'' + (bookmark.icon || '🔗') + '\';">';
    }
    return bookmark.icon || '🔗';
}

function setupStaticEvents() {
    document.getElementById('searchForm').addEventListener('submit', function(e) {
        e.preventDefault();
        performEnterSearch();
    });

    document.getElementById('searchInput').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') return;
        const query = e.target.value.trim();
        if (query) {
            performSearch(query);
        } else {
            document.getElementById('searchResults').innerHTML = '';
        }
    });

    document.getElementById('searchEngineSelector').addEventListener('click', function() {
        toggleSearchEngineDropdown();
    });

    document.getElementById('searchEngineDropdown').addEventListener('click', function(e) {
        const item = e.target.closest('.search-dropdown-item');
        if (!item) return;
        selectSearchEngine(item.dataset.engine);
    });

    document.getElementById('searchResults').addEventListener('click', function(e) {
        const target = e.target.closest('[data-action]');
        if (!target) return;
        const action = target.dataset.action;
        if (action === 'search-engine') {
            const url = searchEngines[target.dataset.engine].url + encodeURIComponent(target.dataset.query);
            openBookmark(url);
            document.getElementById('searchResults').innerHTML = '';
            document.getElementById('searchInput').value = '';
        } else if (action === 'open-bookmark') {
            openBookmark(target.dataset.url);
            document.getElementById('searchResults').innerHTML = '';
            document.getElementById('searchInput').value = '';
        }
    });

    document.addEventListener('click', function(e) {
        var searchContainer = document.querySelector('.search-container');
        var dropdown = document.getElementById('searchEngineDropdown');
        var results = document.getElementById('searchResults');
        if (!searchContainer.contains(e.target)) {
            if (dropdown.classList.contains('active')) dropdown.classList.remove('active');
            if (results.innerHTML) {
                results.innerHTML = '';
                document.getElementById('searchInput').value = '';
            }
        }
        var fabPanel = document.getElementById('fabPanel');
        var fabMenu = document.getElementById('fabMenu');
        if (fabPanel && !fabPanel.contains(e.target)) {
            fabMenu.classList.remove('active');
        }
    });

    document.getElementById('addBookmarkBtn').addEventListener('click', function() {
        openAddModal();
    });

    document.getElementById('editCategoryBtn').addEventListener('click', function() {
        openCategoryModal();
    });

    document.getElementById('categoryFilter').addEventListener('click', function(e) {
        const btn = e.target.closest('.category-tag');
        if (!btn) return;
        filterByCategory(btn.dataset.category);
    });

    document.getElementById('modalOverlay').addEventListener('click', function(e) {
        if (e.target === document.getElementById('modalOverlay')) closeModal();
    });

    document.getElementById('categoryModalOverlay').addEventListener('click', function(e) {
        if (e.target === document.getElementById('categoryModalOverlay')) closeCategoryModal();
    });

    document.getElementById('cancelModalBtn').addEventListener('click', function() {
        closeModal();
    });

    document.getElementById('saveModalBtn').addEventListener('click', function() {
        saveBookmark();
    });

    document.getElementById('categoryInput').addEventListener('change', function() {
        const newCategoryGroup = document.getElementById('newCategoryGroup');
        if (this.value === '__new__') {
            newCategoryGroup.style.display = 'block';
        } else {
            newCategoryGroup.style.display = 'none';
        }
        setFormDirty();
    });

    document.getElementById('nameInput').addEventListener('input', setFormDirty);
    document.getElementById('urlInput').addEventListener('input', setFormDirty);
    document.getElementById('descriptionInput').addEventListener('input', setFormDirty);
    document.getElementById('newCategoryInput').addEventListener('input', setFormDirty);

    document.getElementById('addCategoryBtn').addEventListener('click', function() {
        addCategory();
    });

    document.getElementById('newCatName').addEventListener('keyup', function(e) {
        if (e.key === 'Enter') addCategory();
    });

    document.getElementById('closeCategoryModalBtn').addEventListener('click', function() {
        closeCategoryModal();
    });

    document.getElementById('ieToggleBtn').addEventListener('click', function() {
        toggleImportExport();
    });

    document.getElementById('exportBtn').addEventListener('click', function() {
        exportBookmarks();
    });

    document.getElementById('importBtn').addEventListener('click', function() {
        triggerImport();
    });

    document.getElementById('changeBgBtn').addEventListener('click', function() {
        document.getElementById('fabMenu').classList.remove('active');
        showBgPicker();
    });

    document.getElementById('importFile').addEventListener('change', handleImportFile);
}

function initOpenCurrentTabToggle() {
    var toggle = document.getElementById('openWithCurrentTabToggle');
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(OPEN_CURRENT_TAB_KEY, function(result) {
            toggle.checked = !!result[OPEN_CURRENT_TAB_KEY];
        });
    } else {
        toggle.checked = localStorage.getItem(OPEN_CURRENT_TAB_KEY) === 'true';
    }
    toggle.addEventListener('change', function() {
        var val = toggle.checked;
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({ [OPEN_CURRENT_TAB_KEY]: val });
        } else {
            localStorage.setItem(OPEN_CURRENT_TAB_KEY, val);
        }
    });
}

function initDefaultSearchEngine() {
    var select = document.getElementById('defaultEngineSelect');
    if (typeof chrome !== 'undefined' && chrome.storage) {
        chrome.storage.local.get(DEFAULT_ENGINE_KEY, function(result) {
            if (result[DEFAULT_ENGINE_KEY]) {
                currentSearchEngine = result[DEFAULT_ENGINE_KEY];
                selectSearchEngine(currentSearchEngine);
            }
        });
    } else {
        var saved = localStorage.getItem(DEFAULT_ENGINE_KEY);
        if (saved) {
            currentSearchEngine = saved;
            selectSearchEngine(currentSearchEngine);
        }
    }
    select.addEventListener('change', function() {
        var val = select.value;
        currentSearchEngine = val;
        selectSearchEngine(val);
        if (typeof chrome !== 'undefined' && chrome.storage) {
            chrome.storage.local.set({ [DEFAULT_ENGINE_KEY]: val });
        } else {
            localStorage.setItem(DEFAULT_ENGINE_KEY, val);
        }
    });
}

async function init() {
    await loadLangPacks();
    await loadLanguagePreference();
    activeLocale = currentLangPref === 'system' ? detectSystemLocale() : currentLangPref;
    applyI18n();
    initLangSelector();
    await loadCategoryOrder();
    await loadBookmarks();
    await loadBackgroundPreference();
    var engineInfo = searchEngines[currentSearchEngine];
    document.getElementById('currentEngineIcon').textContent = engineInfo.icon;
    document.getElementById('currentEngineName').textContent = engineInfo.nameKey ? i18n(engineInfo.nameKey) : engineInfo.name;
    updateCategories();
    renderBookmarks();
    setupCategoryScroll();
    setupCategoryFilterDragDrop();
    setupStaticEvents();
    setupBookmarkEvents();
    setupCategoryModalEvents();
    setupIconPicker();
    loadBackgroundImage();
    initOpenCurrentTabToggle();
    initDefaultSearchEngine();
    await checkPendingAddTab();
}

async function checkPendingAddTab() {
    var PENDING_TAB_KEY = 'pendingAddTab';
    var pendingData = null;
    if (typeof chrome !== 'undefined' && chrome.storage) {
        var result = await new Promise(function(resolve) {
            chrome.storage.local.get(PENDING_TAB_KEY, resolve);
        });
        pendingData = result[PENDING_TAB_KEY];
        if (pendingData) {
            chrome.storage.local.remove(PENDING_TAB_KEY);
        }
    }
    if (pendingData && pendingData.url) {
        clearFormDirtyFlag();
        document.getElementById('modalTitle').textContent = i18n('modalAddBookmark');
        document.getElementById('editId').value = '';
        document.getElementById('nameInput').value = pendingData.title || '';
        document.getElementById('urlInput').value = pendingData.url || '';
        document.getElementById('descriptionInput').value = '';
        document.getElementById('categoryInput').value = currentCategory === '全部' ? '常用' : currentCategory;
        document.getElementById('newCategoryGroup').style.display = 'none';
        resetIcon();
        document.getElementById('faviconList').style.display = 'none';
        document.getElementById('modalOverlay').classList.add('active');
    }
}

document.addEventListener('DOMContentLoaded', function() {
    init();
});
