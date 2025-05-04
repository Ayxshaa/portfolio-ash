
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { visualizer } from 'rollup-plugin-visualizer';
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),tailwindcss(),
    visualizer({ open: true }) // Optional: visualize chunk sizes
  ],
  build: {
    chunkSizeWarningLimit: 1000, // Increase warning threshold if needed
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('three')) return 'three';
            if (id.includes('postprocessing')) return 'postprocessing';
            if (id.includes('framer-motion')) return 'framer';
            if (id.includes('gsap')) return 'gsap';
            if (id.includes('@react-three')) return 'react-three';
            return 'vendor';
          }
        }
      }
    }
  }
});
