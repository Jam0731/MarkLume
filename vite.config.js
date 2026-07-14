import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig(({ mode }) => {
  const isSingleFile = mode === 'single'

  return {
    plugins: [
      vue(),
      ...(isSingleFile ? [viteSingleFile()] : [])
    ],
    build: {
      outDir: isSingleFile ? 'public' : 'dist',
      cssCodeSplit: false,
      assetsInlineLimit: 100000000
    }
  }
})
