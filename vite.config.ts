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
      // 1. Tell Nitro (server build) to keep the engine external
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
      // 2. The original fix for the decimal package
      "decimal.js-light/decimal": require.resolve("decimal.js-light")
    },
  },
  // 3. Global Rollup config to catch any leaking imports
  build: {
    rollupOptions: {
      external: ['.prisma/client/default', '.prisma/client']
    }
  },
  ssr: {
    // 4. Bundle the wrapper, but externalize the engine
    noExternal: ["@prisma/client", "decimal.js-light"],
    external: [".prisma/client", ".prisma/client/default"], 
  },
})