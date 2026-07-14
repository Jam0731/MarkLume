# Changelog

All notable changes to MarkLume will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [2.0.0] - 2026-07-14

### Added
- VS Code-style file explorer sidebar
- Workspace management (open any folder as workspace)
- File tree with recursive directory browsing
- Create new files from sidebar
- Right-click context menu (rename, delete)
- Vue 3 Composition API refactor
- Modular component architecture
- Tauri 2 native file system integration

### Changed
- Desktop-only mode (removed single-file HTML browser version)
- Refactored to Vue 3 + Vite architecture
- Improved undo/redo system
- Enhanced modal dialogs (Find, Image, Mermaid, Web to MD)
- Updated Mermaid rendering with proper initialization
- Better cursor position preservation

### Removed
- Single-file HTML browser version
- Browser-based localStorage-only storage

## [1.0.0] - 2026-07-13

### Added
- Initial release of MarkLume
- Browser-based Markdown editor (single HTML file)
- Desktop app via Tauri 2 (Windows, macOS, Linux)
- Live preview with split view
- Rich text editing toolbar
- Dark/Light theme switching
- 10 language support (EN, ZH-CN, ZH-TW, JA, KO, ES, FR, DE, RU, PT)
- Auto-save to localStorage
- Export to Markdown, HTML, Word, PDF, PNG
- Drag-and-drop file import
- Math support (KaTeX)
- Diagram support (Mermaid)
- Web to Markdown conversion
- Find and replace
- Table insertion with visual grid
- Image upload with Base64 embedding
- Keyboard shortcuts
- Responsive design
- GitHub Actions CI/CD for cross-platform builds

### Security
- All content stored locally (no cloud sync)
- No tracking or analytics
- CSP-compliant

## [Unreleased]

### Planned
- Vim mode
- More export formats
- Plugin system
- Collaboration features
