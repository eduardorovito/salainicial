// Avisa a Bing y a los buscadores que usan IndexNow cuáles son las páginas del sitio.
// Se corre después de publicar: `npm run indexnow`.
// Lee el sitemap publicado y envía todas las URLs (hasta 10.000 por pedido).
//
// Uso:
//   npm run indexnow               → envía todas las URLs del sitemap
//   npm run indexnow -- <url> ...  → envía solo las URLs indicadas

import { readdirSync } from 'node:fs';

const host = 'salainicial.com';
const key = readdirSync('public')
  .find((f) => /^[0-9a-f]{32}\.txt$/.test(f))
  ?.replace('.txt', '');

if (!key) {
  console.error('No encontré el archivo de clave en public/ (32 caracteres hexadecimales .txt).');
  process.exit(1);
}

async function urlsDelSitemap() {
  const res = await fetch(`https://${host}/sitemap.xml`);
  if (!res.ok) throw new Error(`No pude leer el sitemap (HTTP ${res.status}).`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
}

const indicadas = process.argv.slice(2);
const urlList = indicadas.length ? indicadas : await urlsDelSitemap();

if (urlList.length === 0) {
  console.error('No hay URLs para enviar.');
  process.exit(1);
}

const res = await fetch('https://api.indexnow.org/IndexNow', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json; charset=utf-8' },
  body: JSON.stringify({
    host,
    key,
    keyLocation: `https://${host}/${key}.txt`,
    urlList,
  }),
});

console.log(`IndexNow respondió ${res.status} (${urlList.length} URLs).`);
if (res.status !== 200 && res.status !== 202) {
  console.log('200 y 202 son correctos. Otro código indica un problema: 403 = clave no encontrada, 422 = URLs que no son del sitio, 429 = demasiados pedidos.');
  process.exit(1);
}
