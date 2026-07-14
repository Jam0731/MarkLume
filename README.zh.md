<div align="center">

# ✨ MarkLume

### 轻量优雅的 Markdown 编辑器，支持 VS Code 风格工作区

无安装、无账号、无订阅，你的文字只属于你。

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tauri](https://img.shields.io/badge/Desktop-Tauri_2-orange)](https://tauri.app)
[![Stars](https://img.shields.io/github/stars/Jam0731/MarkLume?style=social)](https://github.com/Jam0731/MarkLume/stargazers)
[![Issues](https://img.shields.io/github/issues/Jam0731/MarkLume)](https://github.com/Jam0731/MarkLume/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Jam0731/MarkLume/pulls)

</div>

---

## 为什么选择 MarkLume？

AI 时代，Markdown 应该足够简单。

MarkLume 是一款极简、专注的 Markdown 编辑器，支持 VS Code 风格的工作区管理。打开文件夹，浏览文件，编辑 Markdown 并实时预览。

**轻量。** 桌面应用仅 ~5-10 MB（Electron 约 150 MB）。  
**快速。** 原生 Vue 3 + Vite，无额外开销。  
**隐私。** 零追踪、零云同步，你的数据只属于你。

---

## 功能一览

<table>
<tr>
<td>

### 核心编辑

- 实时预览分栏布局
- 丰富的格式工具栏
- 标题、加粗、斜体、删除线
- 列表（有序、无序、任务）
- 引用块与代码块
- 可视化表格选择器
- 查找与替换

</td>
<td>

### 强大功能

- 数学公式（KaTeX）
- 图表（Mermaid）
- 图片上传（Base64）
- 网页转 Markdown
- 拖拽导入
- 多格式导出
- 10 种语言

</td>
</tr>
</table>

### 工作区管理

- VS Code 风格文件资源管理器
- 打开任意文件夹作为工作区
- 浏览和编辑 .md 文件
- 新建文件
- 右键菜单（重命名、删除）

| 导出格式 | 说明 |
|----------|------|
| `.md` | 原始 Markdown |
| `.html` | 独立 HTML 页面 |
| `.doc` | Word 文档 |
| `.pdf` | 打印为 PDF |
| `.png` | 社交媒体比例（9:16, 4:5, 1:1, 16:9） |

---

## 快速开始

### 下载

从 [GitHub Releases](https://github.com/Jam0731/MarkLume/releases) 下载最新版本。

| 平台 | 格式 |
|------|------|
| Windows | `.exe` 安装包 |
| macOS | `.dmg` |
| Linux | `.deb`, `.rpm`, `.AppImage` |

### 从源码构建

```bash
# 克隆仓库
git clone https://github.com/Jam0731/MarkLume.git
cd MarkLume

# 安装依赖
npm install

# 开发模式
npm run tauri:dev

# 构建安装包
npm run tauri:build
```

输出目录：`src-tauri/target/release/bundle/`

---

## 快捷键

| 按键 | 功能 | 按键 | 功能 |
|------|------|------|------|
| `Ctrl+S` | 保存 | `Ctrl+K` | 插入链接 |
| `Ctrl+B` | 加粗 | `Ctrl+Shift+K` | 插入图片 |
| `Ctrl+I` | 斜体 | `Ctrl+F` | 查找替换 |
| `Ctrl+U` | 下划线 | `Ctrl+Z` | 撤销 |
| `Ctrl+Y` | 重做 | `Tab` | 缩进 |

---

## 技术栈

| 组件 | 技术 |
|------|------|
| 前端 | Vue 3 (Composition API) |
| 构建 | Vite |
| 渲染 | marked.js + KaTeX + Mermaid |
| 桌面 | Tauri 2（Rust + 系统 WebView） |
| 体积 | ~5-10 MB |

---

## 参与贡献

欢迎贡献！请查看 [CONTRIBUTING.md](CONTRIBUTING.md)。

---

## 开源协议

[MIT](LICENSE) — 自由使用。

---

<div align="center">

**如果 MarkLume 对你有帮助，请给个 ⭐**

为 Markdown 社区而造

</div>
