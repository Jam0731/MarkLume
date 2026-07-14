<template>
  <div class="app" :class="{ 'page-fullscreen': isPageFullscreen }">
    <!-- SVG 图标精灵 -->
    <svg class="icon-sprite" style="position:absolute;width:0;height:0;overflow:hidden;" aria-hidden="true">
      <defs>
        <symbol id="icon-save" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></symbol>
        <symbol id="icon-upload" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></symbol>
        <symbol id="icon-download" viewBox="0 0 24 24"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></symbol>
        <symbol id="icon-globe" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></symbol>
        <symbol id="icon-help" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></symbol>
        <symbol id="icon-trash" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></symbol>
        <symbol id="icon-sun" viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"></path></symbol>
        <symbol id="icon-undo" viewBox="0 0 24 24"><path d="M3 7v6h6"></path><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"></path></symbol>
        <symbol id="icon-redo" viewBox="0 0 24 24"><path d="M21 7v6h-6"></path><path d="M3 17a9 9 0 0 1 9-9 9 9 0 0 1 6 2.3L21 13"></path></symbol>
        <symbol id="icon-quote" viewBox="0 0 24 24"><path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21c0 1 0 1 1 1z"></path><path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V21c0 1 0 1 1 1z"></path></symbol>
        <symbol id="icon-list" viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></symbol>
        <symbol id="icon-list-numbered" viewBox="0 0 24 24"><line x1="10" y1="6" x2="21" y2="6"></line><line x1="10" y1="12" x2="21" y2="12"></line><line x1="10" y1="18" x2="21" y2="18"></line><path d="M4 6h1v4"></path><path d="M4 10h2"></path><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path></symbol>
        <symbol id="icon-task" viewBox="0 0 24 24"><polyline points="9 11 12 14 22 4"></polyline><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path></symbol>
        <symbol id="icon-code" viewBox="0 0 24 24"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></symbol>
        <symbol id="icon-braces" viewBox="0 0 24 24"><path d="M8 3H7a2 2 0 0 0-2 2v5a2 2 0 0 1-2 2 2 2 0 0 1 2 2v5c0 1.1.9 2 2 2h1"></path><path d="M16 21h1a2 2 0 0 0 2-2v-5a2 2 0 0 1 2-2 2 2 0 0 1-2-2V5a2 2 0 0 0-2-2h-1"></path></symbol>
        <symbol id="icon-link" viewBox="0 0 24 24"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"></path><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"></path></symbol>
        <symbol id="icon-table" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="3" y1="15" x2="21" y2="15"></line><line x1="12" y1="3" x2="12" y2="21"></line></symbol>
        <symbol id="icon-search" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></symbol>
        <symbol id="icon-chevron-left" viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></symbol>
        <symbol id="icon-chevron-right" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></symbol>
        <symbol id="icon-chevron-down" viewBox="0 0 24 24"><polyline points="6 9 12 15 18 9"></polyline></symbol>
        <symbol id="icon-close" viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></symbol>
        <symbol id="icon-image" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></symbol>
        <symbol id="icon-mermaid" viewBox="0 0 24 24"><circle cx="12" cy="5" r="3"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="10" x2="7" y2="8"></line><line x1="12" y1="10" x2="17" y2="8"></line><line x1="12" y1="12" x2="7" y2="16"></line><line x1="12" y1="12" x2="17" y2="16"></line><circle cx="7" cy="17" r="2"></circle><circle cx="17" cy="17" r="2"></circle><circle cx="7" cy="7" r="2"></circle><circle cx="17" cy="7" r="2"></circle></symbol>
        <symbol id="icon-maximize" viewBox="0 0 24 24"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"></path></symbol>
        <symbol id="icon-book" viewBox="0 0 24 24"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path></symbol>
        <symbol id="icon-layout" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="3" y1="9" x2="21" y2="9"></line><line x1="9" y1="21" x2="9" y2="9"></line></symbol>
        <symbol id="icon-upload-cloud" viewBox="0 0 24 24"><polyline points="16 16 12 12 8 16"></polyline><line x1="12" y1="12" x2="12" y2="21"></line><path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3"></path></symbol>
      </defs>
    </svg>

    <TopBar
      v-model="filename"
      @save="handleSave"
      @import="handleImport"
      @toggle-theme="toggleTheme"
      @open-help="showHelp = true"
      @clear="handleClear"
      @export="handleExport"
      @open-web-to-md="showWebToMd = true"
    />

    <Toolbar
      @undo="undo"
      @redo="redo"
      @format="handleFormat"
      @prefix-lines="handlePrefixLines"
      @insert-link="handleInsertLink"
      @open-image="showImage = true"
      @open-find="showFind = true"
      @open-mermaid="showMermaid = true"
      @insert-table="handleInsertTable"
      @toggle-theme="toggleTheme"
    />

    <div class="main">
      <Editor
        ref="editorRef"
        v-model="content"
        :collapsed="editorCollapsed"
        @toggle-pane="editorCollapsed = !editorCollapsed"
        @undo="(textarea) => undo(textarea)"
        @redo="(textarea) => redo(textarea)"
        @format="handleFormat"
        @insert-link="handleInsertLink"
        @save="handleSave"
        @find="showFind = true"
      />

      <div class="resizer" :class="{ hidden: editorCollapsed || previewCollapsed }" @mousedown="startResize"></div>

      <Preview
        ref="previewRef"
        v-model="content"
        :html="previewHtml"
        :mode="previewMode"
        :collapsed="previewCollapsed"
        :word-count="wordCount"
        @update:mode="previewMode = $event"
        @toggle-pane="previewCollapsed = !previewCollapsed"
      />
    </div>

    <StatusBar ref="statusBarRef" />

    <!-- Toast -->
    <div class="toast" :class="{ show: toastVisible }">{{ toastMessage }}</div>

    <!-- Drop overlay -->
    <div class="drop-overlay" :class="{ show: isDragging }">
      <div class="drop-message">
        <svg class="icon icon-lg"><use href="#icon-upload"></use></svg>
        {{ t('dropMessage') }}
      </div>
    </div>

    <!-- Modals -->
    <FindReplace
      :visible="showFind"
      :content="content"
      @close="showFind = false"
      @update:content="content = $event"
    />

    <WebToMd
      :visible="showWebToMd"
      @close="showWebToMd = false"
      @insert="handleInsertMarkdown"
    />

    <InsertMermaid
      :visible="showMermaid"
      @close="showMermaid = false"
      @insert="handleInsertMarkdown"
    />

    <InsertImage
      :visible="showImage"
      @close="showImage = false"
      @insert="handleInsertMarkdown"
    />

    <ExportImage
      :visible="showExportImage"
      :html="previewHtml"
      @close="showExportImage = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, watch, nextTick } from 'vue'
import TopBar from './components/TopBar.vue'
import Toolbar from './components/Toolbar.vue'
import Editor from './components/Editor.vue'
import Preview from './components/Preview.vue'
import StatusBar from './components/StatusBar.vue'
import FindReplace from './components/FindReplace.vue'
import WebToMd from './components/WebToMd.vue'
import InsertMermaid from './components/InsertMermaid.vue'
import InsertImage from './components/InsertImage.vue'
import ExportImage from './components/ExportImage.vue'
import { useEditor } from './composables/useEditor.js'
import { usePreview } from './composables/usePreview.js'
import { useTheme } from './composables/useTheme.js'
import { useI18n } from './composables/useI18n.js'

const { t } = useI18n()
const { theme, toggleTheme, initTheme } = useTheme()
const {
  content, filename, wordCount,
  init, save, undo, redo,
  wrapSelection, insertText, prefixLines
} = useEditor()
const { html: previewHtml } = usePreview(content)

// State
const previewMode = ref('preview')
const editorCollapsed = ref(false)
const previewCollapsed = ref(false)
const isPageFullscreen = ref(false)
const editorRef = ref(null)
const previewRef = ref(null)
const statusBarRef = ref(null)

// Modal states
const showHelp = ref(false)
const showImage = ref(false)
const showFind = ref(false)
const showMermaid = ref(false)
const showWebToMd = ref(false)
const showExportImage = ref(false)

// Toast
const toastVisible = ref(false)
const toastMessage = ref('')

// Drag and drop
const isDragging = ref(false)
let dragCounter = 0

// Welcome doc
const welcomeDoc = `# Welcome to MarkLume

Type Markdown on the left and see the **live preview** on the right.

## Features

- Auto-saved to browser local storage
- Import / export \`.md\` files
- "Source" mode on the right for direct editing
- Convert web links to Markdown
- Shortcut: Ctrl+S to save

\`\`\`js
console.log("Hello MarkLume!");
\`\`\`
`

function showToast(msg) {
  toastMessage.value = msg
  toastVisible.value = true
  setTimeout(() => { toastVisible.value = false }, 2000)
}

function handleSave() {
  save()
  statusBarRef.value?.flashSaved()
  showToast(t('toastSaved'))
}

function handleImport(file) {
  const reader = new FileReader()
  reader.onload = (e) => {
    content.value = e.target.result
    let name = file.name
    if (!name.toLowerCase().endsWith('.md') && !name.toLowerCase().endsWith('.markdown')) {
      name += '.md'
    }
    filename.value = name
    save()
    showToast(t('toastFileImported'))
  }
  reader.readAsText(file)
}

function handleClear() {
  if (confirm(t('confirmClear'))) {
    content.value = ''
    save()
  }
}

function handleFormat(type, ...args) {
  const textarea = editorRef.value?.textarea
  switch (type) {
    case 'bold': wrapSelection('**', '**', textarea); break
    case 'italic': wrapSelection('*', '*', textarea); break
    case 'underline': wrapSelection('<u>', '</u>', textarea); break
    case 'strikethrough': wrapSelection('~~', '~~', textarea); break
    case 'subscript': wrapSelection('<sub>', '</sub>', textarea); break
    case 'superscript': wrapSelection('<sup>', '</sup>', textarea); break
    case 'inlineCode': wrapSelection('`', '`', textarea); break
    case 'codeBlock':
      const selected = content.value.slice(textarea.selectionStart, textarea.selectionEnd)
      if (selected.includes('\n')) {
        wrapSelection('```\n', '\n```', textarea)
      } else {
        wrapSelection('`', '`', textarea)
      }
      break
    case 'quote':
      const text = content.value.slice(textarea.selectionStart, textarea.selectionEnd) || t('quote')
      insertText('> ' + text.replace(/\n/g, '\n> '), textarea)
      break
    case 'heading':
      const level = args[0] || 1
      const start = textarea.selectionStart
      const before = content.value.slice(0, start)
      const lineStart = before.lastIndexOf('\n') + 1
      const lineEnd = content.value.indexOf('\n', lineStart)
      const end = lineEnd === -1 ? content.value.length : lineEnd
      const currentLine = content.value.slice(lineStart, end)
      const newLine = '#'.repeat(level) + ' ' + currentLine.replace(/^#{0,6}\s*/, '')
      content.value = content.value.slice(0, lineStart) + newLine + content.value.slice(end)
      break
  }
}

function handlePrefixLines(prefix) {
  const textarea = editorRef.value?.textarea
  prefixLines(prefix, textarea)
}

function handleInsertLink() {
  const textarea = editorRef.value?.textarea
  const url = prompt(t('promptLinkUrl'), t('promptLinkDefault'))
  if (!url) return
  const selected = content.value.slice(textarea.selectionStart, textarea.selectionEnd) || t('link')
  insertText('[' + selected + '](' + url + ')', textarea)
}

function handleInsertTable(rows, cols) {
  if (!rows || !cols) return
  const headerCols = Array.from({ length: cols }, (_, i) => ' Col' + (i + 1) + ' ').join('|')
  const separator = '|' + Array.from({ length: cols }, () => ' --- ').join('|') + '|'
  const dataCols = '|' + Array.from({ length: cols }, () => ' Data ').join('|') + '|'
  let table = '\n|' + headerCols + '|\n' + separator
  for (let r = 2; r <= rows; r++) {
    table += '\n' + dataCols
  }
  table += '\n'
  const textarea = editorRef.value?.textarea
  insertText(table, textarea)
}

function handleInsertMarkdown(md) {
  content.value += '\n\n' + md
  showToast(t('toastInsertedMd'))
}

function handleExport(type) {
  const name = filename.value || 'document'

  switch (type) {
    case 'md':
      exportFile(content.value, name.replace(/\.(md|markdown)$/i, '') + '.md', 'text/markdown')
      showToast(t('toastExported'))
      break
    case 'word':
      exportWord(name)
      break
    case 'pdf':
      exportPDF()
      break
    case 'html':
      exportHTML(name)
      break
    case 'image':
      showExportImage.value = true
      break
  }
}

function exportFile(text, filename, type) {
  const blob = new Blob([text], { type: type + ';charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function exportWord(name) {
  const docName = name.replace(/\.(md|markdown)$/i, '') + '.doc'
  const md = content.value
  let bodyHtml = typeof marked !== 'undefined' ? marked.parse(md) : '<pre>' + escapeHtml(md) + '</pre>'

  const fullHtml = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>${escapeHtml(docName)}</title>
<style>
  body { font-family: "Microsoft YaHei", sans-serif; font-size: 12pt; line-height: 1.6; }
  h1 { font-size: 20pt; font-weight: bold; } h2 { font-size: 16pt; font-weight: bold; }
  h3 { font-size: 14pt; font-weight: bold; } p { margin: 6pt 0; }
  pre, code { font-family: Consolas, monospace; background: #f5f5f5; padding: 2px 4px; }
  pre { padding: 8pt; border-radius: 4px; overflow-x: auto; }
  blockquote { border-left: 3px solid #ccc; padding: 4pt 10pt; color: #555; }
  table { border-collapse: collapse; width: 100%; } th, td { border: 1px solid #ccc; padding: 5pt 8pt; }
  th { background: #f5f5f5; font-weight: bold; }
  img { max-width: 100%; } hr { border: none; border-top: 1px solid #ccc; margin: 12pt 0; }
  a { color: #0563c1; text-decoration: underline; }
</style></head><body>${bodyHtml}</body></html>`

  exportFile(fullHtml, docName, 'application/msword')
  showToast(t('toastWordExported'))
}

function exportPDF() {
  showToast(t('toastChoosePdf'))
  setTimeout(() => window.print(), 500)
}

function exportHTML(name) {
  const htmlName = name.replace(/\.(md|markdown)$/i, '') + '.html'
  const md = content.value
  let bodyHtml = typeof marked !== 'undefined' ? marked.parse(md) : '<pre>' + escapeHtml(md) + '</pre>'

  const fullHtml = `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(htmlName)}</title>
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.css">
<style>
  body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "PingFang SC", sans-serif; font-size: 16px; line-height: 1.7; max-width: 820px; margin: 40px auto; padding: 0 20px; color: #212529; }
  h1, h2 { border-bottom: 1px solid #dee2e6; padding-bottom: 8px; }
  h1 { font-size: 2em; } h2 { font-size: 1.5em; } h3 { font-size: 1.25em; }
  p { margin: 0 0 14px; } a { color: #0d6efd; text-decoration: none; } a:hover { text-decoration: underline; }
  ul, ol { margin: 0 0 14px; padding-left: 2em; } li { margin: 4px 0; }
  code { background: #f1f3f5; padding: 2px 6px; border-radius: 4px; font-family: Consolas, monospace; font-size: 0.9em; }
  pre { background: #f1f3f5; padding: 14px; border-radius: 8px; overflow-x: auto; margin: 0 0 14px; }
  pre code { background: transparent; padding: 0; }
  blockquote { margin: 0 0 14px; padding: 8px 16px; border-left: 4px solid #8a93a1; background: #f1f3f5; color: #6c757d; }
  table { border-collapse: collapse; width: 100%; margin-bottom: 14px; }
  th, td { border: 1px solid #dee2e6; padding: 8px 12px; text-align: left; }
  th { background: #f1f3f5; font-weight: 600; }
  img { max-width: 100%; height: auto; border-radius: 6px; }
  hr { border: none; border-top: 1px solid #dee2e6; margin: 20px 0; }
</style></head><body>${bodyHtml}
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/katex.min.js"><\/script>
<script src="https://cdn.jsdelivr.net/npm/katex@0.16.9/dist/contrib/auto-render.min.js"><\/script>
<script>
document.addEventListener('DOMContentLoaded', function() {
  if (typeof renderMathInElement !== 'undefined') {
    renderMathInElement(document.body, {
      delimiters: [
        { left: '$$', right: '$$', display: true },
        { left: '$', right: '$', display: false }
      ],
      throwOnError: false
    });
  }
});
<\/script></body></html>`

  exportFile(fullHtml, htmlName, 'text/html')
  showToast(t('toastHtmlExported'))
}

function escapeHtml(text) {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

// Resize
const isResizing = ref(false)
const editorRatio = ref(0.5)
let resizeRect = null

function startResize(e) {
  isResizing.value = true
  resizeRect = document.querySelector('.main')?.getBoundingClientRect()
  document.body.classList.add('resizing')
  document.body.style.cursor = 'col-resize'
  document.body.style.userSelect = 'none'
  e.preventDefault()
}

function onResizeMove(e) {
  if (!isResizing.value || !resizeRect) return
  const clientX = e.touches ? e.touches[0].clientX : e.clientX
  let ratio = (clientX - resizeRect.left) / resizeRect.width
  ratio = Math.max(0.15, Math.min(0.85, ratio))
  editorRatio.value = ratio
  applySplit()
}

function stopResize() {
  if (!isResizing.value) return
  isResizing.value = false
  resizeRect = null
  document.body.classList.remove('resizing')
  document.body.style.cursor = ''
  document.body.style.userSelect = ''
}

function applySplit() {
  const editorPane = document.querySelector('.editor-pane')
  const previewPane = document.querySelector('.preview-pane')
  if (!editorPane || !previewPane) return
  if (editorCollapsed.value || previewCollapsed.value) {
    editorPane.style.flex = ''
    previewPane.style.flex = ''
  } else {
    editorPane.style.flex = `0 0 ${editorRatio.value * 100}%`
    previewPane.style.flex = '1 1 0'
  }
}

// Fullscreen
function togglePageFullscreen() {
  isPageFullscreen.value = !isPageFullscreen.value
  document.body.classList.toggle('page-fullscreen-active', isPageFullscreen.value)
  showToast(isPageFullscreen.value ? t('toastPageFullscreenOn') : t('toastPageFullscreenOff'))
}

function toggleSystemFullscreen() {
  if (!document.fullscreenEnabled && !document.webkitFullscreenEnabled) {
    showToast(t('toastNoFullscreenApi'))
    return
  }
  if (document.fullscreenElement || document.webkitFullscreenElement) {
    if (document.exitFullscreen) document.exitFullscreen()
    else if (document.webkitExitFullscreen) document.webkitExitFullscreen()
  } else {
    const el = document.documentElement
    if (el.requestFullscreen) el.requestFullscreen()
    else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen()
  }
}

// Sync scroll
let isSyncingScroll = false
function syncScroll(source, target) {
  if (isSyncingScroll) return
  const sourceHeight = source.scrollHeight - source.clientHeight
  const targetHeight = target.scrollHeight - target.clientHeight
  if (sourceHeight <= 0 || targetHeight <= 0) return
  isSyncingScroll = true
  const ratio = source.scrollTop / sourceHeight
  target.scrollTop = ratio * targetHeight
  setTimeout(() => { isSyncingScroll = false }, 10)
}

function setupSyncScroll() {
  const editorEl = document.querySelector('.editor-pane textarea')
  const previewEl = document.querySelector('.preview-content')
  if (editorEl && previewEl) {
    editorEl.addEventListener('scroll', () => syncScroll(editorEl, previewEl))
    previewEl.addEventListener('scroll', () => syncScroll(previewEl, editorEl))
    return true
  }
  return false
}

onMounted(() => {
  initTheme()
  init(welcomeDoc)

  // Resize listeners
  window.addEventListener('mousemove', onResizeMove)
  window.addEventListener('touchmove', onResizeMove, { passive: false })
  window.addEventListener('mouseup', stopResize)
  window.addEventListener('touchend', stopResize)

  // Drag and drop listeners
  document.addEventListener('dragenter', (e) => {
    e.preventDefault()
    dragCounter++
    isDragging.value = true
  })
  document.addEventListener('dragleave', () => {
    dragCounter--
    if (dragCounter <= 0) {
      dragCounter = 0
      isDragging.value = false
    }
  })
  document.addEventListener('dragover', (e) => e.preventDefault())
  document.addEventListener('drop', (e) => {
    e.preventDefault()
    dragCounter = 0
    isDragging.value = false
    const file = e.dataTransfer.files[0]
    if (file) handleImport(file)
  })

  // Sync scroll - retry until elements are ready
  let scrollRetries = 0
  const trySetupScroll = () => {
    if (setupSyncScroll()) return
    if (scrollRetries < 20) {
      scrollRetries++
      setTimeout(trySetupScroll, 100)
    }
  }
  nextTick(trySetupScroll)

  // Global keyboard shortcuts
  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault()
      handleSave()
    }
  })
})

// Auto-save
let saveTimer
watch(content, () => {
  clearTimeout(saveTimer)
  saveTimer = setTimeout(() => save(), 500)
})
</script>
