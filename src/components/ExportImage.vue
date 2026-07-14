<template>
  <div class="modal-overlay" :class="{ show: visible }" @click.self="$emit('close')">
    <div class="modal" style="max-width: 640px;">
      <div class="modal-header">
        <h3>
          <svg class="icon icon-lg"><use href="#icon-image"></use></svg>
          {{ t('exportImageTitle') }}
        </h3>
        <button @click="$emit('close')"><svg class="icon"><use href="#icon-close"></use></svg></button>
      </div>
      <div class="modal-body">
        <label>{{ t('ratioLabel') }}</label>
        <div class="ratio-grid">
          <button v-for="ratio in ratios" :key="ratio.value"
            class="ratio-btn" :class="{ active: selectedRatio === ratio.value }"
            @click="selectedRatio = ratio.value">
            {{ ratio.value }}<br><small>{{ ratio.label }}</small>
          </button>
        </div>

        <div class="option-row">
          <input type="checkbox" id="image-crop-fit" v-model="cropFit">
          <label for="image-crop-fit">{{ t('cropLabel') }}</label>
        </div>

        <label>{{ t('previewLabel') }}</label>
        <div id="export-image-preview-wrap">
          <img id="export-image-preview" v-if="previewUrl" :src="previewUrl" :alt="t('exportImagePreviewAlt')">
        </div>
        <p class="hint">{{ t('exportImageHint') }}</p>
      </div>
      <div class="modal-footer">
        <button @click="$emit('close')">{{ t('cancel') }}</button>
        <button @click="renderPreview">{{ t('refreshPreview') }}</button>
        <button @click="downloadImage" class="primary">{{ t('downloadPng') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const props = defineProps({
  visible: { type: Boolean, default: false },
  html: { type: String, default: '' }
})

const emit = defineEmits(['close'])

const { t } = useI18n()

const selectedRatio = ref('9:16')
const cropFit = ref(false)
const previewUrl = ref('')

const ratios = [
  { value: '9:16', label: t('ratio9_16') },
  { value: '4:5', label: t('ratio4_5') },
  { value: '3:4', label: t('ratio3_4') },
  { value: '1:1', label: t('ratio1_1') },
  { value: '16:9', label: t('ratio16_9') }
]

const RATIO_PRESETS = {
  '9:16': { width: 1080, height: 1920 },
  '4:5': { width: 1080, height: 1350 },
  '3:4': { width: 1080, height: 1440 },
  '1:1': { width: 1080, height: 1080 },
  '16:9': { width: 1920, height: 1080 }
}

async function renderPreview() {
  if (typeof window.domtoimage === 'undefined') {
    alert(t('toastImageLibMissing'))
    return
  }

  const preset = RATIO_PRESETS[selectedRatio.value]
  const stage = document.createElement('div')
  stage.style.cssText = `position:fixed;left:-99999px;top:0;width:${preset.width}px;`

  const container = document.createElement('div')
  container.innerHTML = `<div class="preview-content markdown-body" style="width:${preset.width}px;padding:40px;font-size:${Math.round(preset.width/36)}px;line-height:1.7;background:var(--panel-bg);color:var(--text);">${props.html}</div>`
  stage.appendChild(container)
  document.body.appendChild(stage)

  try {
    const dataUrl = await window.domtoimage.toPng(container.firstChild, {
      width: preset.width,
      bgcolor: '#ffffff',
      cacheBust: true
    })
    previewUrl.value = dataUrl
  } catch (err) {
    console.error(err)
    alert(t('toastImageGenFailed', err.message))
  } finally {
    document.body.removeChild(stage)
  }
}

function downloadImage() {
  if (!previewUrl.value) {
    alert(t('toastGeneratePreviewFirst'))
    return
  }
  const a = document.createElement('a')
  a.href = previewUrl.value
  a.download = 'marklume-export.png'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}
</script>
