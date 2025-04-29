import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
  define: {
    'process.env': {
      API_URL: mode === 'development'
        ? '"http://localhost:3000"'
        : 'process.env.API_URL',
    }
  }
}))