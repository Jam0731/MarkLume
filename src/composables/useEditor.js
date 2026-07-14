import { ref, computed, nextTick } from 'vue'
import { useHistory } from './useHistory.js'

const STORAGE_KEY = 'md_editor_content'
const FILENAME_KEY = 'md_editor_filename'

export function useEditor() {
  const content = ref(localStorage.getItem(STORAGE_KEY) || '')
  const filename = ref(localStorage.getItem(FILENAME_KEY) || 'Untitled.md')
  const wordCount = computed(() => content.value.replace(/\s/g, '').length)

  const { init: initHistory, pushState, undo: historyUndo, redo: historyRedo } = useHistory()

  // Flag to prevent recording during undo/redo
  let isUndoRedo = false
  // Snapshot to push on next change
  let pendingSnapshot = null

  function init(welcomeDoc) {
    const saved = localStorage.getItem(STORAGE_KEY)
    content.value = saved !== null ? saved : (welcomeDoc || '')
    filename.value = localStorage.getItem(FILENAME_KEY) || 'Untitled.md'
    initHistory(content.value)
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, content.value)
    localStorage.setItem(FILENAME_KEY, filename.value)
  }

  // Called on keydown - capture current state before change
  function captureSnapshot() {
    if (!isUndoRedo) {
      pendingSnapshot = content.value
    }
  }

  // Called after content changes - push the captured snapshot
  function pushSnapshot() {
    if (!isUndoRedo && pendingSnapshot !== null) {
      pushState(pendingSnapshot)
      pendingSnapshot = null
    }
  }

  function undo(textarea) {
    isUndoRedo = true
    const prev = historyUndo()
    if (prev !== null) {
      content.value = prev
    }
    isUndoRedo = false
    if (textarea) {
      nextTick(() => {
        textarea.focus()
        const len = textarea.value.length
        textarea.selectionStart = len
        textarea.selectionEnd = len
      })
    }
  }

  function redo(textarea) {
    isUndoRedo = true
    const next = historyRedo()
    if (next !== null) {
      content.value = next
    }
    isUndoRedo = false
    if (textarea) {
      nextTick(() => {
        textarea.focus()
        const len = textarea.value.length
        textarea.selectionStart = len
        textarea.selectionEnd = len
      })
    }
  }

  function setCursor(textarea, pos) {
    const scrollTop = textarea?.scrollTop || 0
    nextTick(() => {
      if (textarea) {
        textarea.focus()
        textarea.selectionStart = pos
        textarea.selectionEnd = pos
        textarea.scrollTop = scrollTop
      }
    })
  }

  function wrapSelection(before, after, textarea) {
    if (!textarea) return
    captureSnapshot()
    pushSnapshot()
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.value.slice(start, end)
    content.value = content.value.slice(0, start) + before + selected + after + content.value.slice(end)
    setCursor(textarea, start + before.length)
  }

  function insertText(text, textarea) {
    if (!textarea) return
    captureSnapshot()
    pushSnapshot()
    const start = textarea.selectionStart
    content.value = content.value.slice(0, start) + text + content.value.slice(start)
    setCursor(textarea, start + text.length)
  }

  function prefixLines(prefix, textarea) {
    if (!textarea) return
    captureSnapshot()
    pushSnapshot()
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = content.value

    if (start === end) {
      const lineEnd = text.indexOf('\n', start)
      const actualLineEnd = lineEnd === -1 ? text.length : lineEnd
      const insert = '\n' + prefix
      content.value = text.slice(0, actualLineEnd) + insert + text.slice(actualLineEnd)
      setCursor(textarea, actualLineEnd + insert.length)
    } else {
      const firstLineStart = text.lastIndexOf('\n', start - 1) + 1
      const lines = text.slice(start, end).split('\n')
      const prefixed = lines.map(l => l ? prefix + l : l).join('\n')
      content.value = text.slice(0, firstLineStart) + prefixed + text.slice(end)
      const added = prefix.length * lines.filter(l => l).length
      setCursor(textarea, start + added)
    }
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
    prefixLines,
    captureSnapshot,
    pushSnapshot
  }
}
