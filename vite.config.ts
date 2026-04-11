import { existsSync } from 'node:fs'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
const isDockerEnvironment = existsSync('/.dockerenv')
const apiProxyTarget =
  process.env.VITE_API_PROXY_TARGET?.trim() ||
  (isDockerEnvironment ? '' : 'http://localhost:8080')

const apiProxy = apiProxyTarget
  ? {
      '/api': {
        target: apiProxyTarget,
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, ''),
        ws: true,
      },
    }
  : undefined

export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
  },
  server: {
    proxy: apiProxy,
    port: 3000,
    open: false,
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
