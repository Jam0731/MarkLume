<template>
  <div class="modal-overlay" :class="{ show: visible }" @click.self="$emit('close')">
    <div class="modal">
      <div class="modal-header">
        <h3>
          <svg class="icon icon-lg"><use href="#icon-globe"></use></svg>
          {{ t('urlTitle') }}
        </h3>
        <button @click="$emit('close')"><svg class="icon"><use href="#icon-close"></use></svg></button>
      </div>
      <div class="modal-body">
        <label for="url-input">{{ t('urlLabel') }}</label>
        <input type="url" id="url-input" v-model="url" :placeholder="t('urlPlaceholder')">

        <div style="display:flex;align-items:center;gap:8px;margin:8px 0 10px;">
          <input type="checkbox" id="use-local-proxy" v-model="useProxy" style="width:auto;margin:0;">
          <label for="use-local-proxy" style="display:inline;margin:0;font-weight:normal;cursor:pointer;">
            {{ t('useProxy') }}
          </label>
        </div>

        <input type="url" id="proxy-url" v-model="proxyUrl" v-show="useProxy" :placeholder="t('proxyPlaceholder')" style="margin-bottom:10px;">

        <button @click="fetchUrl" class="primary">{{ t('fetchBtn') }}</button>

        <div id="url-status" style="margin-top:10px;font-size:13px;color:var(--text-muted);">
          {{ status }}
        </div>

        <div v-show="showManual" style="margin-top:14px;">
          <label for="manual-html">{{ t('manualLabel') }}</label>
          <textarea id="manual-html" v-model="manualHtml" rows="6" :placeholder="t('manualPlaceholder')"></textarea>
        </div>
      </div>
      <div class="modal-footer">
        <button @click="$emit('close')">{{ t('cancel') }}</button>
        <button @click="convertAndInsert" class="primary">{{ t('convertInsert') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const props = defineProps({
  visible: { type: Boolean, default: false }
})

const emit = defineEmits(['close', 'insert'])

const { t } = useI18n()

const url = ref('')
const useProxy = ref(false)
const proxyUrl = ref('http://localhost:8765/fetch')
const status = ref('')
const showManual = ref(false)
const manualHtml = ref('')
const fetchedHtml = ref('')

async function fetchUrl() {
  if (!url.value) {
    status.value = t('urlStatusEmptyUrl')
    return
  }

  status.value = t('urlStatusFetching')
  fetchedHtml.value = ''

  if (useProxy.value) {
    try {
      const proxyUrlFull = (proxyUrl.value || 'http://localhost:8765/fetch') + '?url=' + encodeURIComponent(url.value)
      const response = await fetch(proxyUrlFull)
      const data = await response.json()
      if (data.success === false) throw new Error(data.error || 'Proxy error')
      fetchedHtml.value = data.html || data.content || ''
      if (!fetchedHtml.value) throw new Error('Empty content')
      status.value = t('urlStatusLocalSuccess')
      showManual.value = false
      return
    } catch (err) {
      status.value = t('urlStatusLocalFailed', err.message)
      showManual.value = true
      return
    }
  }

  // Public proxy fallback
  const proxies = [
    { url: 'https://api.allorigins.win/raw?url=' + encodeURIComponent(url.value), type: 'text' },
    { url: 'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(url.value), type: 'text' }
  ]

  for (const proxy of proxies) {
    try {
      const response = await fetch(proxy.url)
      if (!response.ok) throw new Error('Proxy response not ok')
      const text = await response.text()
      if (!text || text.length < 100) throw new Error('Content too short')
      fetchedHtml.value = text
      status.value = t('urlStatusPublicSuccess')
      showManual.value = false
      return
    } catch (err) {
      continue
    }
  }

  status.value = t('urlStatusPublicFailed', 'All proxies failed')
  showManual.value = true
}

function htmlToMarkdown(node) {
  if (node.nodeType === Node.TEXT_NODE) {
    return node.textContent.replace(/\s+/g, ' ')
  }
  if (node.nodeType !== Node.ELEMENT_NODE) return ''
  const tag = node.tagName.toLowerCase()
  const children = Array.from(node.childNodes).map(htmlToMarkdown).join('')

  switch (tag) {
    case 'h1': return '# ' + children.trim() + '\n\n'
    case 'h2': return '## ' + children.trim() + '\n\n'
    case 'h3': return '### ' + children.trim() + '\n\n'
    case 'h4': return '#### ' + children.trim() + '\n\n'
    case 'h5': return '##### ' + children.trim() + '\n\n'
    case 'h6': return '###### ' + children.trim() + '\n\n'
    case 'p': return children.trim() + '\n\n'
    case 'br': return '\n'
    case 'a': return '[' + children + '](' + (node.getAttribute('href') || '') + ')'
    case 'strong': case 'b': return '**' + children + '**'
    case 'em': case 'i': return '*' + children + '*'
    case 'code': return '`' + children + '`'
    case 'pre': return '\n```\n' + children.trim() + '\n```\n\n'
    case 'ul': return Array.from(node.children).map(li => '- ' + htmlToMarkdown(li).trim()).join('\n') + '\n\n'
    case 'ol': return Array.from(node.children).map((li, i) => (i+1) + '. ' + htmlToMarkdown(li).trim()).join('\n') + '\n\n'
    case 'li': return children.trim()
    case 'blockquote': return '> ' + children.trim().replace(/\n/g, '\n> ') + '\n\n'
    case 'hr': return '---\n\n'
    case 'table': return convertTable(node)
    default: return children
  }
}

function convertTable(table) {
  const rows = Array.from(table.querySelectorAll('tr'))
  if (!rows.length) return ''
  let md = '\n'
  rows.forEach((tr, i) => {
    const cells = Array.from(tr.querySelectorAll('td, th')).map(td =>
      htmlToMarkdown(td).trim().replace(/\|/g, '\\|')
    )
    if (cells.length) {
      md += '| ' + cells.join(' | ') + ' |\n'
      if (i === 0) md += '|' + cells.map(() => '---').join('|') + '|\n'
    }
  })
  return md + '\n'
}

function convertAndInsert() {
  const html = fetchedHtml.value || manualHtml.value
  if (!html) {
    status.value = t('toastNoContent')
    return
  }
  try {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const title = doc.querySelector('title')?.textContent?.trim() || ''
    const main = doc.querySelector('article') || doc.querySelector('[role="main"]') || doc.querySelector('.post-content') || doc.body
    const clone = main.cloneNode(true)
    clone.querySelectorAll('script,style,nav,aside,header,footer,form,iframe,img,svg,video,audio,canvas,.ad,.sidebar,.comments').forEach(el => el.remove())
    let bodyMd = htmlToMarkdown(clone).replace(/\n{3,}/g, '\n\n').trim()
    let markdown = title ? '# ' + title + '\n\n' + bodyMd : bodyMd
    emit('insert', markdown)
    $emit('close')
  } catch (err) {
    status.value = t('toastConvertFailed', err.message)
  }
}
</script>
