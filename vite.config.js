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
        manualChunks(id) {
          // Put all react dependencies in the same chunk
          if (id.includes('node_modules/react') || 
              id.includes('node_modules/scheduler') ||
              id.includes('node_modules/use-sync-external-store')) {
            return 'react-core';
          }
          
          // Group Three.js related packages, but keep React Three Fiber separate
          if (id.includes('node_modules/three')) {
            return 'three-core';
          }
          
          // Keep React Three Fiber together
          if (id.includes('node_modules/@react-three/fiber') || 
              id.includes('node_modules/@react-three/drei')) {
            return 'react-three';
          }
          
          // Group postprocessing separately
          if (id.includes('node_modules/postprocessing')) {
            return 'postprocessing';
          }
          
          // Animation libraries
          if (id.includes('node_modules/gsap') || 
              id.includes('node_modules/framer-motion')) {
            return 'animation';
          }
          
          // All other node modules
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    },
    // Use esbuild for minification as it's more reliable with React's JSX
    minify: 'esbuild',
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'three', 'postprocessing', '@react-three/fiber', '@react-three/drei']
  },
  resolve: {
    dedupe: ['react', 'react-dom', 'three']
  },
  // Ensure proper alias for react in case of multiple versions
  alias: {
    'react': './node_modules/react',
    'react-dom': './node_modules/react-dom'
  }
});