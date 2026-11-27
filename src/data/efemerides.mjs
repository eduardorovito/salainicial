// Días internacionales que se trabajan en educación inicial en toda América Latina y España.
// Las fechas patrias de cada país van en artículos propios (por ejemplo, Argentina).
const CAL = '/efemerides/calendario-fechas-especiales-educacion-inicial/';
export const efemerides = [
  { m: 3, d: 8, name: 'Día Internacional de la Mujer' },
  { m: 3, d: 21, name: 'Día Mundial del Síndrome de Down' },
  { m: 3, d: 22, name: 'Día Mundial del Agua' },
  { m: 4, d: 2, name: 'Día Internacional del Libro Infantil' },
  { m: 4, d: 22, name: 'Día de la Tierra' },
  { m: 4, d: 23, name: 'Día del Libro y del Idioma Español' },
  { m: 5, d: 15, name: 'Día Internacional de las Familias' },
  { m: 6, d: 5, name: 'Día Mundial del Medio Ambiente' },
  { m: 6, d: 8, name: 'Día Mundial de los Océanos' },
  { m: 6, d: 11, name: 'Día Internacional del Juego', link: '/efemerides/dia-internacional-del-juego/' },
  { m: 9, d: 21, name: 'Día Internacional de la Paz' },
  { m: 10, d: 12, name: 'Día de la Diversidad Cultural' },
  { m: 10, d: 16, name: 'Día Mundial de la Alimentación' },
  { m: 11, d: 20, name: 'Día Mundial de las Infancias', link: `${CAL}#noviembre-y-diciembre` },
  { m: 12, d: 3, name: 'Día Internacional de las Personas con Discapacidad' },
].map((e) => ({ link: CAL, ...e }));

/** Devuelve la próxima fecha a partir de hoy (incluye el mismo día). */
export function proximaEfemeride(hoy = new Date()) {
  const m = hoy.getMonth() + 1;
  const d = hoy.getDate();
  return efemerides.find((e) => e.m > m || (e.m === m && e.d >= d)) ?? efemerides[0];
}

export const MESES = [
  'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
];
