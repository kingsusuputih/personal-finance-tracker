import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  server: {
    port: 5174,
    proxy: {
      '/api/registry': {
        target: 'https://jwircppgmbyasmmaemho.supabase.co/functions/v1/registry',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/registry/, ''),
      },
    },
  },
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          charts: ['echarts/core', 'echarts/charts', 'echarts/components', 'echarts/renderers'],
        },
      },
    },
  },
})
