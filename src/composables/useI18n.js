import { ref } from 'vue'
import i18nData from '../i18n/index.js'

const currentLang = ref(localStorage.getItem('md_editor_language') || 'zh-CN')

export function useI18n() {
  function t(key, ...args) {
    const dict = i18nData[currentLang.value] || i18nData['zh-CN']
    let str = dict?.[key]
    if (str === undefined) str = i18nData['zh-CN']?.[key] || key
    return args.reduce((s, arg, i) => s.replace(new RegExp('\\{' + i + '\\}', 'g'), String(arg)), str)
  }

  function setLanguage(lang) {
    if (!i18nData[lang]) lang = 'zh-CN'
    currentLang.value = lang
    localStorage.setItem('md_editor_language', lang)
    document.documentElement.lang = lang
  }

  return { currentLang, t, setLanguage }
}
