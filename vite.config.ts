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
const shimPath = path.resolve(__dirname, "src/decimal-shim.ts")

export default defineConfig({
  plugins: [
    // 1. NITRO CONFIG (The Server Bundler)
    nitro({
      alias: {
        // 🟢 CRITICAL MISSING PIECE: Tell Nitro about the shim too!
        "decimal.js-light/decimal": shimPath
      },
      externals: {
        // Keep the engine external to prevent build crashes
        external: ['.prisma/client', '.prisma/client/index', '.prisma/client/default']
      }
    }),
    
    // 2. BUILD SAFETY PLUGIN (Prevent Rollup Crash)
    {
      name: 'force-external-prisma-engine',
      enforce: 'pre',
      resolveId(id) {
        if (id.includes('.prisma/client/default') || id.includes('.prisma/client/index')) {
          return { id, external: true }
        }
        return null
      }
    },
    
    devtools(),
    viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],

  // 3. VITE CONFIG (The App Bundler)
  resolve: {
    alias: {
      "decimal.js-light/decimal": shimPath
    },
  },

  ssr: {
    // Open up the wrappers so we can rewrite imports inside them
    noExternal: ["@prisma/client", "@prisma/adapter-pg"],
    external: [".prisma/client", ".prisma/client/index", ".prisma/client/default"], 
  },
})