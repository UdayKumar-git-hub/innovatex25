import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/', // ✅ must be root for Vercel
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
})
