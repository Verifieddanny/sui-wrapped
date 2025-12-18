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
      // 1. Redirect the broken import to the valid one
      "decimal.js-light/decimal": require.resolve("decimal.js-light")
    },
  },
  ssr: {
    // 2. Bundle the main Prisma Client so step #1 can apply to it
    noExternal: ["@prisma/client", "decimal.js-light"],
    
    // 3. CRITICAL FIX: Do NOT bundle the internal generated engine.
    // This fixes the "Rollup failed to resolve import .prisma/client/default" error.
    external: [".prisma/client", ".prisma/client/default"], 
  },
})