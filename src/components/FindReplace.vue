<template>
  <div class="modal-overlay" :class="{ show: visible }" @click.self="$emit('close')">
    <div class="modal" style="max-width: 440px;">
      <div class="modal-header">
        <h3>
          <svg class="icon icon-lg"><use href="#icon-search"></use></svg>
          {{ t('findTitle') }}
        </h3>
        <button @click="$emit('close')"><svg class="icon"><use href="#icon-close"></use></svg></button>
      </div>
      <div class="modal-body">
        <label for="find-input">{{ t('findLabel') }}</label>
        <input type="text" id="find-input" v-model="findText" :placeholder="t('findPlaceholder')">
        <label for="replace-input">{{ t('replaceLabel') }}</label>
        <input type="text" id="replace-input" v-model="replaceText" :placeholder="t('replacePlaceholder')">
        <div id="find-status" style="margin-top: 8px; font-size: 13px; color: var(--text-muted);">
          {{ findStatus }}
        </div>
      </div>
      <div class="modal-footer">
        <button @click="$emit('close')">{{ t('cancel') }}</button>
        <button @click="replaceAll">{{ t('replaceAll') }}</button>
        <button @click="replaceOne">{{ t('replaceOne') }}</button>
        <button @click="findNext" class="primary">{{ t('findNext') }}</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useI18n } from '../composables/useI18n.js'

const props = defineProps({
  visible: { type: Boolean, default: false },
  content: { type: String, default: '' }
})

const emit = defineEmits(['close', 'update:content'])

const { t } = useI18n()

const findText = ref('')
const replaceText = ref('')
const findStatus = ref('')
let findIndex = 0

watch(() => props.visible, (val) => {
  if (val) {
    findStatus.value = ''
    findIndex = 0
  }
})

function findNext() {
  if (!findText.value) {
    findStatus.value = ''
    return
  }
  let pos = props.content.indexOf(findText.value, findIndex)
  if (pos === -1) {
    pos = props.content.indexOf(findText.value, 0)
  }
  if (pos === -1) {
    findStatus.value = t('statusNoMatch')
    return
  }
  findIndex = pos + findText.value.length
  findStatus.value = t('statusFoundMatch')
}

function replaceOne() {
  if (!findText.value) return
  const pos = props.content.indexOf(findText.value, findIndex)
  if (pos === -1) {
    findNext()
    return
  }
  const newContent = props.content.slice(0, pos) + replaceText.value + props.content.slice(pos + findText.value.length)
  emit('update:content', newContent)
  findIndex = pos + replaceText.value.length
  findNext()
}

function replaceAll() {
  if (!findText.value) return
  const regex = new RegExp(findText.value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')
  const newContent = props.content.replace(regex, replaceText.value)
  const count = (props.content.match(regex) || []).length
  emit('update:content', newContent)
  findStatus.value = count > 0 ? t('statusReplacedCount', count) : t('statusNoMatch')
}
</script>
