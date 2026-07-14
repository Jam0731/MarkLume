import { ref } from 'vue'
import { invoke } from '@tauri-apps/api/core'
import { open, save } from '@tauri-apps/plugin-dialog'

export function useWorkspace() {
  const workspacePath = ref(localStorage.getItem('workspace_path') || '')
  const files = ref([])
  const expandedDirs = ref(new Set())

  async function selectWorkspace() {
    try {
      const selected = await open({
        directory: true,
        multiple: false,
        title: 'Select Workspace Folder'
      })
      if (selected) {
        workspacePath.value = selected
        localStorage.setItem('workspace_path', selected)
        await loadFiles()
      }
    } catch (err) {
      console.error('Failed to select workspace:', err)
    }
  }

  async function loadFiles() {
    if (!workspacePath.value) {
      files.value = []
      return
    }
    try {
      const result = await invoke('list_files', {
        dirPath: workspacePath.value
      })
      files.value = result || []
    } catch (err) {
      console.error('Failed to load files:', err)
      files.value = []
    }
  }

  async function loadSubdirectory(dirPath) {
    try {
      const result = await invoke('list_files', {
        dirPath: dirPath
      })
      return result || []
    } catch (err) {
      console.error('Failed to load subdirectory:', err)
      return []
    }
  }

  function toggleDir(dirPath) {
    if (expandedDirs.value.has(dirPath)) {
      expandedDirs.value.delete(dirPath)
    } else {
      expandedDirs.value.add(dirPath)
    }
  }

  function isExpanded(dirPath) {
    return expandedDirs.value.has(dirPath)
  }

  async function openFile(filePath) {
    try {
      const result = await invoke('read_file', {
        path: filePath
      })
      return result
    } catch (err) {
      console.error('Failed to open file:', err)
      return null
    }
  }

  async function saveFile(filePath, content) {
    try {
      await invoke('write_file', {
        path: filePath,
        content: content
      })
      return true
    } catch (err) {
      console.error('Failed to save file:', err)
      return false
    }
  }

  async function saveFileAs(content, defaultName) {
    try {
      const filePath = await save({
        defaultPath: defaultName || 'document.md',
        filters: [
          { name: 'Markdown', extensions: ['md'] },
          { name: 'All Files', extensions: ['*'] }
        ]
      })
      if (filePath) {
        await invoke('write_file', {
          path: filePath,
          content: content
        })
        return filePath
      }
      return null
    } catch (err) {
      console.error('Failed to save file as:', err)
      return null
    }
  }

  async function createNewFile(dirPath, fileName) {
    const filePath = dirPath + '/' + fileName
    try {
      await invoke('create_file', {
        path: filePath,
        content: '# New File\n\n'
      })
      await loadFiles()
      return filePath
    } catch (err) {
      console.error('Failed to create file:', err)
      return null
    }
  }

  async function deleteFileOrDir(filePath) {
    try {
      await invoke('delete_file', {
        path: filePath
      })
      await loadFiles()
      return true
    } catch (err) {
      console.error('Failed to delete:', err)
      return false
    }
  }

  async function renameFile(oldPath, newPath) {
    try {
      await invoke('rename_file', {
        oldPath: oldPath,
        newPath: newPath
      })
      await loadFiles()
      return true
    } catch (err) {
      console.error('Failed to rename:', err)
      return false
    }
  }

  return {
    workspacePath,
    files,
    expandedDirs,
    selectWorkspace,
    loadFiles,
    loadSubdirectory,
    toggleDir,
    isExpanded,
    openFile,
    saveFile,
    saveFileAs,
    createNewFile,
    deleteFileOrDir,
    renameFile
  }
}
