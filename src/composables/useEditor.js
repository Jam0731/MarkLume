import { ref, computed, watch, nextTick } from 'vue'
import { useHistory } from './useHistory.js'

const STORAGE_KEY = 'md_editor_content'
const FILENAME_KEY = 'md_editor_filename'

export function useEditor() {
  const content = ref(localStorage.getItem(STORAGE_KEY) || '')
  const filename = ref(localStorage.getItem(FILENAME_KEY) || 'Untitled.md')
  const wordCount = computed(() => content.value.replace(/\s/g, '').length)

  const { init: initHistory, recordHistory, undo: historyUndo, redo: historyRedo } = useHistory()

  // Track last recorded content to avoid duplicate entries
  let lastRecordedContent = content.value
  // Flag to skip watcher during undo/redo
  let skipWatcher = false

  // Watch for content changes and record history
  watch(content, (newVal) => {
    if (skipWatcher) {
      skipWatcher = false
      return
    }
    if (newVal !== lastRecordedContent) {
      recordHistory(lastRecordedContent)
      lastRecordedContent = newVal
    }
  })

  function init(welcomeDoc) {
    const saved = localStorage.getItem(STORAGE_KEY)
    content.value = saved !== null ? saved : (welcomeDoc || '')
    filename.value = localStorage.getItem(FILENAME_KEY) || 'Untitled.md'
    lastRecordedContent = content.value
    initHistory(content.value)
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, content.value)
    localStorage.setItem(FILENAME_KEY, filename.value)
  }

  function undo(textarea) {
    const prev = historyUndo()
    if (prev !== null) {
      skipWatcher = true
      lastRecordedContent = prev
      content.value = prev
      // Restore cursor position
      if (textarea) {
        nextTick(() => {
          textarea.focus()
          // Try to keep cursor near the end, or at a reasonable position
          const pos = Math.min(textarea.selectionStart, textarea.value.length)
          textarea.selectionStart = pos
          textarea.selectionEnd = pos
        })
      }
    }
  }

  function redo(textarea) {
    const next = historyRedo()
    if (next !== null) {
      skipWatcher = true
      lastRecordedContent = next
      content.value = next
      if (textarea) {
        nextTick(() => {
          textarea.focus()
          const pos = Math.min(textarea.selectionStart, textarea.value.length)
          textarea.selectionStart = pos
          textarea.selectionEnd = pos
        })
      }
    }
  }

  function setCursorAfterUpdate(textarea, startPos, endPos) {
    const scrollTop = textarea?.scrollTop || 0
    nextTick(() => {
      if (textarea) {
        textarea.focus()
        textarea.selectionStart = startPos
        textarea.selectionEnd = endPos
        textarea.scrollTop = scrollTop
      }
    })
  }

  function wrapSelection(before, after, textarea) {
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.value.slice(start, end)
    const newText = content.value.slice(0, start) + before + selected + after + content.value.slice(end)
    recordHistory(content.value)
    lastRecordedContent = newText
    content.value = newText
    setCursorAfterUpdate(textarea, start + before.length, end + before.length)
  }

  function insertText(text, textarea) {
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newText = content.value.slice(0, start) + text + content.value.slice(end)
    recordHistory(content.value)
    lastRecordedContent = newText
    content.value = newText
    setCursorAfterUpdate(textarea, start + text.length, start + text.length)
  }

  function prefixLines(prefix, textarea) {
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = content.value

    // No selection - insert new line with prefix after current line
    if (start === end) {
      const lineStart = text.lastIndexOf('\n', start - 1) + 1
      const lineEnd = text.indexOf('\n', start)
      const actualLineEnd = lineEnd === -1 ? text.length : lineEnd
      const currentLine = text.slice(lineStart, actualLineEnd)

      if (!currentLine.trim()) {
        // Empty line - just insert prefix
        const newText = text.slice(0, start) + prefix + text.slice(start)
        recordHistory(text)
        lastRecordedContent = newText
        content.value = newText
        setCursorAfterUpdate(textarea, start + prefix.length, start + prefix.length)
      } else {
        // Insert new line with prefix after current line
        const insertText = '\n' + prefix
        const newText = text.slice(0, actualLineEnd) + insertText + text.slice(actualLineEnd)
        recordHistory(text)
        lastRecordedContent = newText
        content.value = newText
        const newPos = actualLineEnd + insertText.length
        setCursorAfterUpdate(textarea, newPos, newPos)
      }
      return
    }

    // Has selection - add prefix to each selected line
    const before = text.slice(0, start)
    const selected = text.slice(start, end)
    const firstLineStart = before.lastIndexOf('\n') + 1
    const lines = selected.split('\n')
    const prefixed = lines.map(line => line ? prefix + line : line).join('\n')
    const newText = text.slice(0, firstLineStart) + prefixed + text.slice(end)
    recordHistory(text)
    lastRecordedContent = newText
    content.value = newText
    const addedLength = prefix.length * lines.filter(l => l).length
    setCursorAfterUpdate(textarea, start + addedLength, end + addedLength)
  }

  return {
    content,
    filename,
    wordCount,
    init,
    save,
    undo,
    redo,
    wrapSelection,
    insertText,
    prefixLines
  }
}
