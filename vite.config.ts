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
      // 1. Redirect the bad import to the real file
      "decimal.js-light/decimal": require.resolve("decimal.js-light")
    },
  },
  ssr: {
    // 2. CRITICAL: Bundle Prisma Client so Vite can apply the alias to it.
    // If we leave it external, Vite ignores the code inside it.
    noExternal: ["@prisma/client", "decimal.js-light"],
    
    // 3. Ensure this is empty or does NOT contain @prisma/client
    external: [], 
  },
})