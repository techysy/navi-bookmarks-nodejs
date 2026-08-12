# Changelog / 更新日志

All notable changes to this project will be documented in this file.

本文件记录项目的所有重大变更。

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/lang/zh-CN/spec/v2.0.0.html).

> **Note / 说明**: The legacy web version ended at v0.9.9. The Chrome extension version starts fresh at v1.0.0.
> 旧版 Web 项目最终版本为 v0.9.9，Chrome 插件版本从 v1.0.0 重新计算。

## [Unreleased]

### Added / 新增

- ✅ Automated build and release pipeline via GitHub Actions.
- ✅ i18n key consistency validation script.
- ✅ `CONTRIBUTING.md`, `PRIVACY_POLICY.md`, and `STORE_LISTING.md`.
- ✅ Shared utility module `common.js`.

### Changed / 改进

- 🔧 Standardized `CHANGELOG.md` to Keep a Changelog format.

### Fixed / 修复

- 🐛 XSS vulnerabilities in bookmark rendering and modal dialogs.
- 🐛 URL protocol validation to block `javascript:`, `data:`, and other unsafe schemes.

## [1.3.1] - 2026-07-28

### Fixed / 修复

- 🐛 Fixed issue where importing bookmarks in replace mode did not refresh categories correctly, causing duplicate historical categories.
- 🐛 Rebuilt `defaultCategories` after replace-mode import to keep only categories actually used by current bookmarks.

## [1.3.0] - 2026-07-05

### Added / 新增

- ✅ Local persistent storage for website favicons.
- ✅ Automatic favicon download and Base64 conversion for offline display.

### Changed / 改进

- ✅ Favicons are no longer fetched on every render, improving page load speed.
- ✅ Reduced request frequency to Google Favicon API to avoid rate limiting.

## [1.2.0] - 2026-06-30

### Added / 新增

- ✅ Full translations for Japanese, Korean, Vietnamese, Thai, Malay, German, French, and Traditional Chinese.
- ✅ Language selector now shows flag emojis.
- ✅ System language auto-detection for all 10 supported languages.

### Changed / 改进

- ✅ Language list sorted by region (CJK → Europe/America → Southeast Asia).

## [1.1.0] - 2026-06-29

### Added / 新增

- ✅ Toolbar popup: add current page as bookmark directly from the extension icon.
- ✅ Popup supports category selection and one-click save.
- ✅ Popup displays current page title and URL.
- ✅ "Open Bookmark Navigation" shortcut button in popup.
- ✅ Added `action` configuration and `tabs` permission to `manifest.json`.

### Changed / 改进

- ✅ Settings menu UI improvements (header, icon alignment, dividers, language selector).
- ✅ Overall layout refinements (tighter spacing, unified glassmorphism effects).
- ✅ Button hover animations improved.

## [1.0.2] - 2026-06-29

### Added / 新增

- ✅ Internationalization (i18n) support with Chinese/English switching.
- ✅ Added `_locales/en` and `_locales/zh_CN` language packs.
- ✅ HTML `data-i18n` / `data-i18n-placeholder` attributes for automatic translation.
- ✅ All UI text in JS uses `chrome.i18n.getMessage()`.
- ✅ Language switcher in settings (System / Chinese / English).
- ✅ Language preference persisted across sessions.

### Changed / 改进

- ✅ Category names support language switching while keeping data compatible.
- ✅ Search engine names and background preset names support multiple languages.
- ✅ `manifest.json` uses `__MSG_appName__` for internationalization.

## [1.0.1] - 2026-06-29

### Changed / 改进

- ✅ Replaced all native `confirm`/`alert`/`prompt` with custom bubble dialogs.
- ✅ Unified bubble-style popups for add/edit bookmark, edit category, and change background.
- ✅ Export filename auto-appends date-time (`bookmarks_YYMMDD_HHmm.json`).
- ✅ Popup animation refined (fade-in 0.1s, pop 0.125s).
- ✅ Glassmorphism overlay lightened (opacity 0.15, blur 1px).

## [1.0.0] - 2026-06-28

### Added / 新增

- ✅ Rebuilt as a Chrome extension (Manifest V3).
- ✅ New tab page override via `chrome_url_overrides`.
- ✅ Chrome Storage local data persistence.
- ✅ Multiple background theme presets.
- ✅ Zoigê grassland background image.
- ✅ Custom background upload.
- ✅ Background selector thumbnails.
- ✅ Extension icons.

### Changed / 改进

- ✅ Simplified button styles (40px circular buttons).
- ✅ Click area limited to icon and name.
- ✅ Drag sorting uses native HTML5 Drag API.
- ✅ Removed all inline event handlers (CSP compliant).
- ✅ All event bindings use `addEventListener`.

### Removed / 移除

- 🗑️ Removed Node.js server dependency (`server.js`).
- 🗑️ Removed PowerShell startup script (`start.ps1`).
- 🗑️ Removed LAN access feature.
- 🗑️ Moved legacy web files to `old/` directory.

## [0.9.9] - 2026-06-17

> **Note / 说明**: This was the final version of the legacy web project. It was then rebuilt as a Chrome extension.
> 这是旧版 Web 项目的最后一个版本，之后重构为 Chrome 插件。

### Added / 新增

- ✅ Bookmark navigation main page (HTML5 + CSS3 + JavaScript).
- ✅ Node.js server with LAN access support.
- ✅ Smart search with multiple search engines.
- ✅ Category management (create, edit, delete, drag sort).
- ✅ Glassmorphism UI design.
- ✅ Responsive design for desktop and mobile.
- ✅ Data persistence (local storage + server sync).
- ✅ Default "Frequent" category.
- ✅ Import/export with append/replace modes.
- ✅ PowerShell interactive startup script.

### Fixed / 修复

- 🐛 Fixed script stop service function (`$pid` variable conflict).
- 🐛 Fixed auto-creation of unknown categories during import.
- 🐛 Fixed scroll wheel affecting normal page scrolling.
- 🐛 Fixed search engine Enter key binding.
- 🐛 Auto fallback to external search engine when bookmark search has no results.

---

## Legend / 图例

- ✅ **Added / 新增**: New features
- 🔧 **Changed / 改进**: Improvements to existing features
- 🐛 **Fixed / 修复**: Bug fixes
- 🗑️ **Removed / 移除**: Removed features
- 📝 **Documentation / 文档**: Documentation updates
- ⚙️ **Configuration / 配置**: Configuration changes
