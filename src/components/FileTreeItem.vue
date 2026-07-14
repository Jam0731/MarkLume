<template>
  <div class="file-tree-item">
    <div
      class="item-row"
      :class="{ active: isActive, 'is-dir': file.is_dir }"
      :style="{ paddingLeft: (depth * 12 + 8) + 'px' }"
      @click="handleClick"
      @contextmenu.prevent="showContextMenu"
    >
      <span class="item-icon" v-if="file.is_dir">
        <svg class="icon icon-sm" :class="{ expanded: isExpanded }">
          <use href="#icon-chevron-right"></use>
        </svg>
      </span>
      <span class="item-icon" v-else>
        <svg class="icon icon-sm"><use href="#icon-file"></use></svg>
      </span>
      <span class="item-name">{{ file.name }}</span>
    </div>

    <div v-if="file.is_dir && isExpanded && subFiles.length > 0" class="sub-items">
      <FileTreeItem
        v-for="subFile in subFiles"
        :key="subFile.path"
        :file="subFile"
        :depth="depth + 1"
        :active-file="activeFile"
        @open="$emit('open', $event)"
        @delete="$emit('delete', $event)"
        @rename="$emit('rename', $event)"
      />
    </div>

    <!-- Context Menu -->
    <div v-if="showMenu" class="context-menu" :style="menuPosition" @click.stop>
      <div class="menu-item" @click="handleOpen" v-if="!file.is_dir">Open</div>
      <div class="menu-item" @click="handleRename">Rename</div>
      <div class="menu-item danger" @click="handleDelete">Delete</div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useWorkspace } from '../composables/useWorkspace.js'

const props = defineProps({
  file: { type: Object, required: true },
  depth: { type: Number, default: 0 },
  activeFile: { type: String, default: '' }
})

const emit = defineEmits(['open', 'delete', 'rename'])

const { loadSubdirectory } = useWorkspace()

const isExpanded = ref(false)
const subFiles = ref([])
const showMenu = ref(false)
const menuPosition = ref({ top: '0px', left: '0px' })

const isActive = computed(() => props.file.path === props.activeFile)

async function handleClick() {
  if (props.file.is_dir) {
    isExpanded.value = !isExpanded.value
    if (isExpanded.value && subFiles.value.length === 0) {
      subFiles.value = await loadSubdirectory(props.file.path)
    }
  } else {
    emit('open', props.file)
  }
}

function showContextMenu(e) {
  showMenu.value = true
  menuPosition.value = {
    top: e.clientY + 'px',
    left: e.clientX + 'px'
  }
  // Close menu on click outside
  const closeMenu = () => {
    showMenu.value = false
    document.removeEventListener('click', closeMenu)
  }
  setTimeout(() => document.addEventListener('click', closeMenu), 0)
}

function handleOpen() {
  showMenu.value = false
  if (!props.file.is_dir) {
    emit('open', props.file)
  }
}

function handleRename() {
  showMenu.value = false
  const newName = prompt('Enter new name:', props.file.name)
  if (newName && newName !== props.file.name) {
    const dir = props.file.path.substring(0, props.file.path.lastIndexOf('/'))
    const newPath = dir + '/' + newName
    emit('rename', { oldPath: props.file.path, newPath })
  }
}

function handleDelete() {
  showMenu.value = false
  if (confirm(`Delete "${props.file.name}"?`)) {
    emit('delete', props.file.path)
  }
}
</script>

<style scoped>
.item-row {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 4px 8px;
  cursor: pointer;
  font-size: 13px;
  color: var(--text-secondary);
  transition: background .1s ease;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.item-row:hover {
  background: var(--surface);
}

.item-row.active {
  background: var(--accent-soft);
  color: var(--accent);
}

.item-icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  flex-shrink: 0;
}

.item-icon svg {
  transition: transform .15s ease;
}

.item-icon svg.expanded {
  transform: rotate(90deg);
}

.item-name {
  overflow: hidden;
  text-overflow: ellipsis;
}

.sub-items {
  /* Nested items are rendered recursively */
}

.context-menu {
  position: fixed;
  background: var(--panel-bg);
  border: 1px solid var(--border);
  border-radius: 6px;
  box-shadow: var(--shadow-md);
  padding: 4px;
  z-index: 1000;
  min-width: 120px;
}

.menu-item {
  padding: 6px 12px;
  font-size: 13px;
  cursor: pointer;
  border-radius: 4px;
  color: var(--text-secondary);
}

.menu-item:hover {
  background: var(--accent-soft);
  color: var(--accent);
}

.menu-item.danger:hover {
  background: rgba(239, 68, 68, 0.1);
  color: var(--danger);
}
</style>
