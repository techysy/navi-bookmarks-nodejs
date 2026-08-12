# 📚 Navi Bookmarks / 个人书签导航

> A modern Chrome new tab bookmark navigation extension.
> 一个现代化的 Chrome 浏览器新标签页书签导航插件。

**Current Version / 当前版本**: v1.3.1

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](./LICENSE)

---

## 📱 Requirements / 系统要求

- **Chrome 88+** or any Chromium-based browser (Edge, Brave, Arc, Vivaldi, etc.)
- Manifest V3 compatible browser
- No Node.js runtime required for end users

---

## ✨ Features / 功能特点

### English

- **🔍 Smart Search** — Real-time bookmark search with multiple search engines (Google, Baidu, Bing, DuckDuckGo, Xiaohongshu)
- **📁 Category Management** — Create, edit, delete categories with drag-and-drop reordering
- **🎨 Glassmorphism UI** — Modern frosted glass design, unified bubble popup style, multiple background themes
- **📱 Responsive Design** — Works seamlessly on both desktop and mobile
- **💾 Persistent Storage** — Uses Chrome Storage API for local data persistence
- **🎨 Background Themes** — Built-in gradients + Ruoergai Grassland, supports custom background upload
- **📥 Import / Export** — JSON import/export with auto date-time filename
- **🌐 Multi-language** — Supports 10 languages, manual switch or follow system language
- **🖼️ Local Favicon** — Website icons auto-downloaded and stored as Base64, works offline
- **🖱️ Scroll Switch** — Hover over categories and scroll to quickly switch
- **🔹 Toolbar Popup** — Add the current page as a bookmark directly from the toolbar icon

### 中文

- **🔍 智能搜索**：支持实时搜索书签，集成多种搜索引擎（Google、百度、必应、DuckDuckGo、小红书）
- **📁 分类管理**：支持创建、编辑、删除分类，可拖拽调整顺序
- **🎨 毛玻璃 UI**：现代化视觉设计，统一气泡弹窗风格，支持多种背景主题
- **📱 响应式设计**：完美适配桌面端和移动端
- **💾 数据持久化**：使用 Chrome Storage API 本地存储
- **🎨 背景切换**：内置多种渐变背景 + 若尔盖大草原，支持上传自定义背景
- **📥 导入导出**：支持书签数据的 JSON 导入导出，文件名自动带日期时间
- **🌐 多语言**：支持 10 种语言，可手动切换或跟随系统语言
- **🖼️ 图标本地化**：网站图标自动下载并转为 Base64 本地存储，离线也可正常显示
- **🖱️ 滚轮切换**：悬停分类或书签区域时，滚轮滑动快速切换分类
- **🔹 工具栏弹窗**：点击工具栏图标直接添加当前页为书签

---

## 🖼️ Screenshots / 截图

> 建议在 `assets/screenshots/` 下放置以下截图，然后取消下方注释：

<!--
![Main Screen](./assets/screenshots/main.png)
![Search](./assets/screenshots/search.png)
![Add Bookmark](./assets/screenshots/add-bookmark.png)
![Settings](./assets/screenshots/settings.png)
![Popup](./assets/screenshots/popup.png)
-->

---

## 📦 Installation / 安装

### Method 1: Load Unpacked / 加载已解压的扩展程序

1. Download the latest release ZIP (`navi-bookmarks-chrome-v1.3.1.zip`) from the [Releases](https://github.com/techysy/navi-bookmarks-chrome/releases) page and extract it.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** in the top-right corner.
4. Click **Load unpacked**.
5. Select the `navi-bookmarks-chrome` folder.
6. Open a new tab to use it.

### 中文

1. 从 [Releases](https://github.com/techysy/navi-bookmarks-chrome/releases) 页面下载最新版 ZIP（`navi-bookmarks-chrome-v1.3.1.zip`）并解压。
2. 打开 Chrome，访问 `chrome://extensions/` 。
3. 开启右上角 **开发者模式** 。
4. 点击 **加载已解压的扩展程序** 。
5. 选择 `navi-bookmarks-chrome` 文件夹。
6. 打开新标签页即可使用。

### Method 2: CRX (Advanced) / CRX 安装（高级）

1. Download `navi-bookmarks-chrome.crx` from the [Releases](https://github.com/techysy/navi-bookmarks-chrome/releases) page.
2. Drag and drop the `.crx` file onto the `chrome://extensions/` page.
3. Click **Add extension** when prompted.

> **Note:** Modern Chrome versions may block third-party CRX installs. Loading unpacked is recommended.

---

## 🎯 Usage / 使用说明

### Add Bookmark / 添加书签

- Click **+ Add Bookmark** in the top-right corner.
- Or use the toolbar popup to add the current page directly.

### Search / 搜索

- Type keywords in the search box to search bookmarks in real-time.
- Press **Enter** to search with the selected search engine.
- Click the search engine icon to switch engines.

### Category Management / 分类管理

- Click **Edit Category** to add, rename, delete, or reorder categories.
- Drag bookmarks onto category tags to move them quickly.

### Background / 背景

- Click the ⚙️ settings button in the bottom-right corner.
- Select a preset gradient or upload your own image.

### Import & Export / 导入导出

- Open settings and choose **Export Bookmarks** or **Import Bookmarks**.
- Export filename is automatically named like `bookmarks_YYMMDD_HHmm.json`.

### Language / 语言

- Open settings and select a language from the dropdown.
- Choose **System** to follow your browser language.

---

## 📁 Project Structure / 项目结构

```
navi-bookmarks-chrome/
├── manifest.json          # Extension manifest / 扩展配置
├── newtab.html            # New tab page / 新标签页
├── newtab.js              # Main logic / 主逻辑
├── newtab.css             # Styles / 样式
├── popup.html             # Toolbar popup / 工具栏弹窗
├── popup.js               # Popup logic / 弹窗逻辑
├── common.js              # Shared utilities / 公共工具函数
├── _locales/              # i18n language packs / 语言包
├── icons/                 # Extension icons / 插件图标
├── Zoigê.JPG             # Default grassland background / 若尔盖背景
└── Zoigê - mini.JPG      # Background thumbnail / 背景缩略图

dist/                      # Build outputs / 构建输出
scripts/                   # Build and validation scripts / 构建和校验脚本
assets/screenshots/        # Screenshots / 截图
```

---

## ⚙️ Configuration / 配置

You can customize the default categories by editing `defaultCategories` in `newtab.js`.

```js
let defaultCategories = ['Frequent', 'Dev Tools', 'Search Engines', 'Learning', 'Community', 'Other'];
```

> **Note:** After changing default categories, existing users will keep their stored category order unless they reset storage.

---

## 🛠️ Development / 开发

### Install Dependencies

```bash
npm install
```

### Validate i18n Keys

```bash
npm run lint:i18n
```

### Build Release ZIP

```bash
npm run build
```

The output will be at `dist/navi-bookmarks-chrome-v<version>.zip`.

### Build CRX (requires private key)

1. Generate a private key:

```bash
openssl genrsa 2048 > navi-bookmarks-chrome.pem
```

2. Use Chrome to pack the extension:

```bash
chrome --pack-extension=./navi-bookmarks-chrome --pack-extension-key=./navi-bookmarks-chrome.pem
```

> Keep `navi-bookmarks-chrome.pem` safe and never commit it. It is already ignored in `.gitignore`.

---

## 🔐 Privacy / 隐私说明

- All bookmark data is stored locally in your browser via `chrome.storage.local`.
- No data is uploaded to any server.
- Favicon fetching uses public third-party services (`icon.horse`, `favicon.im`, `Google Favicon API`) only when you explicitly request it.
- Search suggestions are fetched directly from the selected search engine.

---

## 🌐 Supported Languages / 支持的语言

| Language | Code |
|----------|------|
| 中文（简体） | zh_CN |
| 中文（繁體） | zh_TW |
| English | en |
| 日本語 | ja |
| 한국어 | ko |
| Deutsch | de |
| Français | fr |
| Tiếng Việt | vi |
| ภาษาไทย | th |
| Bahasa Melayu | ms |

---

## 📝 Changelog

See [CHANGELOG.md](./CHANGELOG.md) for the full version history.

---

## 📜 License / 许可证

[MIT License](./LICENSE)

---

**Made with ❤️**
