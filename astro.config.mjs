// @ts-check
import { defineConfig } from 'astro/config';
import { site } from './src/site.config.mjs';

export default defineConfig({
  site: site.url,
  trailingSlash: 'always',
  build: { format: 'directory', inlineStylesheets: 'always' },
});
