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
    // 🟢 CUSTOM PLUGIN: The Guard Rail
    // This runs before anything else and prevents the build crash.
    {
      name: 'force-external-prisma-engine',
      enforce: 'pre',
      resolveId(id) {
        // If Rollup tries to bundle the database engine, STOP IT.
        // Return external: true immediately.
        if (id.includes('.prisma/client/default') || id.includes('.prisma/client/index')) {
          return { id, external: true }
        }
        return null
      }
    },
    devtools(),
    nitro({
      // Redundant safety net for the server build
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
      // 🟢 THE SHIM: Fixes the runtime crash
      // Redirects the broken import to your local file, forcing it to be bundled.
      "decimal.js-light/decimal": path.resolve(__dirname, "src/decimal-shim.ts")
    },
  },

  ssr: {
    // 🟢 Bundle the wrappers so the Alias works inside them
    noExternal: ["@prisma/client", "@prisma/adapter-pg"],
    // Keep the engine external (matches the plugin above)
    external: [".prisma/client", ".prisma/client/index", ".prisma/client/default"], 
  },
})