import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/rss': {
        target: 'https://news.google.com',
        changeOrigin: true,
      }
    }
  }
})
