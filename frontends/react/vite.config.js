import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/examples/react/',
  plugins: [react()],
  server: {
    proxy: {
      '/shared': 'http://127.0.0.1:8026',
    },
  },
})
