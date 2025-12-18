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

export default defineConfig({
  plugins: [
    {
      name: 'prisma-patch-plugin',
      enforce: 'pre',
      // 1. SEARCH & REPLACE:
      // Read the source code of Prisma files. If we see the broken import string, 
      // replace it with our safe alias "@decimal-shim".
      transform(code, id) {
        if (id.includes('@prisma') && code.includes('decimal.js-light/decimal')) {
          return code.replace(/["']decimal\.js-light\/decimal["']/g, '"@decimal-shim"');
        }
      },
      // 2. BLOCK THE ENGINE:
      // Prevent the build crash by externalizing the engine file.
      resolveId(id) {
        if (id.includes('.prisma/client/default') || id.includes('.prisma/client/index')) {
          return { id, external: true }
        }
        return null
      }
    },
    devtools(),
    nitro({
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
      // 3. DEFINE THE ALIAS:
      // When the code asks for "@decimal-shim" (which we inserted above),
      // give it the local shim file.
      "@decimal-shim": path.resolve(__dirname, "src/decimal-shim.ts")
    },
  },

  ssr: {
    // 4. BUNDLE EVERYTHING:
    // Force Vite to process Prisma and Adapter so the transform hook (step 1) can run.
    noExternal: ["@prisma/client", "@prisma/adapter-pg"],
    external: [".prisma/client", ".prisma/client/index", ".prisma/client/default"], 
  },
})