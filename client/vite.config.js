import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist', // Ensure this matches the expected output directory
    rollupOptions: {
      input: {
        main: 'index.html', // Ensure Vite knows where to find the entry point
      },
    },
  },
});