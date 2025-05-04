import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({ open: true })
  ],
  build: {
    chunkSizeWarningLimit: 1000,
    // Use a simpler chunk strategy that guarantees React is available before @react-three/fiber
    rollupOptions: {
      output: {
        // Use a modified chunk strategy for better dependency ordering
        manualChunks: {
          // All React-related code in one chunk that loads first
          'react-vendor': [
            'react',
            'react-dom',
            'react-router-dom',
            'scheduler',
            'use-sync-external-store'
          ],
          // Three.js in a separate chunk
          'three-vendor': ['three'],
          // Everything else in vendor
          'vendor': [
            '@react-three/fiber',
            '@react-three/drei',
            'postprocessing',
            'gsap',
            'framer-motion'
          ]
        },
        // Ensure chunks are loaded in correct order
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: (chunkInfo) => {
          // Give React chunk lower alphabetical name to ensure it loads first
          const name = chunkInfo.name;
          if (name === 'react-vendor') {
            return 'assets/a-react-[hash].js';
          }
          return 'assets/[name]-[hash].js';
        }
      }
    },
    // Use terser for better control over minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // Keep console for debugging
        keep_classnames: true,
        keep_fnames: true
      }
    }
  },
  // Force all React dependencies to be pre-bundled
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react/jsx-runtime', 
      'scheduler',
      'three',
      '@react-three/fiber',
      '@react-three/drei'
    ],
    force: true
  },
  // Ensure only one copy of React and Three.js
  resolve: {
    dedupe: ['react', 'react-dom', 'three']
  }
});