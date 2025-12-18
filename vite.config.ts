import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import { createRequire } from 'module'

const require = createRequire(import.meta.url)

export default defineConfig({
  plugins: [
    // 🟢 1. Custom Plugin: Force .prisma/client/default to be external
    // This runs before Vite tries to find the file on disk.
    {
      name: 'force-external-prisma',
      enforce: 'pre',
      resolveId(id) {
        // Capture the internal engine import that is breaking the build
        if (id.includes('.prisma/client/default')) {
          return { id, external: true }
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
  resolve: {
    alias: {
      // 🟢 2. Fix the runtime crash by redirecting the broken package
      "decimal.js-light/decimal": require.resolve("decimal.js-light")
    },
  },
  ssr: {
    // 🟢 3. Bundle the wrapper so we can apply the alias to it
    noExternal: ["@prisma/client", /decimal\.js-light/], 
  },
})