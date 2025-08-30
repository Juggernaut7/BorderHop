import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // Provide process global for compatibility
    global: 'globalThis',
  },
  server: {
    port: 5173, // Changed from 3000 to avoid conflicts
    host: 'localhost',
    strictPort: false, // Allow fallback to other ports if 5173 is busy
    hmr: {
      port: 5174, // Separate HMR port
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
})
