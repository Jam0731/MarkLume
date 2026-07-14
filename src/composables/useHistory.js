import { ref } from 'vue'

const MAX_HISTORY = 50

export function useHistory() {
  const stack = ref([])
  const index = ref(-1)
  let lastRecorded = null

  function init(text) {
    stack.value = [text]
    index.value = 0
    lastRecorded = text
  }

  // Record current content to history
  function record(text) {
    if (text === lastRecorded) return
    // Remove future states
    stack.value = stack.value.slice(0, index.value + 1)
    // Add new state
    stack.value.push(text)
    // Trim old states
    if (stack.value.length > MAX_HISTORY) stack.value.shift()
    index.value = stack.value.length - 1
    lastRecorded = text
  }

  // Save a snapshot before making changes (for button actions)
  function saveSnapshot(text) {
    if (text !== lastRecorded) {
      record(text)
    }
  }

  function undo() {
    if (index.value <= 0) return null
    index.value--
    lastRecorded = stack.value[index.value]
    return stack.value[index.value]
  }

  function redo() {
    if (index.value >= stack.value.length - 1) return null
    index.value++
    lastRecorded = stack.value[index.value]
    return stack.value[index.value]
  }

  return { init, record, saveSnapshot, undo, redo }
}
