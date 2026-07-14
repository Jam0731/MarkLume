<template>
  <div class="modal-overlay" :class="{ show: visible }" @click.self="$emit('close')">
    <div class="modal" style="max-width: 560px;">
      <div class="modal-header">
        <h3>
          <svg class="icon icon-lg"><use href="#icon-mermaid"></use></svg>
          {{ t('mermaidTitle') }}
        </h3>
        <button @click="$emit('close')"><svg class="icon"><use href="#icon-close"></use></svg></button>
      </div>
      <div class="modal-body">
        <label for="mermaid-type">{{ t('mermaidTypeLabel') }}</label>
        <select id="mermaid-type" v-model="diagramType" @change="updateTemplate">
          <option value="mindmap">{{ t('mermaidTypeMindmap') }}</option>
          <option value="flowchart">{{ t('mermaidTypeFlowchart') }}</option>
        </select>
        <label for="mermaid-code">{{ t('mermaidCodeLabel') }}</label>
        <textarea id="mermaid-code" v-model="code" rows="10" :placeholder="t('mermaidCodePlaceholder')"></textarea>
        <p class="hint">{{ t('mermaidHint') }}</p>
      </div>
      <div class="modal-footer">
        <button @click="$emit('close')">{{ t('cancel') }}</button>
        <button @click="insert" class="primary">{{ t('insert') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const props = defineProps({
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'insert'])

const { t } = useI18n()

const diagramType = ref('mindmap')
const code = ref('mindmap\n  root((Topic))\n    Subtopic A\n    Subtopic B')

const templates = {
  mindmap: 'mindmap\n  root((Topic))\n    Subtopic A\n      Child A1\n      Child A2\n    Subtopic B\n      Child B1',
  flowchart: 'flowchart TD\n    A[Start] --> B{Decision}\n    B -->|Yes| C[Execute]\n    B -->|No| D[End]'
}

function updateTemplate() {
  code.value = templates[diagramType.value] || templates.mindmap
}

function insert() {
  if (!code.value.trim()) {
    alert(t('toastMermaidEmpty'))
    return
  }
  emit('insert', '\n```mermaid\n' + code.value + '\n```\n\n')
  emit('close')
}
</script>
