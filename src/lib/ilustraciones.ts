import type { ImageMetadata } from 'astro';

const ilustraciones = import.meta.glob<ImageMetadata>('../assets/ilustraciones/*.webp', {
  eager: true,
  import: 'default',
});

export function ilustracionDe(id: string) {
  return ilustraciones[`../assets/ilustraciones/${id}.webp`] ?? null;
}

export function ilustracionDeRecurso(id: string, categoria: string) {
  return ilustracionDe(id) ?? ilustracionDe(portadasDeSeccion[categoria]);
}

export const portadasDeSeccion: Readonly<Record<string, string>> = {
  fichas: 'ficha-contar-del-1-al-5',
  planificaciones: 'proyecto-sembramos-y-observamos',
  juegos: 'juegos-de-patio',
  actividades: 'experimentos-sencillos-nivel-inicial',
  cuentos: 'cuento-la-nube-pipa',
  efemerides: 'calendario-fechas-especiales-educacion-inicial',
  blog: 'curriculos-de-educacion-inicial-en-el-mundo',
};
