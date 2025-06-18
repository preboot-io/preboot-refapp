import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {fileURLToPath} from "node:url";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@models': fileURLToPath(new URL('./src/generated/api', import.meta.url))
    }
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      '@mantine/core',
      '@mantine/hooks',
      '@mantine/form'
    ],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'mantine': ['@mantine/core', '@mantine/hooks', '@mantine/form'],
          'react-vendor': ['react', 'react-dom', 'react-router-dom']
        }
      }
    }
  }
})
