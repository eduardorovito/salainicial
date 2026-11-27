import { getCollection, type CollectionEntry } from 'astro:content';
import { categories } from '../site.config.mjs';

export type Recurso = CollectionEntry<'recursos'>;

export async function getRecursos(): Promise<Recurso[]> {
  const all = await getCollection('recursos', ({ data }) => !data.draft);
  return all.sort((a, b) => fechaDe(b).getTime() - fechaDe(a).getTime());
}

export function fechaDe(r: Recurso): Date {
  return r.data.updated ?? r.data.published;
}

export function urlDe(r: Recurso): string {
  return `/${r.data.category}/${r.id}/`;
}

export function urlEdad(edad: string): string {
  return `/edad/${edad}-anos/`;
}

export function categoriaDe(id: string) {
  return categories.find((c) => c.id === id)!;
}

export function edadesTexto(edades: string[]): string {
  if (edades.length === 0) return 'De 3 a 5 años';
  if (edades.length === 1) return `${edades[0]} años`;
  return `${edades.slice(0, -1).join(', ')} y ${edades.at(-1)} años`;
}

const fmt = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });
export function formatoFecha(d: Date): string {
  return fmt.format(d);
}
