import { ref, computed, watch, nextTick } from 'vue'
import { useHistory } from './useHistory.js'

const STORAGE_KEY = 'md_editor_content'
const FILENAME_KEY = 'md_editor_filename'

export function useEditor() {
  const content = ref(localStorage.getItem(STORAGE_KEY) || '')
  const filename = ref(localStorage.getItem(FILENAME_KEY) || 'Untitled.md')
  const wordCount = computed(() => content.value.replace(/\s/g, '').length)

  const { init: initHistory, pushHistory, recordHistory, undo: historyUndo, redo: historyRedo } = useHistory()

  // Watch for content changes and record history (debounced)
  let lastRecordedContent = content.value
  watch(content, (newVal) => {
    if (newVal !== lastRecordedContent) {
      pushHistory(lastRecordedContent)
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

  function updateContent(newContent) {
    pushHistory(content.value)
    content.value = newContent
  }

  function undo() {
    const prev = historyUndo()
    if (prev !== null) {
      lastRecordedContent = prev
      content.value = prev
    }
  }

  function redo() {
    const next = historyRedo()
    if (next !== null) {
      lastRecordedContent = next
      content.value = next
    }
  }

  function setCursorAfterUpdate(textarea, startPos, endPos) {
    nextTick(() => {
      if (textarea) {
        textarea.focus()
        textarea.selectionStart = startPos
        textarea.selectionEnd = endPos
      }
    })
  }

  function wrapSelection(before, after, textarea) {
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selected = content.value.slice(start, end)
    const newText = content.value.slice(0, start) + before + selected + after + content.value.slice(end)
    pushHistory(content.value)
    content.value = newText
    setCursorAfterUpdate(textarea, start + before.length, end + before.length)
  }

  function insertText(text, textarea) {
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const newText = content.value.slice(0, start) + text + content.value.slice(end)
    pushHistory(content.value)
    content.value = newText
    setCursorAfterUpdate(textarea, start + text.length, start + text.length)
  }

  function prefixLines(prefix, textarea) {
    if (!textarea) return
    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const before = content.value.slice(0, start)
    const selected = content.value.slice(start, end) || 'text'
    const firstLineStart = before.lastIndexOf('\n') + 1
    const lines = selected.split('\n')
    const prefixed = lines.map(line => line ? prefix + line : line).join('\n')
    const newText = content.value.slice(0, firstLineStart) + prefixed + content.value.slice(end)
    pushHistory(content.value)
    content.value = newText
    // Calculate new cursor position after prefix
    const addedLength = prefix.length * lines.filter(l => l).length
    setCursorAfterUpdate(textarea, start + addedLength, end + addedLength)
  }

  return {
    content,
    filename,
    wordCount,
    init,
    save,
    updateContent,
    undo,
    redo,
    wrapSelection,
    insertText,
    prefixLines
  }
}
