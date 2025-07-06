import { defineConfig } from 'vite';
import legacy from '@vitejs/plugin-legacy';
import { VitePWA } from 'vite-plugin-pwa';
import autoprefixer from 'autoprefixer';
import { visualizer } from 'rollup-plugin-visualizer';

export default defineConfig({
  // Build output goes to 'dist' so it doesn't interfere with current 'public'
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    sourcemap: true, // Enable for debugging
    rollupOptions: {
      input: {
        'index': 'src/index.html',
        'practice': 'src/practice.html'
      },
      output: {
        // Optimize chunk splitting
        manualChunks: {
          'vendor': ['autoprefixer'],
          'quiz-data': ['./src/data/quizData.js'],
          'ui-components': [
            './src/modules/ui/components/QuestionDisplay.js',
            './src/modules/ui/components/AnswerForm.js',
            './src/modules/ui/components/AppLayout.js'
          ],
          'business-logic': [
            './src/modules/business/services/QuestionGenerator.js',
            './src/modules/business/services/AnswerValidator.js',
            './src/modules/business/services/StateManager.js'
          ],
          'utilities': [
            './src/modules/business/utils/MusicUtils.js',
            './src/modules/business/constants/QuestionTypes.js'
          ]
        },
        entryFileNames: 'assets/[name].[hash].js',
        chunkFileNames: 'assets/[name].[hash].js',
        assetFileNames: 'assets/[name].[hash].[ext]'
      }
    },
    // Optimize for performance
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,  // Remove console logs in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.debug', 'console.trace'] // Remove specific console methods
      }
    }
  },
  
  // Use clean public directory to prevent legacy files from being included
  publicDir: 'public-clean',
  
  // Development server settings
  server: {
    port: 5173, // Standard Vite default port
    open: false,
    hmr: {
      overlay: true
    }
  },
  
  // Preview server settings  
  preview: {
    port: 4173,
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
      includeAssets: ['favicon.ico', 'apple-touch-icon.png'],
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
        maximumFileSizeToCacheInBytes: 3000000,
        // Force cache invalidation by updating cache name
        cacheId: 'music-theory-v3-' + Date.now(),
        // Skip waiting to immediately activate new service worker
        skipWaiting: true,
        clientsClaim: true,
        // Add the copied root files to precache manifest
        additionalManifestEntries: [
          { url: 'index.html', revision: null },
          { url: 'practice.html', revision: null }
        ],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365 // 1 year
              }
            }
          }
        ]
      }
    }),
    // Bundle analyzer for performance monitoring
    ...(process.env.ANALYZE ? [visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })] : [])
  ],
  
  // CSS processing
  css: {
    devSourcemap: true
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['autoprefixer']
  }
}); 