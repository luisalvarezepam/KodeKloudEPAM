import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  base: '/',
  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          src: 'staticwebapp.config.json', // archivo a copiar
          dest: '.' // lo coloca en la raíz de dist/
        }
      ]
    })
  ]
});