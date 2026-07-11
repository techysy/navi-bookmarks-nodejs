# 📚 个人书签导航 - Chrome 插件 / Navi Bookmarks

> 一个现代化的 Chrome 浏览器新标签页书签导航插件 / A modern Chrome new tab bookmark navigation extension

**当前版本 / Current Version**: v1.3.0

---

## ✨ 功能特点 / Features

### 中文

- **🔍 智能搜索**：支持实时搜索书签，集成多种搜索引擎（Google、百度、必应、DuckDuckGo）
- **📁 分类管理**：支持创建、编辑、删除分类，可拖拽调整顺序
- **🎨 毛玻璃UI**：现代化视觉设计，统一气泡弹窗风格，支持多种背景主题
- **📱 响应式设计**：完美适配桌面端和移动端
- **💾 数据持久化**：使用 Chrome Storage 本地存储
- **🎨 背景切换**：内置多种渐变背景 + 若尔盖大草原，支持上传自定义背景
- **📥 导入导出**：支持书签数据的 JSON 导入导出，文件名自动带日期时间
- **🌐 多语言**：支持 10 种语言，可手动切换或跟随系统语言
- **🖼️ 图标本地化**：网站图标自动下载并转为 Base64 本地存储，离线也可正常显示
- **🖱️ 滚轮切换**：悬停分类或书签区域时，滚轮滑动快速切换分类

### English

- **🔍 Smart Search** — Real-time bookmark search with multiple search engines (Google, Baidu, Bing, DuckDuckGo)
- **📁 Category Management** — Create, edit, delete categories with drag-and-drop reordering
- **🎨 Glassmorphism UI** — Modern frosted glass design, unified bubble popup style, multiple background themes
- **📱 Responsive Design** — Works seamlessly on both desktop and mobile
- **💾 Persistent Storage** — Uses Chrome Storage API for local data persistence
- **🎨 Background Themes** — Built-in gradients + Ruoergai Grassland, supports custom background upload
- **📥 Import / Export** — JSON import/export with auto date-time filename
- **🌐 Multi-language** — Supports 10 languages, manual switch or follow system language
- **🖼️ Local Favicon** — Website icons auto-downloaded and stored as Base64, works offline
- **🖱️ Scroll Switch** — Hover over categories and scroll to quickly switch

---

## 🛠️ 技术栈 / Tech Stack

| 中文 | English |
|:----|:--------|
| 前端 HTML5 + CSS3 + JavaScript (Vanilla) | Frontend: HTML5 + CSS3 + JavaScript (Vanilla) |
| 存储 Chrome Storage API | Storage: Chrome Storage API |
| 规范 Manifest V3 | Spec: Manifest V3 |

---

## 📦 安装 / Installation

### 中文

1. 下载最新版 ZIP 并解压
2. 打开 Chrome → `chrome://extensions/`
3. 开启右上角 **开发者模式**
4. 点击 **加载已解压的扩展程序**
5. 选择 `navi-bookmarks-chrome` 文件夹
6. 打开新标签页即可使用

### English

1. Download the latest ZIP and extract it
2. Open Chrome → `chrome://extensions/`
3. Enable **Developer mode**
4. Click **Load unpacked**
5. Select the `navi-bookmarks-chrome` folder
6. Open a new tab

---

## 🎯 使用说明 / Usage

### 添加书签 / Add Bookmark

点击右上角「+ 添加书签」→ 填写名称和 URL → 选择分类 → 保存
Click **+ Add Bookmark** → enter name & URL → select category → save

### 搜索 / Search

输入关键词实时搜索，可切换搜索引擎（书签/Google/百度/必应/DuckDuckGo）
Type keywords to search, switch search engines (Bookmarks/Google/Baidu/Bing/DuckDuckGo)

### 背景切换 / Change Background

点击右下角 ⚙️ → 选择预设主题或上传自定义图片
Click ⚙️ (bottom right) → pick a preset or upload a custom image

### 导入导出 / Import & Export

点击 ⚙️ → 导出/导入 JSON 文件
Click ⚙️ → Export/Import JSON file

### 语言切换 / Language

点击 ⚙️ → 下拉选择语言 / 跟随系统
Click ⚙️ → select language from dropdown / Follow System

---

## 📁 项目结构 / Project Structure

```
navi-bookmarks-chrome/
├── manifest.json          # 插件配置 / Extension manifest
├── newtab.html            # 新标签页 / New tab page
├── newtab.js              # 主逻辑 / Main logic
├── newtab.css             # 样式 / Styles
├── _locales/              # 语言包 / i18n packs
├── Zoigê.JPG              # 若尔盖背景 / Grassland background
├── icons/                 # 插件图标 / Icons
└── old/                   # 旧版文件 / Legacy files
```

---

## 🔧 配置 / Configuration

修改 `newtab.js` 中的 `defaultCategories` 数组可调整默认分类。
Edit `defaultCategories` in `newtab.js` to customize default categories.

---

## 📄 许可证 / License

MIT License

---

**Made with ❤️**
