<template>
  <div class="pane preview-pane" :class="{ collapsed }">
    <div class="pane-header">
      <button class="collapse-btn" @click="$emit('togglePane')" :title="collapsed ? t('expandPreview') : t('collapsePreview')">
        <svg class="icon icon-sm"><use :href="collapsed ? '#icon-chevron-left' : '#icon-chevron-right'"></use></svg>
      </button>
      <span class="pane-title">{{ t('previewPaneTitle') }}</span>
      <div class="preview-toggle">
        <button class="toggle-btn" :class="{ active: mode === 'preview' }" @click="$emit('update:mode', 'preview')">{{ t('previewTab') }}</button>
        <button class="toggle-btn" :class="{ active: mode === 'source' }" @click="$emit('update:mode', 'source')">{{ t('sourceTab') }}</button>
      </div>
      <span id="word-count">{{ t('wordCount', wordCount) }}</span>
    </div>
    <div class="preview-content" v-show="mode === 'preview'" v-html="html"></div>
    <textarea
      v-show="mode === 'source'"
      class="preview-source"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      :placeholder="t('previewSourcePlaceholder')"
      spellcheck="false"
    ></textarea>
  </div>
</template>

<script setup>
import { useI18n } from '../composables/useI18n.js'

const props = defineProps({
  html: { type: String, default: '' },
  modelValue: { type: String, default: '' },
  mode: { type: String, default: 'preview' },
  collapsed: { type: Boolean, default: false },
  wordCount: { type: Number, default: 0 }
})

defineEmits(['togglePane', 'update:mode', 'update:modelValue'])

const { t } = useI18n()
</script>
