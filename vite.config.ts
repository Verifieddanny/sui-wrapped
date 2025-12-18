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
    nitro({
      // Prevent Nitro from crashing on the Prisma engine file
      externals: {
        external: ['.prisma/client', '.prisma/client/default', '.prisma/client/index']
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
      // Fix the path so Vite can find the file during bundling
      "decimal.js-light/decimal": require.resolve("decimal.js-light")
    },
  },
  ssr: {
    // 🟢 THE FIX: 
    // 1. Bundle @prisma/client so we can patch its imports.
    // 2. Use a REGEX for decimal.js-light to catch the "/decimal" sub-path.
    noExternal: ["@prisma/client", /decimal\.js-light/],
    
    // Keep the engine external to avoid build errors
    external: [".prisma/client", ".prisma/client/default", ".prisma/client/index"], 
  },
})