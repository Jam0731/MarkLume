<div align="center">

# ✨ MarkLume

### A sleek, lightweight Markdown editor with VS Code-style workspace

No installation. No account. No subscription. Your words belong to you.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tauri](https://img.shields.io/badge/Desktop-Tauri_2-orange)](https://tauri.app)
[![Stars](https://img.shields.io/github/stars/Jam0731/MarkLume?style=social)](https://github.com/Jam0731/MarkLume/stargazers)
[![Issues](https://img.shields.io/github/issues/Jam0731/MarkLume)](https://github.com/Jam0731/MarkLume/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Jam0731/MarkLume/pulls)

</div>

---

## Why MarkLume?

In the age of AI, Markdown should be simple.

MarkLume is a minimal, focused Markdown editor with VS Code-style workspace management. Open a folder, browse your files, and edit Markdown with live preview.

**Lightweight.** ~5-10 MB desktop app (vs Electron's ~150 MB).  
**Fast.** Pure HTML/CSS/JS — no framework overhead.  
**Private.** Zero tracking, zero cloud sync. Your data stays yours.

---

## Features

<table>
<tr>
<td>

### Core Editing

- Live preview with split view
- Rich formatting toolbar
- Headings, bold, italic, strikethrough
- Lists (ordered, unordered, task)
- Blockquotes & code blocks
- Tables with visual picker
- Find & replace

</td>
<td>

### Power Features

- Math formulas (KaTeX)
- Diagrams (Mermaid)
- Image upload (Base64)
- Web → Markdown conversion
- Drag & drop import
- Multi-format export
- 10 languages

</td>
</tr>
</table>

### Workspace Management

- VS Code-style file explorer
- Open any folder as workspace
- Browse and edit .md files
- Create new files
- Right-click context menu (rename, delete)

| Export Format | Description |
|---------------|-------------|
| `.md` | Raw Markdown |
| `.html` | Standalone HTML page |
| `.doc` | Word document |
| `.pdf` | Print to PDF |
| `.png` | Social media ratios (9:16, 4:5, 1:1, 16:9) |

---

## Quick Start

### Download

Get the latest release from [GitHub Releases](https://github.com/Jam0731/MarkLume/releases).

| Platform | Format |
|----------|--------|
| Windows | `.exe` installer |
| macOS | `.dmg` |
| Linux | `.deb`, `.rpm`, `.AppImage` |

### Build from Source

```bash
# Clone the repo
git clone https://github.com/Jam0731/MarkLume.git
cd MarkLume

# Install dependencies
npm install

# Development mode
npm run tauri:dev

# Build native installer
npm run tauri:build
```

Output: `src-tauri/target/release/bundle/`

---

## Shortcuts

| Key | Action | Key | Action |
|-----|--------|-----|--------|
| `Ctrl+S` | Save | `Ctrl+K` | Insert link |
| `Ctrl+B` | Bold | `Ctrl+Shift+K` | Insert image |
| `Ctrl+I` | Italic | `Ctrl+F` | Find & Replace |
| `Ctrl+U` | Underline | `Ctrl+Z` | Undo |
| `Ctrl+Y` | Redo | `Tab` | Indent |

---

## Tech Stack

| Component | Technology |
|-----------|------------|
| Frontend | Vue 3 (Composition API) |
| Build | Vite |
| Rendering | marked.js + KaTeX + Mermaid |
| Desktop | Tauri 2 (Rust + system WebView) |
| Size | ~5-10 MB |

---

## Contributing

We welcome contributions! See [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

---

## License

[MIT](LICENSE) — use it however you want.

---

<div align="center">

**If MarkLume helps you, give it a ⭐**

Made with ❤️ for the Markdown community

</div>
