import { ref, computed, nextTick } from 'vue'
import { useHistory } from './useHistory.js'

const STORAGE_KEY = 'md_editor_content'
const FILENAME_KEY = 'md_editor_filename'

export function useEditor() {
  const content = ref(localStorage.getItem(STORAGE_KEY) || '')
  const filename = ref(localStorage.getItem(FILENAME_KEY) || 'Untitled.md')
  const wordCount = computed(() => content.value.replace(/\s/g, '').length)

  const { init: initHistory, recordState, undo: historyUndo, redo: historyRedo } = useHistory()

  // Flag to prevent recording during programmatic changes
  let isUndoRedoing = false

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

  // Record current state before making a change
  function recordBeforeChange() {
    if (!isUndoRedoing) {
      recordState(content.value)
    }
  }

  function undo(textarea) {
    isUndoRedoing = true
    const prev = historyUndo()
    if (prev !== null) {
      content.value = prev
    }
    isUndoRedoing = false
    // Restore cursor - try to keep it at current position or end
    if (textarea) {
      nextTick(() => {
        textarea.focus()
        const pos = Math.min(textarea.selectionStart, textarea.value.length)
        textarea.selectionStart = pos
        textarea.selectionEnd = pos
      })
    }
  }

  function redo(textarea) {
    isUndoRedoing = true
    const next = historyRedo()
    if (next !== null) {
      content.value = next
    }
    isUndoRedoing = false
    if (textarea) {
      nextTick(() => {
        textarea.focus()
        const pos = Math.min(textarea.selectionStart, textarea.value.length)
        textarea.selectionStart = pos
        textarea.selectionEnd = pos
      })
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
    recordBeforeChange()
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.value.slice(start, end)
    content.value = content.value.slice(0, start) + before + selected + after + content.value.slice(end)
    setCursorAfterUpdate(textarea, start + before.length, end + before.length)
  }

  function insertText(text, textarea) {
    if (!textarea) return
    recordBeforeChange()
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    content.value = content.value.slice(0, start) + text + content.value.slice(end)
    setCursorAfterUpdate(textarea, start + text.length, start + text.length)
  }

  function prefixLines(prefix, textarea) {
    if (!textarea) return
    recordBeforeChange()
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const text = content.value

    // No selection - insert new line with prefix after current line
    if (start === end) {
      const lineStart = text.lastIndexOf('\n', start - 1) + 1
      const lineEnd = text.indexOf('\n', start)
      const actualLineEnd = lineEnd === -1 ? text.length : lineEnd

      if (!text.slice(lineStart, actualLineEnd).trim()) {
        // Empty line - just insert prefix
        content.value = text.slice(0, start) + prefix + text.slice(start)
        setCursorAfterUpdate(textarea, start + prefix.length, start + prefix.length)
      } else {
        // Insert new line with prefix after current line
        const insertStr = '\n' + prefix
        content.value = text.slice(0, actualLineEnd) + insertStr + text.slice(actualLineEnd)
        setCursorAfterUpdate(textarea, actualLineEnd + insertStr.length, actualLineEnd + insertStr.length)
      }
      return
    }

    // Has selection - add prefix to each selected line
    const before = text.slice(0, start)
    const selected = text.slice(start, end)
    const firstLineStart = before.lastIndexOf('\n') + 1
    const lines = selected.split('\n')
    const prefixed = lines.map(line => line ? prefix + line : line).join('\n')
    content.value = text.slice(0, firstLineStart) + prefixed + text.slice(end)
    const addedLength = prefix.length * lines.filter(l => l).length
    setCursorAfterUpdate(textarea, start + addedLength, end + addedLength)
  }

  function handleInput(e) {
    // Called on every input event - record state before Vue updates
    recordBeforeChange()
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
    handleInput
  }
}
