import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// BACKEND_PORT (o PORT) permite levantar la API en otro puerto sin tocar este archivo.
const backendPort = process.env.BACKEND_PORT ?? process.env.PORT ?? '4000';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, './src'),
    },
  },
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: `http://localhost:${backendPort}`,
        changeOrigin: true,
      },
    },
  },
});
