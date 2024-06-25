import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    watch: {
      usePolling: true,
    },
  },
  preview: {
    port: 5173,
  },
  build: {
    port: 5173,
  },

  plugins: [react()],
});
