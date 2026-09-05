import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
// https://vite.dev/config/
export default defineConfig({
  plugins: [tailwindcss(), react()],
  build: {
    chunkSizeWarningLimit: 1000,
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            {
              name: 'vendor-three',
              test: /node_modules[\\/]three/,
              priority: 50,
            },
            {
              name: 'vendor-firebase',
              test: /node_modules[\\/](?:firebase|@firebase)/,
              priority: 40,
            },
            {
              name: 'vendor-charts',
              test: /node_modules[\\/](?:recharts|d3)/,
              priority: 30,
            },
            {
              name: 'vendor-react',
              test: /node_modules[\\/](?:react|react-dom|react-router-dom|scheduler)/,
              priority: 20,
            },
          ],
        },
      },
    },
  },
});
