// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { satteri } from '@astrojs/markdown-satteri';
import { hastWrap, mdastExtras } from './src/plugins/markdown.mjs';

export default defineConfig({
  site: 'https://apoorvasharma7.com',
  publicDir: './static',
  integrations: [sitemap()],
  devToolbar: { enabled: false },
  markdown: {
    processor: satteri({ mdastPlugins: [mdastExtras], hastPlugins: [hastWrap] }),
    shikiConfig: { theme: 'css-variables' },
  },
});
