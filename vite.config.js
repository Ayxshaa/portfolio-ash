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
        manualChunks: (id) => {
          // Create more stable chunks
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three';
            if (id.includes('postprocessing')) return 'three'; // Bundle with three
            if (id.includes('@react-three/fiber')) return 'react-three';
            if (id.includes('@react-three/drei')) return 'react-three';
            if (id.includes('framer-motion')) return 'animation';
            if (id.includes('gsap')) return 'animation';
            if (id.includes('react') || id.includes('scheduler')) return 'react';
            return 'vendor'; // All other dependencies
          }
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
  optimizeDeps: {
    include: ['three', 'postprocessing']
  },
  resolve: {
    dedupe: ['three']
  }
});