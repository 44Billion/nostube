import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    host: '::',
    port: 8080,
  },
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    rollupOptions: {
      // Disable native modules for Vercel deployment
      external: ['@rollup/rollup-linux-x64-gnu'],
      output: {
        inlineDynamicImports: false,
        manualChunks: (id) => {
          // Only chunk the very largest libraries to avoid initialization issues
          if (id.includes('node_modules')) {
            // Separate only the largest video libraries
            if (id.includes('hls.js')) return 'vendor-hls'
            if (id.includes('video.js') || id.includes('media-chrome')) return 'vendor-video'
            
            // Everything else stays together in vendor to ensure proper initialization
            return 'vendor'
          }
        },
      },
    },
    chunkSizeWarningLimit: 1100, // Large vendor bundle to avoid initialization issues
  },
})
