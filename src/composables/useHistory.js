import { ref } from 'vue'

const MAX_HISTORY = 100

export function useHistory() {
  const historyStack = ref([])
  const historyIndex = ref(-1)

  function init(initialText) {
    historyStack.value = [initialText]
    historyIndex.value = 0
  }

  // Push a state - always adds, truncates future states
  function pushState(text) {
    // Truncate future states if we went back and made a new change
    if (historyIndex.value < historyStack.value.length - 1) {
      historyStack.value = historyStack.value.slice(0, historyIndex.value + 1)
    }
    // Add new state
    historyStack.value.push(text)
    // Trim if too long
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

  // Debug helper
  function getState() {
    return {
      stack: historyStack.value,
      index: historyIndex.value
    }
  }

  return { init, pushState, undo, redo, getState }
}
