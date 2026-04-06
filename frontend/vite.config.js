import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // Only process .jsx and .tsx files as JSX, not .js files
      include: /\.(jsx|tsx)$/,
    })
  ],
  server: {
    port: 3000,
    open: true
  }
})
