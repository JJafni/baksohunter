import { execFileSync } from 'node:child_process'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const rootDir = dirname(fileURLToPath(import.meta.url))

function prepareKoiAsset() {
  execFileSync(process.execPath, [join(rootDir, 'scripts/prepare-koi-asset.mjs')], {
    stdio: 'inherit',
  })
}

// https://vite.dev/config/
export default defineConfig({
  base: process.env.VITE_BASE_PATH ?? '/',
  plugins: [
    {
      name: 'prepare-koi-asset',
      buildStart() {
        prepareKoiAsset()
      },
      configureServer() {
        prepareKoiAsset()
      },
    },
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 5173,
  },
})
