import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig(({ command }) => {
  const isBuild = command === 'build'

  return {
    plugins: [
      // 🟢 1. PRODUCTION ONLY: The "Search & Replace" Plugin
      // This fixes the 'decimal.js-light' import bug in Vercel.
      isBuild && {
        name: 'prisma-patch-plugin',
        enforce: 'pre',
        transform(code, id) {
          if (id.includes('@prisma') && code.includes('decimal.js-light/decimal')) {
            return code.replace(/["']decimal\.js-light\/decimal["']/g, '"@decimal-shim"');
          }
        },
        resolveId(id) {
          if (id.includes('.prisma/client/default') || id.includes('.prisma/client/index')) {
            return { id, external: true }
          }
          return null
        }
      },

      devtools(),
      nitro({
        // Always keep the engine external to be safe
        externals: {
          external: ['.prisma/client', '.prisma/client/index', '.prisma/client/default']
        }
      }),
      viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
      tailwindcss(),
      tanstackStart(),
      viteReact(),
    ],

    resolve: {
      alias: {
        // 🟢 2. PRODUCTION ONLY: The Shim Alias
        // Locally, we don't need this.
        ...(isBuild ? {
          "@decimal-shim": path.resolve(__dirname, "src/decimal-shim.ts")
        } : {})
      },
    },

    ssr: {
      // 🟢 3. PRODUCTION ONLY: Force Bundling
      // Locally (isBuild = false), this array is empty. 
      // This stops Vite from trying to process Prisma locally, fixing the "module is not defined" error.
      noExternal: isBuild ? ["@prisma/client", "@prisma/adapter-pg"] : [],
      
      external: isBuild ? [".prisma/client", ".prisma/client/index", ".prisma/client/default"] : [], 
    },
  }
})