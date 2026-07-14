import { ref } from 'vue'

const MAX_HISTORY = 50

export function useHistory() {
  const stack = ref([])
  const index = ref(-1)

  function init(text) {
    stack.value = [text]
    index.value = 0
  }

  function push(text) {
    // Don't push if same as current
    if (stack.value.length > 0 && stack.value[index.value] === text) return
    // Remove future states
    stack.value = stack.value.slice(0, index.value + 1)
    // Add new state
    stack.value.push(text)
    // Trim old states
    if (stack.value.length > MAX_HISTORY) stack.value.shift()
    index.value = stack.value.length - 1
  }

  function undo(currentText) {
    // If we're at the end and current text differs from last saved, save it first
    if (index.value === stack.value.length - 1 && stack.value[index.value] !== currentText) {
      push(currentText)
      index.value--
    } else if (index.value > 0) {
      index.value--
    } else {
      return null
    }
    return stack.value[index.value]
  }

  function redo() {
    if (index.value < stack.value.length - 1) {
      index.value++
      return stack.value[index.value]
    }
    return null
  }

  function debug() {
    return { stack: stack.value.slice(), index: index.value }
  }

  return { init, push, undo, redo, debug }
}
