import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // ✅ relative paths for assets, fixes SPA + favicon
  build: {
    outDir: 'dist', // Vercel expects dist
    sourcemap: true, // helpful for debugging
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    open: true,
  },
})
