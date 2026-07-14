<template>
  <div class="editor-toolbar">
    <div class="format-group">
      <button @click="$emit('undo')" :title="t('undoTitle')">
        <svg class="icon"><use href="#icon-undo"></use></svg>
      </button>
      <button @click="$emit('redo')" :title="t('redoTitle')">
        <svg class="icon"><use href="#icon-redo"></use></svg>
      </button>
      <span class="divider"></span>
      <button @click="$emit('format', 'bold')" :title="t('boldTitle')"><b>B</b></button>
      <button @click="$emit('format', 'italic')" :title="t('italicTitle')"><i>I</i></button>
      <button @click="$emit('format', 'underline')" :title="t('underlineTitle')"><u>U</u></button>
      <button @click="$emit('format', 'strikethrough')" :title="t('strikethroughTitle')"><s>S</s></button>
      <button @click="$emit('format', 'subscript')" :title="t('subscriptTitle')">x₂</button>
      <button @click="$emit('format', 'superscript')" :title="t('superscriptTitle')">x²</button>
      <span class="divider"></span>

      <div class="dropdown" ref="headingDropdown">
        <button @click="toggleHeadingMenu" :title="t('heading')">
          H <svg class="icon icon-sm"><use href="#icon-chevron-down"></use></svg>
        </button>
        <div class="dropdown-menu" :class="{ show: headingMenuOpen }">
          <div class="dropdown-item" v-for="i in 6" :key="i" @click="handleHeading(i)">
            H{{ i }} {{ t('heading' + 'H' + i).replace('H' + i + ' ', '') }}
          </div>
        </div>
      </div>

      <span class="divider"></span>
      <button @click="$emit('format', 'quote')" :title="t('quote')">
        <svg class="icon"><use href="#icon-quote"></use></svg>
        <span>{{ t('quote') }}</span>
      </button>
      <button @click="$emit('prefixLines', '- ')" :title="t('unordered')">
        <svg class="icon"><use href="#icon-list"></use></svg>
        <span>{{ t('unordered') }}</span>
      </button>
      <button @click="$emit('prefixLines', '1. ')" :title="t('ordered')">
        <svg class="icon"><use href="#icon-list-numbered"></use></svg>
        <span>{{ t('ordered') }}</span>
      </button>
      <button @click="$emit('prefixLines', '- [ ] ')" :title="t('task')">
        <svg class="icon"><use href="#icon-task"></use></svg>
        <span>{{ t('task') }}</span>
      </button>
      <span class="divider"></span>
      <button @click="$emit('format', 'inlineCode')" :title="t('inlineCode')">
        <svg class="icon"><use href="#icon-code"></use></svg>
        <span>{{ t('inlineCode') }}</span>
      </button>
      <button @click="$emit('format', 'codeBlock')" :title="t('codeBlock')">
        <svg class="icon"><use href="#icon-braces"></use></svg>
      </button>
      <button @click="$emit('insertLink')" :title="t('link')">
        <svg class="icon"><use href="#icon-link"></use></svg>
        <span>{{ t('link') }}</span>
      </button>
      <button @click="$emit('openImage')" :title="t('image')">
        <svg class="icon"><use href="#icon-image"></use></svg>
        <span>{{ t('image') }}</span>
      </button>

      <div class="dropdown" ref="tableDropdown">
        <button @click="toggleTableMenu" :title="t('table')">
          <svg class="icon"><use href="#icon-table"></use></svg>
          <span>{{ t('table') }}</span>
        </button>
        <div class="dropdown-menu table-selector-menu" :class="{ show: tableMenuOpen }">
          <div class="table-grid" @mouseover="handleTableHover" @click="handleTableClick" @mouseleave="resetTableHighlight">
            <div class="table-grid-cell" v-for="i in 64" :key="i" :data-row="Math.floor((i-1)/8)+1" :data-col="(i-1)%8+1"></div>
          </div>
          <div class="table-size-label">{{ tableRows }} × {{ tableCols }}</div>
        </div>
      </div>

      <button @click="$emit('openFind')" :title="t('find')">
        <svg class="icon"><use href="#icon-search"></use></svg>
        <span>{{ t('find') }}</span>
      </button>
      <button @click="$emit('openMermaid')" :title="t('mermaid')">
        <svg class="icon"><use href="#icon-mermaid"></use></svg>
        <span>{{ t('mermaid') }}</span>
      </button>
    </div>

    <div class="editor-actions">
      <button @click="$emit('toggleTheme')" :title="t('theme')">
        <svg class="icon"><use href="#icon-sun"></use></svg>
        <span>{{ t('theme') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const { t } = useI18n()

const emit = defineEmits([
  'undo', 'redo', 'format', 'prefixLines', 'insertLink',
  'openImage', 'openFind', 'openMermaid', 'insertTable', 'toggleTheme'
])

const headingMenuOpen = ref(false)
const tableMenuOpen = ref(false)
const tableRows = ref(0)
const tableCols = ref(0)

function toggleHeadingMenu() {
  headingMenuOpen.value = !headingMenuOpen.value
  tableMenuOpen.value = false
}

function toggleTableMenu() {
  tableMenuOpen.value = !tableMenuOpen.value
  headingMenuOpen.value = false
}

function handleHeading(level) {
  headingMenuOpen.value = false
  emit('format', 'heading', level)
}

function handleTableHover(e) {
  if (!e.target.classList.contains('table-grid-cell')) return
  tableRows.value = parseInt(e.target.dataset.row)
  tableCols.value = parseInt(e.target.dataset.col)
  document.querySelectorAll('.table-grid-cell').forEach(cell => {
    const r = parseInt(cell.dataset.row)
    const c = parseInt(cell.dataset.col)
    cell.classList.toggle('active', r <= tableRows.value && c <= tableCols.value)
  })
}

function handleTableClick(e) {
  if (!e.target.classList.contains('table-grid-cell')) return
  const rows = parseInt(e.target.dataset.row)
  const cols = parseInt(e.target.dataset.col)
  tableMenuOpen.value = false
  emit('insertTable', rows, cols)
}

function resetTableHighlight() {
  tableRows.value = 0
  tableCols.value = 0
  document.querySelectorAll('.table-grid-cell').forEach(cell => {
    cell.classList.remove('active')
  })
}
</script>
