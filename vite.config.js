import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    proxy: {
      '/hitokoto': {
        target: 'https://v1.hitokoto.cn',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/hitokoto/, ''),
      },
      '/jinrishici': {
        target: 'https://v2.jinrishici.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/jinrishici/, ''),
      },
    },
  },
  plugins: [vue(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
