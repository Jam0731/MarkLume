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

const emit = defineEmits([
  'update:modelValue', 'togglePane', 'undo', 'redo', 'format',
  'insertLink', 'save', 'find', 'content-change'
])

const { t } = useI18n()
const textarea = ref(null)

function handleKeydown(e) {
  if (e.ctrlKey || e.metaKey) {
    switch (e.key) {
      case 's':
        e.preventDefault()
        emit('save')
        return
      case 'z':
        if (!e.shiftKey) {
          e.preventDefault()
          emit('undo', textarea.value)
          return
        }
        break
      case 'y':
      case 'Z':
        if (e.shiftKey || e.key === 'y') {
          e.preventDefault()
          emit('redo', textarea.value)
          return
        }
        break
      case 'b':
        e.preventDefault()
        emit('format', 'bold')
        return
      case 'i':
        if (!e.shiftKey) {
          e.preventDefault()
          emit('format', 'italic')
          return
        }
        break
      case 'u':
        e.preventDefault()
        emit('format', 'underline')
        return
      case 'k':
        e.preventDefault()
        emit('insertLink')
        return
      case 'f':
        e.preventDefault()
        emit('find')
        return
    }
  }

  if (e.key === 'Tab') {
    e.preventDefault()
    emit('format', 'tab')
  }
}

function handleInput(e) {
  emit('update:modelValue', e.target.value)
  emit('content-change')
}

defineExpose({ textarea })
</script>
