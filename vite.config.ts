import { defineConfig } from 'vite'
import react, { reactCompilerPreset } from '@vitejs/plugin-react'
import babel from '@rolldown/plugin-babel'

// https://vite.dev/config/
export default defineConfig({
  base: '/compliance-and-regulations/',
  plugins: [
    react(),
    babel({ presets: [reactCompilerPreset()] })
  ],
})