import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  preview: {
    strictPort: true,
    host: true,
    port: 2002,
    cors: true,
    allowedHosts: [
      'realtime-chat-demo.musepedia.space',
      'realtime-chat-backend.musepedia.space',
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
    ],
  },
})
