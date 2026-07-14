import { ref, computed } from 'vue'
import { useHistory } from './useHistory.js'

const STORAGE_KEY = 'md_editor_content'
const FILENAME_KEY = 'md_editor_filename'

export function useEditor() {
  const content = ref(localStorage.getItem(STORAGE_KEY) || '')
  const filename = ref(localStorage.getItem(FILENAME_KEY) || 'Untitled.md')
  const wordCount = computed(() => content.value.replace(/\s/g, '').length)

  const history = useHistory()

  function init(welcomeDoc) {
    const saved = localStorage.getItem(STORAGE_KEY)
    content.value = saved !== null ? saved : (welcomeDoc || '')
    filename.value = localStorage.getItem(FILENAME_KEY) || 'Untitled.md'
    history.init(content.value)
  }

  function save() {
    localStorage.setItem(STORAGE_KEY, content.value)
    localStorage.setItem(FILENAME_KEY, filename.value)
  }

  // Save current state to history (call before making changes)
  function saveToHistory() {
    history.push(content.value)
  }

  function undo(textarea) {
    const cursorPos = textarea?.selectionStart || 0
    const scrollTop = textarea?.scrollTop || 0
    const prev = history.undo(content.value)
    if (prev !== null) {
      content.value = prev
      // Use requestAnimationFrame to restore cursor after Vue updates DOM
      requestAnimationFrame(() => {
        if (textarea) {
          const newPos = Math.min(cursorPos, prev.length)
          textarea.selectionStart = newPos
          textarea.selectionEnd = newPos
          textarea.scrollTop = scrollTop
        }
      })
    }
  }

  function redo(textarea) {
    const cursorPos = textarea?.selectionStart || 0
    const scrollTop = textarea?.scrollTop || 0
    const next = history.redo()
    if (next !== null) {
      content.value = next
      requestAnimationFrame(() => {
        if (textarea) {
          const newPos = Math.min(cursorPos, next.length)
          textarea.selectionStart = newPos
          textarea.selectionEnd = newPos
          textarea.scrollTop = scrollTop
        }
      })
    }
  }

  function setCursor(textarea, pos) {
    if (textarea) {
      setTimeout(() => {
        textarea.focus()
        textarea.selectionStart = pos
        textarea.selectionEnd = pos
      }, 0)
    }
  }

  function wrapSelection(before, after, textarea) {
    if (!textarea) return
    saveToHistory()
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.value.slice(start, end)
    content.value = content.value.slice(0, start) + before + selected + after + content.value.slice(end)
    setCursor(textarea, start + before.length)
  }

  function insertText(text, textarea) {
    if (!textarea) return
    saveToHistory()
    const start = textarea.selectionStart
    content.value = content.value.slice(0, start) + text + content.value.slice(start)
    setCursor(textarea, start + text.length)
  }

  function prefixLines(prefix, textarea) {
    if (!textarea) return
    saveToHistory()
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
    saveToHistory,
    wrapSelection,
    insertText,
    prefixLines
  }
}
