import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'

export default defineConfig(({ command }) => {
  const isBuild = command === 'build'

  return {
    plugins: [
      // Keep this ONE plugin to prevent the build-time crash
      isBuild && {
        name: 'block-prisma-engine',
        enforce: 'pre',
        resolveId(id) {
          if (id.includes('.prisma/client/default') || id.includes('.prisma/client/index')) {
            return { id, external: true }
          }
          return null
        }
      },

      devtools(),
      
      // Clean Nitro config
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

    ssr: {
      // We still want to bundle Prisma so it doesn't try to look for engines at runtime in weird places
      noExternal: isBuild ? ["@prisma/client", "@prisma/adapter-pg"] : [],
      external: isBuild ? [".prisma/client", ".prisma/client/index", ".prisma/client/default"] : [], 
    },
  }
})