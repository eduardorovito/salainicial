import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { APIRoute } from 'astro';
import { getRecursos } from '../../lib/recursos';

export async function getStaticPaths() {
  const recursos = await getRecursos();
  return recursos.filter(({ data }) => data.sheet && data.downloadPdf).map(({ id }) => ({
    params: { slug: id },
    props: { filename: `${id}.pdf` },
  }));
}

export const GET: APIRoute = async ({ props }) => {
  const pdf = await readFile(join(process.cwd(), 'src/assets/descargas', props.filename));
  return new Response(new Uint8Array(pdf), { headers: { 'Content-Type': 'application/pdf' } });
};
