import { defineConfig } from 'vite'
import { devtools } from '@tanstack/devtools-vite'
import { tanstackStart } from '@tanstack/react-start/plugin/vite'
import viteReact from '@vitejs/plugin-react'
import viteTsConfigPaths from 'vite-tsconfig-paths'
import tailwindcss from '@tailwindcss/vite'
import { nitro } from 'nitro/vite'
import { createRequire } from 'module';

const require = createRequire(import.meta.url);

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
      // 🟢 CRITICAL FIX:
      // This forces "decimal.js-light/decimal" to point to the actual 
      // "decimal.js-light" library file on your disk.
      "decimal.js-light/decimal": require.resolve("decimal.js-light"),
    },
  },
  ssr: {
    // 🟢 CRITICAL FIX:
    // This tells Vite: "Do not leave this as a 'require' statement.
    // Bundle the code directly into my server file."
    noExternal: ["decimal.js-light"],
    external: ["@prisma/client", ".prisma/client"],
  },
})