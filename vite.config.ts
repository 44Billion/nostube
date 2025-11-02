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
        manualChunks: (id) => {
          // Vendor chunk for node_modules
          if (id.includes('node_modules')) {
            // Split React and ReactDOM into separate chunk (reduces main vendor bundle)
            if (id.includes('react-dom')) return 'vendor-react-dom'
            if (id.includes('react') && !id.includes('react-dom')) return 'vendor-react'
            
            // Separate large libraries
            if (id.includes('hls.js')) return 'vendor-hls'
            if (id.includes('video.js') || id.includes('media-chrome')) return 'vendor-video'
            if (id.includes('react-player')) return 'vendor-player'
            if (id.includes('cashu')) return 'vendor-cashu'
            if (id.includes('applesauce')) return 'vendor-applesauce'
            if (id.includes('nostr-tools') || id.includes('nostr-idb')) return 'vendor-nostr'
            if (id.includes('@tanstack/react-query') || id.includes('react-query')) return 'vendor-query'
            if (id.includes('date-fns')) return 'vendor-date'
            if (id.includes('@radix-ui')) return 'vendor-radix'
            if (id.includes('rxjs')) return 'vendor-rxjs'
            
            // Everything else in vendor
            return 'vendor'
          }
          
          // Group all UI components together
          if (id.includes('/components/ui/')) return 'ui-components'
          
          // Group hooks together
          if (id.includes('/hooks/')) return 'hooks'
          
          // Group all smaller page components together
          if (id.includes('/pages/') && 
              !id.includes('VideoPage') && 
              !id.includes('UploadPage')) {
            return 'pages'
          }
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
