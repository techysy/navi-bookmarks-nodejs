# Chrome Web Store Listing / 上架描述文案

This file contains suggested text for the Chrome Web Store listing. / 本文件包含用于 Chrome Web Store 上架页面的推荐文案。

---

## Store Name / 商店名称

**English:** Navi Bookmarks - New Tab Bookmark Manager
**Chinese:** 个人书签导航 - 新标签页书签管理

---

## Short Description / 简短描述

**English (max 132 chars):** A modern new tab page with smart bookmark search, category management, glassmorphism UI, and 10-language support.

**Chinese（最多 132 个字符）：**现代化新标签页书签导航，支持智能搜索、分类管理、毛玻璃 UI 和 10 种语言。

---

## Detailed Description / 详细描述

### English

Navi Bookmarks replaces your Chrome new tab page with a beautiful, personalized bookmark navigation dashboard.

**Key Features:**
- 🔍 **Smart Search**: Search your bookmarks in real-time, or press Enter to search with Google, Baidu, Bing, DuckDuckGo, or Xiaohongshu.
- 📁 **Category Management**: Create, edit, delete, and reorder categories via drag-and-drop.
- 🎨 **Glassmorphism UI**: Modern frosted-glass design with multiple background themes and custom wallpaper support.
- 📱 **Responsive**: Works great on desktop and mobile.
- 💾 **Local Storage**: All your data stays on your device using Chrome Storage API.
- 📥 **Import/Export**: Backup and restore your bookmarks as JSON files.
- 🌐 **10 Languages**: Supports Chinese (Simplified & Traditional), English, Japanese, Korean, German, French, Vietnamese, Thai, and Malay.
- 🖼️ **Offline Favicons**: Website icons are downloaded and stored as Base64 for offline use.
- 🔹 **Toolbar Popup**: Add the current page as a bookmark directly from the toolbar icon.

**Privacy First:**
All data is stored locally. No personal information is collected or uploaded to any server.

---

### 中文

个人书签导航将您的 Chrome 新标签页替换为一个美观、个性化的书签导航面板。

**核心功能：**
- 🔍 **智能搜索**：实时搜索书签，或按回车使用 Google、百度、必应、DuckDuckGo、小红书搜索。
- 📁 **分类管理**：创建、编辑、删除分类，支持拖拽排序。
- 🎨 **毛玻璃 UI**：现代化毛玻璃设计，多种背景主题，支持自定义壁纸。
- 📱 **响应式设计**：完美适配桌面端和移动端。
- 💾 **本地存储**：所有数据通过 Chrome Storage API 存储在本地。
- 📥 **导入导出**：以 JSON 格式备份和恢复书签。
- 🌐 **10 种语言**：支持简体中文、繁體中文、英文、日文、韩文、德文、法文、越南语、泰语、马来语。
- 🖼️ **离线图标**：网站图标下载后转为 Base64 本地存储，离线也可显示。
- 🔹 **工具栏弹窗**：点击工具栏图标即可添加当前页面为书签。

**隐私优先：**
所有数据均本地存储，不收集或上传任何个人信息。

---

## Category / 类别

**English:** Productivity / New Tab
**Chinese:** 效率工具 / 新标签页

---

## Privacy Policy URL / 隐私政策链昺

Use the raw GitHub URL of `PRIVACY_POLICY.md`, for example:

```
https://raw.githubusercontent.com/techysy/navi-bookmarks-chrome/main/PRIVACY_POLICY.md
```

Or publish it to GitHub Pages:

```
https://techysy.github.io/navi-bookmarks-chrome/privacy-policy
```

---

## Support URL / 支持链接

```
https://github.com/techysy/navi-bookmarks-chrome/issues
```

---

## Contact Email / 联系邮箱

(Replace with your email address)

```
your-email@example.com
```

---

## Screenshot Requirements / 截图要求

Chrome Web Store requires at least one screenshot. Recommended sizes:

| Type | Size |
|------|------|
| Screenshot | 1280x800 or 1440x900 |
| Small promo tile | 440x280 |
| Large promo tile | 920x680 |
| Marquee promo tile | 1400x560 |

Place your screenshots in `assets/screenshots/`.

---

## Permission Justification / 权限说明

When submitting to the Chrome Web Store, use these explanations:

### storage
> Used to save bookmarks, categories, settings, and user preferences locally in the browser.

### tabs
> Used to read the current page title and URL when the user clicks the toolbar icon to add a bookmark, and to open bookmarks in new or current tabs based on user settings.

### host_permissions
> Required to fetch website favicons (icon.horse, favicon.im, Google) and to provide search suggestions from Google, Baidu, Bing, DuckDuckGo, and Xiaohongshu when the user performs a search.
