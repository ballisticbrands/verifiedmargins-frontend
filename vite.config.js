import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  // Absolute base — served at the custom-domain root (app.verifiedmargins.com,
  // see public/CNAME). A relative base breaks the deep auth routes.
  base: '/',
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
    },
  },
});
