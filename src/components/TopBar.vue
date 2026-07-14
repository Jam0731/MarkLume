<template>
  <div class="top-bar">
    <span class="brand">{{ t('brand') }}</span>
    <input type="text" v-model="filename" :title="t('filenameTitle')">
    <div class="spacer"></div>
    <div class="top-actions">
      <button @click="$emit('save')" class="primary" :title="t('save')">
        <svg class="icon"><use href="#icon-save"></use></svg>
        <span>{{ t('save') }}</span>
      </button>

      <label :title="t('importBtn')">
        <svg class="icon"><use href="#icon-upload"></use></svg>
        <span>{{ t('importBtn') }}</span>
        <input type="file" accept=".md,.markdown,.txt" @change="handleImport">
      </label>

      <div class="dropdown" ref="exportDropdown">
        <button @click="toggleExportMenu" :title="t('exportBtn')">
          <svg class="icon"><use href="#icon-download"></use></svg>
          <span>{{ t('exportBtn') }}</span>
        </button>
        <div class="dropdown-menu" :class="{ show: exportMenuOpen }">
          <div class="dropdown-item" @click="handleExport('md')">{{ t('exportMd') }}</div>
          <div class="dropdown-item" @click="handleExport('word')">{{ t('exportWord') }}</div>
          <div class="dropdown-item" @click="handleExport('pdf')">{{ t('exportPdf') }}</div>
          <div class="dropdown-item" @click="handleExport('html')">{{ t('exportHtml') }}</div>
          <div class="dropdown-item" @click="$emit('openExportImage')">{{ t('exportImage') }}</div>
        </div>
      </div>

      <button @click="$emit('openWebToMd')" :title="t('webToMd')">
        <svg class="icon"><use href="#icon-globe"></use></svg>
        <span>{{ t('webToMd') }}</span>
      </button>

      <div class="dropdown" ref="langDropdown">
        <button @click="toggleLangMenu" :title="t('langLabel')">
          <svg class="icon"><use href="#icon-globe"></use></svg>
          <span>{{ t('langLabel') }}</span>
        </button>
        <div class="dropdown-menu" :class="{ show: langMenuOpen }">
          <div class="dropdown-item" v-for="(label, code) in languages" :key="code" @click="handleLang(code)">{{ label }}</div>
        </div>
      </div>

      <button @click="$emit('toggleTheme')" :title="t('theme')">
        <svg class="icon"><use href="#icon-sun"></use></svg>
        <span>{{ t('theme') }}</span>
      </button>

      <button @click="$emit('openHelp')" :title="t('help')">
        <svg class="icon"><use href="#icon-help"></use></svg>
        <span>{{ t('help') }}</span>
      </button>

      <button @click="$emit('clear')" :title="t('clear')">
        <svg class="icon"><use href="#icon-trash"></use></svg>
        <span>{{ t('clear') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const props = defineProps({
  modelValue: { type: String, default: 'Untitled.md' }
})

const emit = defineEmits(['update:modelValue', 'save', 'import', 'toggleTheme', 'openHelp', 'clear', 'openExportImage', 'export', 'openWebToMd'])

const { t, setLanguage, currentLang } = useI18n()

const filename = ref(props.modelValue)
const exportMenuOpen = ref(false)
const langMenuOpen = ref(false)

const languages = {
  'zh-CN': '简体中文',
  'zh-TW': '繁體中文',
  'en': 'English',
  'ja': '日本語',
  'ko': '한국어',
  'es': 'Español',
  'fr': 'Français',
  'de': 'Deutsch',
  'ru': 'Русский',
  'pt': 'Português'
}

function handleImport(e) {
  const file = e.target.files[0]
  if (file) emit('import', file)
  e.target.value = ''
}

function handleExport(type) {
  exportMenuOpen.value = false
  emit('export', type)
}

function handleLang(code) {
  langMenuOpen.value = false
  setLanguage(code)
}

function toggleExportMenu() {
  exportMenuOpen.value = !exportMenuOpen.value
  langMenuOpen.value = false
}

function toggleLangMenu() {
  langMenuOpen.value = !langMenuOpen.value
  exportMenuOpen.value = false
}

// Close menus on outside click
if (typeof document !== 'undefined') {
  document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown')) {
      exportMenuOpen.value = false
      langMenuOpen.value = false
    }
  })
}
</script>
