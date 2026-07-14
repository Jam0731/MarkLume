import { ref } from 'vue'

const MAX_HISTORY = 100

export function useHistory() {
  const historyStack = ref([])
  const historyIndex = ref(-1)

  function init(initialText) {
    historyStack.value = [initialText]
    historyIndex.value = 0
  }

  // Record a new state (called BEFORE making changes)
  function recordState(text) {
    // If we're not at the end of history, truncate future states
    if (historyIndex.value < historyStack.value.length - 1) {
      historyStack.value = historyStack.value.slice(0, historyIndex.value + 1)
    }
    // Don't record if same as last state
    if (historyStack.value.length > 0 && text === historyStack.value[historyStack.value.length - 1]) {
      return
    }
    historyStack.value.push(text)
    if (historyStack.value.length > MAX_HISTORY) {
      historyStack.value.shift()
    }
    historyIndex.value = historyStack.value.length - 1
  }

  function undo() {
    if (historyIndex.value <= 0) return null
    historyIndex.value--
    return historyStack.value[historyIndex.value]
  }

  function redo() {
    if (historyIndex.value >= historyStack.value.length - 1) return null
    historyIndex.value++
    return historyStack.value[historyIndex.value]
  }

  function canUndo() {
    return historyIndex.value > 0
  }

  function canRedo() {
    return historyIndex.value < historyStack.value.length - 1
  }

  return { init, recordState, undo, redo, canUndo, canRedo }
}
