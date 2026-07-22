import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Le proxy /api évite les soucis de CORS en développement : les appels
// relatifs (/api/...) sont redirigés vers le backend Spring Boot.
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: process.env.VITE_API_TARGET || 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
  // Tests unitaires des composants et des utilitaires du frontend.
  // jsdom fournit un DOM sans navigateur ; le setup charge les matchers
  // jest-dom et réinitialise le DOM entre chaque test.
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/test/setup.js',
    css: false,
  },
})
