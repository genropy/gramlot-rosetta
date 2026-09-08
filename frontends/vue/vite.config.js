import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/examples/vue/hello-world/',
  plugins: [vue()],
  server: {
    proxy: {
      '/shared': 'http://127.0.0.1:8026',
    },
  },
})
