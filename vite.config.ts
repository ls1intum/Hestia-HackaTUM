import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import { viteEnvs } from 'vite-envs'

export default defineConfig({
  plugins: [
    react(),
    viteEnvs({
      declarationFile: '.env',
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
