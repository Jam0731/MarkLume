<template>
  <div class="pane editor-pane" :class="{ collapsed }">
    <div class="pane-header">
      <span class="pane-title">{{ t('editorPaneTitle') }}</span>
      <span>{{ t('editorPaneHint') }}</span>
      <button class="collapse-btn" @click="$emit('togglePane')" :title="collapsed ? t('expandEditor') : t('collapseEditor')">
        <svg class="icon icon-sm"><use :href="collapsed ? '#icon-chevron-right' : '#icon-chevron-left'"></use></svg>
      </button>
    </div>
    <textarea
      ref="textarea"
      :value="modelValue"
      @input="handleInput"
      @keydown="handleKeydown"
      :placeholder="t('editorPlaceholder')"
      spellcheck="false"
    ></textarea>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const props = defineProps({
  modelValue: { type: String, default: '' },
  collapsed: { type: Boolean, default: false }
})

const emit = defineEmits(['update:modelValue', 'togglePane', 'undo', 'redo', 'format', 'insertLink'])

const { t } = useI18n()
const textarea = ref(null)

function handleInput(e) {
  emit('update:modelValue', e.target.value)
}

function handleKeydown(e) {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 's':
        e.preventDefault()
        // Save handled by parent
        break
      case 'z':
        if (!e.shiftKey) {
          e.preventDefault()
          emit('undo')
        }
        break
      case 'y':
      case 'Z':
        if (e.shiftKey || e.key === 'y') {
          e.preventDefault()
          emit('redo')
        }
        break
      case 'b':
        e.preventDefault()
        emit('format', 'bold')
        break
      case 'i':
        if (!e.shiftKey) {
          e.preventDefault()
          emit('format', 'italic')
        }
        break
      case 'u':
        e.preventDefault()
        emit('format', 'underline')
        break
      case 'k':
        e.preventDefault()
        emit('insertLink')
        break
      case 'f':
        e.preventDefault()
        // Find handled by parent
        break
    }
  }
  if (e.key === 'Tab') {
    e.preventDefault()
    const start = textarea.value.selectionStart
    const end = textarea.value.selectionEnd
    const newValue = props.modelValue.slice(0, start) + '    ' + props.modelValue.slice(end)
    emit('update:modelValue', newValue)
    setTimeout(() => {
      textarea.value.selectionStart = start + 4
      textarea.value.selectionEnd = start + 4
    }, 0)
  }
}

defineExpose({ textarea })
</script>
