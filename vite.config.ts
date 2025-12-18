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
      // 🟢 THE FIX: Redirects the broken import to the main package
      "decimal.js-light/decimal": "decimal.js-light",
    },
  },
  ssr: {
    // 🟢 SAFETY: Forces Vite to bundle this library into your server file
    // so Vercel doesn't have to look for it in node_modules at runtime.
    noExternal: ["decimal.js-light"],
    external: ["@prisma/client", ".prisma/client"],
  },
})