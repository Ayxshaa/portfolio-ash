import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    visualizer({ open: true }) // Optional: visualize chunk sizes
  ],
  build: {
    chunkSizeWarningLimit: 1000, 
    rollupOptions: {
      output: {
        manualChunks: {
          'three-core': ['three'],
          'three-extras': [
            '@react-three/fiber', 
            '@react-three/drei'
          ],
          // Bundle postprocessing with three to ensure proper initialization order
          'three-postprocessing': ['postprocessing', 'three/examples/jsm/postprocessing'],
          'animation': ['gsap', 'framer-motion'],
          'vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    },
    // Improve output stability
    minify: 'terser',
    terserOptions: {
      compress: {
        // Preserve class and function names to avoid initialization problems
        keep_classnames: true,
        keep_fnames: true
      }
    }
  },
  // Ensure proper resolution of imports
  resolve: {
    dedupe: ['three']
  }
});