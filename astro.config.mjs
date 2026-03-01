// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://freqai.io',
  integrations: [sitemap()],
  vite: {
    plugins: [tailwindcss()]
  }
});
