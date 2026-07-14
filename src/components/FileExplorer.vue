<template>
  <div class="file-explorer">
    <div class="explorer-header">
      <span class="explorer-title">EXPLORER</span>
      <div class="explorer-actions">
        <button @click="$emit('newFile')" title="New File" class="icon-btn">
          <svg class="icon icon-sm"><use href="#icon-file-new"></use></svg>
        </button>
        <button @click="$emit('newFolder')" title="New Folder" class="icon-btn">
          <svg class="icon icon-sm"><use href="#icon-folder-new"></use></svg>
        </button>
        <button @click="$emit('refresh')" title="Refresh" class="icon-btn">
          <svg class="icon icon-sm"><use href="#icon-refresh"></use></svg>
        </button>
      </div>
    </div>

    <div class="workspace-section">
      <div class="workspace-header" @click="$emit('selectWorkspace')">
        <svg class="icon icon-sm"><use href="#icon-folder"></use></svg>
        <span class="workspace-name">{{ workspaceName || 'Open Workspace' }}</span>
      </div>
    </div>

    <div class="file-tree" v-if="files.length > 0">
      <FileTreeItem
        v-for="file in files"
        :key="file.path"
        :file="file"
        :depth="0"
        :active-file="activeFile"
        @open="$emit('open', $event)"
        @delete="$emit('delete', $event)"
        @rename="$emit('rename', $event)"
      />
    </div>

    <div class="empty-state" v-else-if="workspacePath">
      <p>No markdown files found</p>
      <button @click="$emit('newFile')" class="primary">Create New File</button>
    </div>

    <div class="empty-state" v-else>
      <p>Open a workspace to get started</p>
      <button @click="$emit('selectWorkspace')" class="primary">Open Workspace</button>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import FileTreeItem from './FileTreeItem.vue'

const props = defineProps({
  workspacePath: { type: String, default: '' },
  files: { type: Array, default: () => [] },
  activeFile: { type: String, default: '' }
})

defineEmits(['selectWorkspace', 'newFile', 'newFolder', 'refresh', 'open', 'delete', 'rename'])

const workspaceName = computed(() => {
  if (!props.workspacePath) return ''
  const parts = props.workspacePath.replace(/\\/g, '/').split('/')
  return parts[parts.length - 1] || parts[parts.length - 2] || ''
})
</script>

<style scoped>
.file-explorer {
  width: 260px;
  background: var(--panel-bg);
  border-right: 1px solid var(--border);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  user-select: none;
}

.explorer-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 12px;
  border-bottom: 1px solid var(--border);
}

.explorer-title {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-muted);
}

.explorer-actions {
  display: flex;
  gap: 4px;
}

.icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border: none;
  border-radius: 4px;
  background: transparent;
  color: var(--text-muted);
  cursor: pointer;
  transition: all .15s ease;
}

.icon-btn:hover {
  background: var(--surface);
  color: var(--accent);
}

.workspace-section {
  border-bottom: 1px solid var(--border);
}

.workspace-header {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 13px;
  transition: background .15s ease;
}

.workspace-header:hover {
  background: var(--surface);
}

.workspace-name {
  font-weight: 500;
}

.file-tree {
  flex: 1;
  overflow-y: auto;
  padding: 4px 0;
}

.empty-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 20px;
  color: var(--text-muted);
  font-size: 13px;
}

.empty-state button {
  padding: 6px 16px;
}
</style>
