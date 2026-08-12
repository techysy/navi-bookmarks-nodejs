# Privacy Policy / 隐私政策

**Effective Date / 生效日期**: 2026-08-12

**Navi Bookmarks / 个人书签导航** is a Chrome browser extension that replaces your new tab page with a personal bookmark navigation dashboard.

本政策说明 Navi Bookmarks（个人书签导航）Chrome 浏览器插件如何收集、使用和保护您的信息。

---

## Information We Collect / 我们收集的信息

**We do not collect any personal information.**

All data, including your bookmarks, categories, background preferences, language settings, and favicons, are stored **locally** in your browser using the `chrome.storage.local` API. We do not have access to this data, and it never leaves your device unless you explicitly use the export feature.

**我们不收集任何个人信息。**

您的所有数据（包括书签、分类、背景偏好、语言设置、网站图标）均通过 `chrome.storage.local` API **本地**存储在浏览器中。我们无法访问这些数据，除非您主动使用导出功能，否则数据不会离开您的设备。

---

## Permissions We Use / 我们使用的权限

### `storage`

Used to save your bookmarks, categories, settings, and preferences locally in your browser.

用于在浏览器本地保存您的书签、分类、设置和偏好。

### `tabs`

Used only when:

- You click the toolbar popup icon: we read the current page title and URL so you can add it as a bookmark with one click.
- You click a bookmark: we open it in a new tab or the current tab based on your settings.

仅在以下场景使用：

- 您点击工具栏图标时，读取当前页面标题和 URL，方便一键添加书签。
- 您点击书签时，根据设置在新标签页或当前标签页打开。

We do not track your browsing history or read data from other tabs.

我们不会追踪您的浏览历史，也不会读取其他标签页的数据。

### `host_permissions`

These permissions allow the extension to communicate with external services you choose to use:

| Domain | Purpose |
|--------|---------|
| `icon.horse` | Fetch website favicons when you request them |
| `favicon.im` | Fetch website favicons when you request them |
| `www.google.com` | Fetch website favicons and search suggestions |
| `suggestqueries.google.com` | Google search suggestions |
| `suggestion.baidu.com` | Baidu search suggestions |
| `api.bing.com` | Bing search suggestions |
| `duckduckgo.com` | DuckDuckGo search suggestions |
| `www.xiaohongshu.com` | Xiaohongshu search |

These requests are only made when you actively search or click "Fetch Website Icon". Favicons are converted to Base64 and stored locally.

这些权限仅用于您主动搜索或点击“获取网站图标”时。网站图标会被转换为 Base64 并本地存储。

---

## Data Security / 数据安全

- All data is stored on your local device.
- No data is transmitted to our servers.
- Exported JSON files are saved directly to your downloads folder by your browser.

- 所有数据均存储在您的本地设备上。
- 我们不会将数据传输到自己的服务器。
- 导出的 JSON 文件由浏览器直接保存到您的下载文件夹。

---

## Third-Party Services / 第三方服务

The extension may request favicons and search suggestions from third-party services (e.g., Google, Baidu, Bing, DuckDuckGo, Xiaohongshu, icon.horse, favicon.im). These services may have their own privacy policies. Please review them if you have concerns.

本插件可能会向第三方服务请求网站图标和搜索建议（如 Google、百度、必应、DuckDuckGo、小红书、icon.horse、favicon.im）。这些服务有各自的隐私政策，如有顾虑请自行查看。

---

## Changes to This Policy / 政策变更

We may update this privacy policy from time to time. Changes will be posted in this repository.

我们可能会不时更新本隐私政策。变更将发布在本仓库中。

---

## Contact / 联系我们

If you have any questions about this privacy policy, please open an issue on our GitHub repository:

如有任何问题，请在 GitHub 仓库提交 Issue：

[https://github.com/techysy/navi-bookmarks-chrome/issues](https://github.com/techysy/navi-bookmarks-chrome/issues)
