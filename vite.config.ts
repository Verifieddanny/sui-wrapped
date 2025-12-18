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
      // 🟢 TELL NITRO: Do not bundle these. Leave them as require() calls.
      externals: {
        external: [
          '@prisma/client', 
          '@prisma/adapter-pg', 
          'decimal.js-light'
        ]
      }
    }),
    
    viteTsConfigPaths({ projects: ['./tsconfig.json'] }),
    tailwindcss(),
    tanstackStart(),
    viteReact(),
  ],

  ssr: {
    // 🟢 TELL VITE: Do not bundle these. 
    // This prevents the build crash AND the runtime crash.
    external: [
      '@prisma/client', 
      '@prisma/adapter-pg',
      'decimal.js-light'
    ],
    // Ensure noExternal is empty or strictly excludes Prisma
    noExternal: [] 
  },
})