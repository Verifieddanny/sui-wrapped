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
      // 🟢 GUARD RAIL PLUGIN: Strictly prevents the build crash
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
      // We still bundle the client to ensure it runs in the app context
      noExternal: isBuild ? ["@prisma/client", "@prisma/adapter-pg"] : [],
      external: isBuild ? [".prisma/client", ".prisma/client/index", ".prisma/client/default"] : [], 
    },
  }
})