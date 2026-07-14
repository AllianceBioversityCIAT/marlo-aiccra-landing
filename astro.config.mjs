// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import node from '@astrojs/node';
import partytown from '@astrojs/partytown';

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  integrations: [
    react(),
    partytown({
      config: {
        forward: ['dataLayer.push', 'clarity'],
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
