import type { APIRoute } from 'astro';
import { site, categories, edades } from '../site.config.mjs';
import { getRecursos, urlDe, fechaDe, urlEdad } from '../lib/recursos';

export const GET: APIRoute = async () => {
  const recursos = await getRecursos();
  const entries: { loc: string; lastmod?: string }[] = [
    { loc: '/' },
    ...categories.map((c) => ({ loc: `/${c.id}/` })),
    ...edades.map((e) => ({ loc: urlEdad(e) })),
    ...recursos.map((r) => ({ loc: urlDe(r), lastmod: fechaDe(r).toISOString().slice(0, 10) })),
    { loc: '/quienes-somos/', lastmod: '2026-11-26' },
    { loc: '/cuentas-recomendadas/', lastmod: '2026-11-26' },
    { loc: '/contacto/', lastmod: '2026-11-26' },
    { loc: '/privacidad/', lastmod: '2026-11-26' },
    { loc: '/aviso-legal/', lastmod: '2026-11-26' },
  ];
  const xml =
    '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
    entries
      .map(
        (e) =>
          `  <url><loc>${new URL(e.loc, site.url).href}</loc>${e.lastmod ? `<lastmod>${e.lastmod}</lastmod>` : ''}</url>`,
      )
      .join('\n') +
    '\n</urlset>\n';
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
