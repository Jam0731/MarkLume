<template>
  <div class="statusbar">
    <span>{{ t('autosaveEnabled') }}</span>
    <span class="save-hint" :class="{ show: showSaved }">✓ {{ t('saved') }}</span>
    <span id="status-right">{{ t('statusShortcuts') }}</span>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const { t } = useI18n()
const showSaved = ref(false)

function flashSaved() {
  showSaved.value = true
  setTimeout(() => { showSaved.value = false }, 1500)
}

defineExpose({ flashSaved })
</script>
