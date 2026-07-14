import { ref } from 'vue'

const MAX_HISTORY = 100

export function useHistory() {
  const historyStack = ref([])
  const historyIndex = ref(-1)
  let lastHistoryText = null
  let historyTimer = null

  function init(initialText) {
    historyStack.value = [initialText]
    historyIndex.value = 0
    lastHistoryText = initialText
  }

  function pushHistory(currentText) {
    clearTimeout(historyTimer)
    historyTimer = setTimeout(() => recordHistory(currentText), 400)
  }

  function recordHistory(currentText) {
    if (currentText === lastHistoryText) return
    historyStack.value = historyStack.value.slice(0, historyIndex.value + 1)
    historyStack.value.push(currentText)
    if (historyStack.value.length > MAX_HISTORY) historyStack.value.shift()
    historyIndex.value = historyStack.value.length - 1
    lastHistoryText = currentText
  }

  function undo() {
    if (historyIndex.value <= 0) return null
    historyIndex.value--
    lastHistoryText = historyStack.value[historyIndex.value]
    return historyStack.value[historyIndex.value]
  }

  function redo() {
    if (historyIndex.value >= historyStack.value.length - 1) return null
    historyIndex.value++
    lastHistoryText = historyStack.value[historyIndex.value]
    return historyStack.value[historyIndex.value]
  }

  return { init, pushHistory, recordHistory, undo, redo }
}
