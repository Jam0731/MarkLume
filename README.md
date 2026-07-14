<div align="center">

# ✨ MarkLume

### A sleek, lightweight Markdown editor for the AI era

No installation. No account. No subscription. Your words belong to you.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Tauri](https://img.shields.io/badge/Desktop-Tauri_2-orange)](https://tauri.app)
[![Stars](https://img.shields.io/github/stars/Jam0731/marklume?style=social)](https://github.com/Jam0731/marklume/stargazers)
[![Issues](https://img.shields.io/github/issues/Jam0731/marklume)](https://github.com/Jam0731/marklume/issues)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](https://github.com/Jam0731/marklume/pulls)

</div>

---

## Why MarkLume?

In the age of AI, Markdown should be simple.

MarkLume is a minimal, focused Markdown editor that respects your workflow. Write in the browser or install as a native desktop app. Everything stays local — your content never leaves your machine.

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

| Export Format | Description |
|---------------|-------------|
| `.md` | Raw Markdown |
| `.html` | Standalone HTML page |
| `.doc` | Word document |
| `.pdf` | Print to PDF |
| `.png` | Social media ratios (9:16, 4:5, 1:1, 16:9) |

---

## Quick Start

### Browser (Zero Install)

```bash
git clone https://github.com/Jam0731/marklume.git
# Double-click markdown-editor.html
```

### Desktop App

```bash
# Install dependencies
npm install

# Development mode
npm run tauri dev

# Build native installer
npm run tauri build
```

Output: `src-tauri/target/release/bundle/`

### Download

Get the latest release from [GitHub Releases](https://github.com/Jam0731/marklume/releases).

| Platform | Format |
|----------|--------|
| Windows | `.exe` installer |
| macOS | `.dmg` |
| Linux | `.deb`, `.rpm`, `.AppImage` |

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
| Frontend | Vanilla HTML/CSS/JS |
| Rendering | marked.js |
| Math | KaTeX |
| Diagrams | Mermaid 10 |
| Desktop | Tauri 2 (Rust + WebView) |
| CI/CD | GitHub Actions |

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
