// Genera una imagen para compartir por cada página: /og/inicio.jpg, /og/<seccion>.jpg y /og/<seccion>/<recurso>.jpg
import type { APIRoute, GetStaticPaths } from 'astro';
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import { renderOg, type OgData } from '../../og/render';
import { sheets } from '../../components/sheets';
import { categories, site } from '../../site.config.mjs';
import { getRecursos, categoriaDe, edadesTexto } from '../../lib/recursos';
import { fotoDeRecurso } from '../../data/fotos';

const PIE = 'Gratis para docentes de educación inicial';

export const getStaticPaths = (async () => {
  const recursos = await getRecursos();
  const paths: { params: { slug: string }; props: { og: Omit<OgData, 'sheetSvg'> & { sheet?: string; letra?: string } } }[] = [
    {
      params: { slug: 'inicio' },
      props: { og: { title: 'Recursos docentes para educación inicial', kicker: 'Recursos gratis', cat: 'fichas', footer: 'Fichas, planificaciones, juegos y cuentos para 3 a 5 años', foto: 'portada-bloques' } },
    },
    ...categories.map((c) => ({
      params: { slug: c.id },
      props: { og: { title: c.name, kicker: site.brand, cat: c.id, footer: c.short, foto: c.foto } },
    })),
    ...recursos.map((r) => ({
      params: { slug: `${r.data.category}/${r.id}` },
      props: {
        og: {
          title: r.data.title,
          kicker: categoriaDe(r.data.category).name,
          cat: r.data.category,
          footer: `${edadesTexto(r.data.edades)} · ${PIE}`,
          foto: fotoDeRecurso(r.data.category, r.data.image),
          sheet: r.data.sheet,
          letra: r.data.letra,
        },
      },
    })),
  ];
  return paths;
}) satisfies GetStaticPaths;

let container: AstroContainer | undefined;

export const GET: APIRoute = async ({ props }) => {
  const { sheet, letra, ...og } = props.og as OgData & { sheet?: keyof typeof sheets; letra?: string };
  let sheetSvg: string | undefined;
  if (sheet && sheets[sheet]) {
    container ??= await AstroContainer.create();
    sheetSvg = await container.renderToString(sheets[sheet], { props: { letra } });
  }
  const jpg = await renderOg({ ...og, sheetSvg });
  return new Response(new Uint8Array(jpg), { headers: { 'Content-Type': 'image/jpeg' } });
};
