import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: './', // relative paths fix assets and SPA routing
  build: {
    outDir: 'dist',   // Vercel expects this
    sourcemap: true,  // useful for debugging
  },
  optimizeDeps: {
    exclude: ['lucide-react'], // optional
  },
});
