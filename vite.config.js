import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { VitePWA } from 'vite-plugin-pwa';
import autoprefixer from 'autoprefixer';

export default defineConfig({
  // Build output goes to 'dist' so it doesn't interfere with current 'public'
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'src/main.js',
        practice: 'src/practice.js'
      },
      output: {
        // Clean, predictable output structure
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    }
  },
  
  // Development server settings
  server: {
    port: 5003, // Different from Firebase port (5002)
    open: false
  },
  
  // Plugins for modern features
  plugins: [
    // Support older browsers
    legacy({
      targets: ['defaults', 'not IE 11']
    }),
    
    // PWA capabilities
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'Music Theory Practice',
        short_name: 'Music Theory',
        description: 'Practice music theory concepts',
        theme_color: '#555555',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'icons/icon-512.png', 
            sizes: '512x512',
            type: 'image/png'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        maximumFileSizeToCacheInBytes: 3000000
      }
    })
  ],
  
  // CSS processing
  css: {
    postcss: {
      plugins: [
        autoprefixer
      ]
    }
  }
}); 