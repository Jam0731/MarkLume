<template>
  <div class="modal-overlay" :class="{ show: visible }" @click.self="$emit('close')">
    <div class="modal" style="max-width: 520px;">
      <div class="modal-header">
        <h3>
          <svg class="icon icon-lg"><use href="#icon-image"></use></svg>
          {{ t('imageTitle') }}
        </h3>
        <button @click="$emit('close')"><svg class="icon"><use href="#icon-close"></use></svg></button>
      </div>
      <div class="modal-body">
        <div class="image-modal-tabs">
          <button type="button" class="image-tab" :class="{ active: activeTab === 'url' }" @click="activeTab = 'url'">{{ t('imageTabUrl') }}</button>
          <button type="button" class="image-tab" :class="{ active: activeTab === 'upload' }" @click="activeTab = 'upload'">{{ t('imageTabUpload') }}</button>
        </div>

        <div class="image-tab-panel" :class="{ active: activeTab === 'url' }">
          <label for="image-url-input">{{ t('imageUrlLabel') }}</label>
          <input type="url" id="image-url-input" v-model="imageUrl" :placeholder="t('imageUrlPlaceholder')">
          <label for="image-url-alt">{{ t('imageAltLabel') }}</label>
          <input type="text" id="image-url-alt" v-model="imageAlt" :placeholder="t('imageAltPlaceholder')">
        </div>

        <div class="image-tab-panel" :class="{ active: activeTab === 'upload' }">
          <div class="upload-area" @click="$refs.fileInput.click()">
            <p>{{ t('uploadArea') }}</p>
            <input type="file" ref="fileInput" accept="image/*" @change="handleFileSelect" style="display:none;">
          </div>
          <div v-if="previewUrl" class="upload-preview">
            <img :src="previewUrl" alt="Preview">
          </div>
          <label for="image-upload-alt">{{ t('imageAltLabel') }}</label>
          <input type="text" id="image-upload-alt" v-model="uploadAlt" :placeholder="t('imageAltPlaceholder')">
        </div>

        <p class="hint">{{ t('imageHint') }}</p>
      </div>
      <div class="modal-footer">
        <button @click="$emit('close')">{{ t('cancel') }}</button>
        <button @click="insert" class="primary">{{ t('insert') }}</button>
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

const activeTab = ref('url')
const imageUrl = ref('')
const imageAlt = ref('')
const uploadAlt = ref('')
const previewUrl = ref('')

function handleFileSelect(e) {
  const file = e.target.files[0]
  if (!file) return
  if (!file.type.startsWith('image/')) {
    alert(t('toastSelectImageFile'))
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    alert(t('toastImageTooLarge'))
    return
  }
  const reader = new FileReader()
  reader.onload = (ev) => {
    previewUrl.value = ev.target.result
  }
  reader.readAsDataURL(file)
}

function insert() {
  let url = ''
  let alt = ''

  if (activeTab.value === 'url') {
    url = imageUrl.value.trim()
    alt = imageAlt.value.trim()
    if (!url) {
      alert(t('toastEnterImageUrl'))
      return
    }
  } else {
    url = previewUrl.value
    alt = uploadAlt.value.trim()
    if (!url) {
      alert(t('toastSelectImageFirst'))
      return
    }
  }

  const markdown = `![${alt || t('image')}](${url})`
  emit('insert', markdown)
  emit('close')
}
</script>
