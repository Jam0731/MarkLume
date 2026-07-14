import { ref, watch } from 'vue'
import { marked } from 'marked'

// Configure marked
marked.setOptions({
  breaks: true,
  gfm: true,
  headerIds: false,
  mangle: false
})

export function usePreview(content) {
  const html = ref('')

  function renderMarkdown(text) {
    if (!text) {
      html.value = ''
      return
    }

    // Protect math from marked
    let processedText = text
    const mathPlaceholders = []

    // Store math expressions
    processedText = processedText.replace(/\$\$[\s\S]*?\$\$/g, (match) => {
      const key = `<!--MATH${mathPlaceholders.length}-->`
      mathPlaceholders.push({ key, value: match })
      return key
    })
    processedText = processedText.replace(/(^|[^\\])\$([^$\n]+?)\$/g, (match, p1, p2) => {
      const key = `<!--MATH${mathPlaceholders.length}-->`
      mathPlaceholders.push({ key, value: match })
      return p1 + key
    })

    // Parse markdown
    let rendered = ''
    if (typeof marked !== 'undefined') {
      rendered = marked.parse(processedText)
    } else {
      rendered = '<pre style="white-space:pre-wrap">' + escapeHtml(processedText) + '</pre>'
    }

    // Restore math expressions
    mathPlaceholders.forEach(({ key, value }) => {
      rendered = rendered.split(key).join(value)
    })

    html.value = rendered

    // Render KaTeX after DOM update
    setTimeout(() => renderMath(), 10)
    setTimeout(() => renderMermaid(), 20)
  }

  function renderMath() {
    if (typeof window.renderMathInElement !== 'undefined') {
      const previewEl = document.querySelector('.preview-content')
      if (previewEl) {
        window.renderMathInElement(previewEl, {
          delimiters: [
            { left: '$$', right: '$$', display: true },
            { left: '$', right: '$', display: false }
          ],
          throwOnError: false
        })
      }
    }
  }

  function renderMermaid() {
    if (typeof window.mermaid === 'undefined') return

    // Initialize mermaid if not already done
    if (!window.mermaid._initialized) {
      window.mermaid.initialize({
        startOnLoad: false,
        theme: document.body.getAttribute('data-theme') === 'dark' ? 'dark' : 'default'
      })
      window.mermaid._initialized = true
    }

    const blocks = document.querySelectorAll('.preview-content pre code.language-mermaid')
    blocks.forEach(code => {
      const pre = code.parentElement
      const source = code.textContent.trim()
      if (!source) return
      const container = document.createElement('div')
      container.className = 'mermaid'
      container.textContent = source
      pre.replaceWith(container)
    })
    try {
      window.mermaid.run({ querySelector: '.preview-content .mermaid' })
    } catch (err) {
      console.error('Mermaid render error:', err)
    }
  }

  function escapeHtml(text) {
    const div = document.createElement('div')
    div.textContent = text
    return div.innerHTML
  }

  // Watch content changes and re-render
  watch(content, (newVal) => renderMarkdown(newVal), { immediate: true })

  return { html, renderMarkdown }
}
