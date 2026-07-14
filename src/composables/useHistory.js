import { ref } from 'vue'

const MAX_HISTORY = 100

export function useHistory() {
  const historyStack = ref([])
  const historyIndex = ref(-1)

  function init(initialText) {
    historyStack.value = [initialText]
    historyIndex.value = 0
  }

  function pushState(text) {
    // Truncate future states
    historyStack.value = historyStack.value.slice(0, historyIndex.value + 1)
    // Don't duplicate
    if (historyStack.value[historyStack.value.length - 1] === text) return
    historyStack.value.push(text)
    if (historyStack.value.length > MAX_HISTORY) historyStack.value.shift()
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

  return { init, pushState, undo, redo }
}
