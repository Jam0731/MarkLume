import { ref } from 'vue'

const theme = ref(localStorage.getItem('md_editor_theme') || 'light')

export function useTheme() {
  function toggleTheme() {
    theme.value = theme.value === 'dark' ? 'light' : 'dark'
    document.body.setAttribute('data-theme', theme.value)
    localStorage.setItem('md_editor_theme', theme.value)
  }

  function initTheme() {
    document.body.setAttribute('data-theme', theme.value)
  }

  return { theme, toggleTheme, initTheme }
}
