import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Quando o backend existir, o proxy abaixo encaminha /api para ele (evita CORS no dev).
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
