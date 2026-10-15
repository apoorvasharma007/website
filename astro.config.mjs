// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://apoorvasharma7.com',
  publicDir: './static',
  integrations: [sitemap()],
  devToolbar: { enabled: false },
});
