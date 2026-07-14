# Vue Refactor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use compose:subagent (recommended) or compose:execute to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Refactor the single-file Markdown editor into a modular Vue 3 project while preserving the single-file HTML output for browser use.

**Architecture:** Vue 3 + Vite project with component-based architecture. Components handle UI, composables handle logic. Build outputs both a `dist/` folder (for Tauri) and a single inlined HTML file (for browser double-click use).

**Tech Stack:** Vue 3 (Composition API), Vite, viteSingleFile, marked.js, KaTeX, Mermaid 10, Tauri 2

## Global Constraints

- Single-file HTML output must remain functional (double-click to use)
- All existing features must work identically after refactoring
- Tauri integration must continue working
- i18n support for 10 languages must be preserved
- Dark/Light theme must be preserved
- No new features during refactoring (YAGNI)

---

## File Structure

```
marklume/
├── index.html                    # Vite entry point
├── vite.config.js                # Vite configuration
├── package.json                  # Dependencies
├── src/
│   ├── main.js                   # Vue app initialization
│   ├── App.vue                   # Root component
│   ├── components/
│   │   ├── TopBar.vue           # Top navigation bar
│   │   ├── Toolbar.vue          # Formatting toolbar
│   │   ├── Editor.vue           # Markdown editor (textarea)
│   │   ├── Preview.vue          # Live preview pane
│   │   ├── StatusBar.vue        # Bottom status bar
│   │   ├── FindReplace.vue      # Find & replace dialog
│   │   ├── ExportImage.vue      # Export image dialog
│   │   ├── InsertImage.vue      # Insert image dialog
│   │   ├── InsertMermaid.vue    # Insert Mermaid dialog
│   │   └── TablePicker.vue      # Table grid picker
│   ├── composables/
│   │   ├── useEditor.js         # Editor core logic
│   │   ├── usePreview.js        # Markdown preview rendering
│   │   ├── useHistory.js        # Undo/redo history
│   │   ├── useFileIO.js         # File operations (browser + Tauri)
│   │   ├── useExport.js         # Export to various formats
│   │   ├── useTheme.js          # Theme switching
│   │   └── useI18n.js           # Internationalization
│   ├── i18n/
│   │   ├── index.js             # i18n loader
│   │   ├── zh-CN.js             # Simplified Chinese
│   │   ├── zh-TW.js             # Traditional Chinese
│   │   ├── en.js                # English
│   │   ├── ja.js                # Japanese
│   │   ├── ko.js                # Korean
│   │   ├── es.js                # Spanish
│   │   ├── fr.js                # French
│   │   ├── de.js                # German
│   │   ├── ru.js                # Russian
│   │   └── pt.js                # Portuguese
│   └── styles/
│       ├── variables.css        # CSS variables (themes)
│       ├── base.css             # Reset & base styles
│       ├── layout.css           # App layout
│       ├── editor.css           # Editor pane styles
│       ├── preview.css          # Preview pane styles
│       ├── toolbar.css          # Toolbar styles
│       ├── modal.css            # Dialog styles
│       └── responsive.css       # Mobile styles
├── public/                       # Static assets
│   └── marklume.html            # Built single-file version
└── src-tauri/                    # Tauri (unchanged except path updates)
```

---

## Task 1: Initialize Vite + Vue Project

**Covers:** Project scaffolding

**Files:**
- Create: `package.json`
- Create: `vite.config.js`
- Create: `index.html`
- Create: `src/main.js`
- Create: `src/App.vue`

**Interfaces:**
- Produces: Running Vue dev server with basic app shell

- [ ] **Step 1: Create package.json**

```json
{
  "name": "marklume",
  "version": "2.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "build:single": "vite build --mode single",
    "preview": "vite preview",
    "tauri": "tauri",
    "tauri:dev": "tauri dev",
    "tauri:build": "tauri build"
  },
  "dependencies": {
    "vue": "^3.5.0",
    "marked": "^15.0.0",
    "katex": "^0.16.0",
    "mermaid": "^11.0.0",
    "dom-to-image-more": "^3.5.0"
  },
  "devDependencies": {
    "@vitejs/plugin-vue": "^5.0.0",
    "vite": "^6.0.0",
    "vite-plugin-singlefile": "^2.0.0",
    "tauri-plugin-dialog": "^2.0.0",
    "tauri-plugin-fs": "^2.0.0"
  }
}
```

- [ ] **Step 2: Create vite.config.js**

```javascript
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

const isSingleFile = process.env.mode === 'single' || process.argv.includes('--mode single')

export default defineConfig({
  plugins: [
    vue(),
    ...(isSingleFile ? [viteSingleFile()] : [])
  ],
  build: {
    outDir: isSingleFile ? 'public' : 'dist',
    cssCodeSplit: false,
    assetsInlineLimit: 100000000
  }
})
```

- [ ] **Step 3: Create index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>MarkLume</title>
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
</head>
<body data-theme="light">
  <div id="app"></div>
  <script type="module" src="/src/main.js"></script>
</body>
</html>
```

- [ ] **Step 4: Create src/main.js**

```javascript
import { createApp } from 'vue'
import App from './App.vue'
import './styles/variables.css'
import './styles/base.css'
import './styles/layout.css'

createApp(App).mount('#app')
```

- [ ] **Step 5: Create src/App.vue (minimal shell)**

```vue
<template>
  <div class="app">
    <h1>MarkLume - Refactoring in progress</h1>
  </div>
</template>

<script setup>
</script>
```

- [ ] **Step 6: Install dependencies and verify dev server**

Run: `npm install && npm run dev`
Expected: Browser shows "MarkLume - Refactoring in progress"

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "chore: initialize Vue 3 + Vite project"
```

---

## Task 2: Extract CSS Styles

**Covers:** Style organization

**Files:**
- Create: `src/styles/variables.css`
- Create: `src/styles/base.css`
- Create: `src/styles/layout.css`
- Create: `src/styles/editor.css`
- Create: `src/styles/preview.css`
- Create: `src/styles/toolbar.css`
- Create: `src/styles/modal.css`
- Create: `src/styles/responsive.css`

**Interfaces:**
- Consumes: CSS from original `marklume.html`
- Produces: Modular CSS files importable by Vue components

- [ ] **Step 1: Extract CSS variables to src/styles/variables.css**

Copy the `:root` and `[data-theme="dark"]` blocks from the original HTML.

- [ ] **Step 2: Extract base styles to src/styles/base.css**

Copy reset styles (`*`, `html`, `body`, `::selection`).

- [ ] **Step 3: Extract layout styles to src/styles/layout.css**

Copy `.app`, `.top-bar`, `.main`, `.pane`, `.resizer`, `.statusbar` styles.

- [ ] **Step 4: Extract remaining CSS files**

Split remaining styles by component: editor, preview, toolbar, modal, responsive.

- [ ] **Step 5: Import all CSS in main.js**

Add imports in order: variables → base → layout → components.

- [ ] **Step 6: Verify styles load correctly**

Run: `npm run dev`
Expected: App shell styled correctly.

- [ ] **Step 7: Commit**

```bash
git add src/styles/
git commit -m "style: extract CSS into modular files"
```

---

## Task 3: Create Core Composables

**Covers:** Logic extraction

**Files:**
- Create: `src/composables/useEditor.js`
- Create: `src/composables/usePreview.js`
- Create: `src/composables/useHistory.js`
- Create: `src/composables/useTheme.js`
- Create: `src/composables/useI18n.js`

**Interfaces:**
- Produces: Reusable logic hooks for components

- [ ] **Step 1: Create useI18n.js composable**

```javascript
import { ref } from 'vue'
import * as locales from '../i18n/index.js'

const currentLang = ref(localStorage.getItem('md_editor_language') || 'zh-CN')

export function useI18n() {
  function t(key, ...args) {
    const dict = locales[currentLang.value] || locales['zh-CN']
    let str = dict[key]
    if (str === undefined) str = locales['zh-CN'][key] || key
    return args.reduce((s, arg, i) => s.replace(new RegExp('\\{' + i + '\\}', 'g'), String(arg)), str)
  }

  function setLanguage(lang) {
    if (!locales[lang]) lang = 'zh-CN'
    currentLang.value = lang
    localStorage.setItem('md_editor_language', lang)
  }

  return { currentLang, t, setLanguage }
}
```

- [ ] **Step 2: Create useTheme.js composable**

```javascript
import { ref, watch } from 'vue'

const theme = ref(localStorage.getItem('md_editor_theme') || 'light')

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    document.body.setAttribute('data-theme', theme.value)
    localStorage.setItem('md_editor_theme', theme.value)
  }

  // Initialize
  document.body.setAttribute('data-theme', theme.value)

  return { theme, toggleTheme }
}
```

- [ ] **Step 3: Create useHistory.js composable**

Extract undo/redo logic from original HTML.

- [ ] **Step 4: Create useEditor.js composable**

Extract editor state, content, word count logic.

- [ ] **Step 5: Create usePreview.js composable**

Extract Markdown rendering, KaTeX, Mermaid logic.

- [ ] **Step 6: Commit**

```bash
git add src/composables/
git commit -m "feat: extract core composables"
```

---

## Task 4: Create Vue Components

**Covers:** UI component extraction

**Files:**
- Create: `src/components/TopBar.vue`
- Create: `src/components/Toolbar.vue`
- Create: `src/components/Editor.vue`
- Create: `src/components/Preview.vue`
- Create: `src/components/StatusBar.vue`

**Interfaces:**
- Consumes: Composables from Task 3
- Produces: Complete editor UI

- [ ] **Step 1: Create TopBar.vue**

```vue
<template>
  <div class="top-bar">
    <span class="brand">MarkLume</span>
    <input type="text" v-model="filename" :title="t('filenameTitle')">
    <div class="spacer"></div>
    <div class="top-actions">
      <button @click="save" class="primary">
        <svg class="icon"><use href="#icon-save"></use></svg>
        <span>{{ t('save') }}</span>
      </button>
      <!-- More buttons... -->
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const { t } = useI18n()
const filename = ref(localStorage.getItem('md_editor_filename') || 'Untitled.md')

function save() {
  localStorage.setItem('md_editor_content', content.value)
  localStorage.setItem('md_editor_filename', filename.value)
}
</script>
```

- [ ] **Step 2: Create Toolbar.vue**

Extract all formatting buttons and handlers.

- [ ] **Step 3: Create Editor.vue**

```vue
<template>
  <div class="pane editor-pane">
    <textarea
      ref="textarea"
      v-model="content"
      @input="onInput"
      @keydown="handleKeydown"
      spellcheck="false"
    ></textarea>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useEditor } from '../composables/useEditor.js'

const { content, onInput } = useEditor()
const textarea = ref(null)

defineExpose({ textarea })
</script>
```

- [ ] **Step 4: Create Preview.vue**

Render Markdown preview with KaTeX and Mermaid.

- [ ] **Step 5: Create StatusBar.vue**

Display word count and shortcuts hint.

- [ ] **Step 6: Update App.vue to use components**

```vue
<template>
  <div class="app">
    <TopBar />
    <Toolbar />
    <div class="main">
      <Editor ref="editorRef" />
      <div class="resizer" id="resizer"></div>
      <Preview />
    </div>
    <StatusBar />
  </div>
</template>

<script setup>
import TopBar from './components/TopBar.vue'
import Toolbar from './components/Toolbar.vue'
import Editor from './components/Editor.vue'
import Preview from './components/Preview.vue'
import StatusBar from './components/StatusBar.vue'
</script>
```

- [ ] **Step 7: Verify core editor works**

Run: `npm run dev`
Expected: Can type in editor, see preview, use toolbar.

- [ ] **Step 8: Commit**

```bash
git add src/components/ src/App.vue
git commit -m "feat: create core Vue components"
```

---

## Task 5: Create Dialog Components

**Covers:** Modal dialogs

**Files:**
- Create: `src/components/FindReplace.vue`
- Create: `src/components/ExportImage.vue`
- Create: `src/components/InsertImage.vue`
- Create: `src/components/InsertMermaid.vue`
- Create: `src/components/TablePicker.vue`

**Interfaces:**
- Consumes: Editor composable for text manipulation
- Produces: Modal dialog components

- [ ] **Step 1: Create FindReplace.vue**

Extract find/replace logic and UI.

- [ ] **Step 2: Create ExportImage.vue**

Extract image export with ratio selection.

- [ ] **Step 3: Create InsertImage.vue**

Extract image URL/upload dialog.

- [ ] **Step 4: Create InsertMermaid.vue**

Extract Mermaid code input dialog.

- [ ] **Step 5: Create TablePicker.vue**

Extract 8x8 table grid selector.

- [ ] **Step 6: Add modal state management to App.vue**

```javascript
const modals = ref({
  findReplace: false,
  exportImage: false,
  insertImage: false,
  insertMermaid: false,
  tablePicker: false
})
```

- [ ] **Step 7: Commit**

```bash
git add src/components/
git commit -m "feat: create dialog components"
```

---

## Task 6: Extract i18n

**Covers:** Internationalization

**Files:**
- Create: `src/i18n/index.js`
- Create: `src/i18n/zh-CN.js`
- Create: `src/i18n/en.js`
- Create: `src/i18n/*.js` (other languages)

**Interfaces:**
- Consumes: Original `i18n.js`
- Produces: Modular i18n files

- [ ] **Step 1: Create src/i18n/index.js**

```javascript
export * as zhCN from './zh-CN.js'
export * as zhTW from './zh-TW.js'
export * as en from './en.js'
export * as ja from './ja.js'
export * as ko from './ko.js'
export * as es from './es.js'
export * as fr from './fr.js'
export * as de from './de.js'
export * as ru from './ru.js'
export * as pt from './pt.js'

export default {
  'zh-CN': zhCN.default,
  'zh-TW': zhTW.default,
  'en': en.default,
  'ja': ja.default,
  'ko': ko.default,
  'es': es.default,
  'fr': fr.default,
  'de': de.default,
  'ru': ru.default,
  'pt': pt.default
}
```

- [ ] **Step 2: Create src/i18n/zh-CN.js**

Extract zh-CN translations from original `i18n.js`.

- [ ] **Step 3: Create other language files**

Repeat for all 10 languages.

- [ ] **Step 4: Verify language switching works**

- [ ] **Step 5: Commit**

```bash
git add src/i18n/
git commit -m "feat: extract i18n into modular files"
```

---

## Task 7: Configure Single-File Build

**Covers:** Build output

**Files:**
- Modify: `vite.config.js`
- Create: `scripts/build-single.sh`

**Interfaces:**
- Consumes: Vue app
- Produces: Single HTML file output

- [ ] **Step 1: Verify viteSingleFile works**

Run: `npm run build:single`
Expected: `public/marklume.html` created, fully self-contained.

- [ ] **Step 2: Test single-file in browser**

Open `public/marklume.html` directly.
Expected: Editor works exactly like the original.

- [ ] **Step 3: Create build script**

```bash
#!/bin/bash
echo "Building single-file version..."
npm run build:single
echo "Output: public/marklume.html"
```

- [ ] **Step 4: Commit**

```bash
git add vite.config.js scripts/
git commit -m "feat: configure single-file build output"
```

---

## Task 8: Update Tauri Integration

**Covers:** Desktop app

**Files:**
- Modify: `src-tauri/tauri.conf.json`

**Interfaces:**
- Consumes: Vite build output
- Produces: Working Tauri desktop app

- [ ] **Step 1: Update tauri.conf.json paths**

```json
{
  "build": {
    "devUrl": "http://localhost:5173",
    "frontendDist": "../dist"
  }
}
```

- [ ] **Step 2: Test Tauri dev mode**

Run: `npm run tauri:dev`
Expected: Tauri window opens with Vite dev server.

- [ ] **Step 3: Test Tauri build**

Run: `npm run tauri:build`
Expected: Desktop app builds successfully.

- [ ] **Step 4: Commit**

```bash
git add src-tauri/tauri.conf.json
git commit -m "fix: update Tauri integration for Vue project"
```

---

## Task 9: Clean Up and Finalize

**Covers:** Cleanup

**Files:**
- Delete: `marklume.html` (replaced by build output)
- Delete: `i18n.js` (replaced by src/i18n/)
- Modify: `README.md`
- Modify: `.github/workflows/build.yml`

**Interfaces:**
- Consumes: All previous tasks
- Produces: Clean, final project structure

- [ ] **Step 1: Remove old files**

```bash
git rm marklume.html i18n.js
```

- [ ] **Step 2: Update README with new dev instructions**

- [ ] **Step 3: Update GitHub Actions workflow**

```yaml
- name: Install frontend dependencies
  run: npm install

- name: Build frontend
  run: npm run build

- name: Build Tauri app
  run: npm run tauri:build
```

- [ ] **Step 4: Final verification**

- `npm run dev` works
- `npm run build:single` produces working HTML
- `npm run tauri:build` produces desktop app
- All 10 languages work
- Theme switching works
- All features work

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "chore: clean up old files and finalize refactoring"
```

---

## Verification Checklist

After all tasks complete:

- [ ] `npm run dev` starts development server
- [ ] Editor typing and preview work
- [ ] Toolbar formatting works
- [ ] All dialogs (find/replace, image, mermaid, table) work
- [ ] Theme switching works
- [ ] Language switching works (all 10 languages)
- [ ] `npm run build:single` produces working `marklume.html`
- [ ] `npm run tauri:dev` opens desktop app
- [ ] `npm run tauri:build` produces installers
- [ ] Export (MD, HTML, Word, PDF, PNG) works
- [ ] Keyboard shortcuts work
