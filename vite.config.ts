import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  plugins: [
    // 1. Custom Plugin: Intercepts the bad import path
    {
      name: 'fix-decimal-light',
      enforce: 'pre',
      resolveId(id) {
        // If anything tries to import the broken sub-path...
        if (id === 'decimal.js-light/decimal') {
          // ...redirect it to the main package and force bundling
          return { id: 'decimal.js-light', external: false }
        }
        return null
      }
    },
    devtools(),
    nitro(),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  ssr: {
    // 2. Force Vite to bundle this package into the server file
    noExternal: ['decimal.js-light'],
    external: ['@prisma/client', '.prisma/client']
  },
})