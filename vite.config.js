import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/HappyChurch-energy/',  // ← 이 줄이 핵심!
})
