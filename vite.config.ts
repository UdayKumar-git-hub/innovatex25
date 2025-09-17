// vite.config.js

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // The 'base' property is completely removed
  build: {
    outDir: 'dist',
  },
  //...
})