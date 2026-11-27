import type { APIRoute } from 'astro';
import { site } from '../site.config.mjs';

// Genera /ads.txt a partir del ID de editor de AdSense.
export const GET: APIRoute = () => {
  const pub = site.adsense.client.replace(/^ca-/, '');
  const body = pub
    ? `google.com, ${pub}, DIRECT, f08c47fec0942fa0\n`
    : '# Completá site.adsense.client en src/site.config.mjs para generar este archivo.\n';
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
