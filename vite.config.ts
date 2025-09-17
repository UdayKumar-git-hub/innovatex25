import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // Use root for Vercel deployment
  build: {
    outDir: 'dist', // Output directory
    sourcemap: false, // Disable source maps for production
    chunkSizeWarningLimit: 2000, // Prevent warnings for large bundles
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom', 'react-router-dom']
        },
        sourcemapExcludeSources: true
      }
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
})
