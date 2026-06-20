import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/AI-FRONTEND-PLAYGROUND/',
  server: {
    // autoPort in launch.json injects PORT env variable — Vite needs it via server.port
    port: process.env.PORT ? parseInt(process.env.PORT) : 5173,
    strictPort: true,
  },
})
