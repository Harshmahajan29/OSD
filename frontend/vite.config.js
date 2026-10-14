import { defineConfig } from 'vite';

export default defineConfig({
  server: { port: 5173, open: true },
  build: {
    target: 'es2020',
    outDir: 'dist',
    // Keep images as separate cacheable files instead of inlining them into CSS/JS.
    assetsInlineLimit: 0,
  },
});
