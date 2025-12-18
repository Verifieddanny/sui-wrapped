import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

export default defineConfig({
  plugins: [
    devtools(),
    nitro({
       // Keep engine external to be safe
       externals: {
        external: ['.prisma/client', '.prisma/client/index', '.prisma/client/default']
       }
    }),
    viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],
  // Ensure we bundle the fixed client
  ssr: {
    noExternal: ["@prisma/client", "@prisma/adapter-pg"],
  }
})