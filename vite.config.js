import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { viteSingleFile } from 'vite-plugin-singlefile'

const isSingleFile = process.env.mode === 'single'

export default defineConfig({
  plugins: [
    vue(),
    ...(isSingleFile ? [viteSingleFile()] : [])
  ],
  build: {
    outDir: isSingleFile ? 'public' : 'dist',
    cssCodeSplit: false,
    assetsInlineLimit: 100000000
  }
})
