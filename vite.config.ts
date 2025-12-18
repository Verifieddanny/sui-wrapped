import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import path from 'path'
import { fileURLToPath } from 'url'

// Necessary to get __dirname in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  plugins: [
    devtools(),
    nitro({
      // Keep the engine external to prevent build crashes
      externals: {
        external: ['.prisma/client', '.prisma/client/index', '.prisma/client/default']
      }
    }),
    viteTsConfigPaths({
      projects: ['./tsconfig.json'],
    }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],

  resolve: {
    alias: {
      // 🟢 THE TRICK: Point to a LOCAL file. 
      // Vite sees this as "user code" and is forced to bundle it.
      "decimal.js-light/decimal": path.resolve(__dirname, "src/decimal-shim.ts")
    },
  },

  ssr: {
    // Bundle the packages that use this library
    noExternal: ["@prisma/client", "@prisma/adapter-pg"],
    // Keep the engine external
    external: [".prisma/client", ".prisma/client/index", ".prisma/client/default"], 
  },
})