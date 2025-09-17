import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// ✅ Fixed Vite config for Vercel deployment
export default defineConfig({
  plugins: [react()],
  base: '/', // ensure assets resolve correctly on Vercel
  build: {
    outDir: 'dist', // Vercel expects dist
    sourcemap: true, // helps debug blank screen issues
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    port: 5173,
    open: true,
  },
})