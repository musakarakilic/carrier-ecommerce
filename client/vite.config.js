import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

// Get environment variables
const API_URL = process.env.VITE_API_BASE_URL || 'https://carrier-ecommerce.onrender.com'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    proxy: {
      '/api': {
        target: API_URL,
        changeOrigin: true
      },
      '/uploads': {
        target: API_URL,
        changeOrigin: true
      }
    }
  }
}) 