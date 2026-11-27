// Fotos del sitio. Todas son de Unsplash (licencia libre, uso comercial permitido).
// Para sumar una: guarda el .jpg en src/assets/fotos, impórtalo y agrégalo aquí con su autor.
import type { ImageMetadata } from 'astro';
import { categories } from '../site.config.mjs';
import portada from '../assets/fotos/portada.jpg';
import portadaBloques from '../assets/fotos/portada-bloques.jpg';
import portadaPintura from '../assets/fotos/portada-pintura.jpg';
import lecturaCompartida from '../assets/fotos/lectura-compartida.jpg';
import proyectosMateriales from '../assets/fotos/proyectos-materiales.jpg';
import comunidadColaboracion from '../assets/fotos/comunidad-colaboracion.jpg';
import luzYSombras from '../assets/fotos/luz-y-sombras.jpg';
import fichas from '../assets/fotos/fichas.jpg';
import planificaciones from '../assets/fotos/planificaciones.jpg';
import juegos from '../assets/fotos/juegos.jpg';
import efemerides from '../assets/fotos/efemerides.jpg';
import articulos from '../assets/fotos/articulos.jpg';
import bosque from '../assets/fotos/bosque.jpg';
import arbol from '../assets/fotos/arbol.jpg';
import origami from '../assets/fotos/origami.jpg';
import origamiRojo from '../assets/fotos/origami-rojo.jpg';
import semillas from '../assets/fotos/semillas.jpg';
import juguetes from '../assets/fotos/juguetes.jpg';
import cuentos from '../assets/fotos/cuentos.jpg';
import salidas from '../assets/fotos/salidas.jpg';

export interface Foto {
  src: ImageMetadata;
  alt: string;
  autor: string;
  url: string;
}

export const fotos = {
  'portada-pintura': {
    src: portadaPintura,
    alt: 'Unas manos infantiles manchadas de pintura sobre una hoja de colores',
    autor: 'Jonathan Borba',
    url: 'https://unsplash.com/photos/2SA60mUllYY',
  },
  'portada-bloques': {
    src: portadaBloques,
    alt: 'Dos niños juegan con bloques de letras junto a una persona adulta, en un rincón soleado',
    autor: 'Marisa Howenstine',
    url: 'https://unsplash.com/photos/Cq9slNxV8YU',
  },
  'lectura-compartida': {
    src: lecturaCompartida,
    alt: 'Una mujer lee un libro con un niño en una biblioteca',
    autor: 'Adam Winger',
    url: 'https://unsplash.com/photos/7fF0iei80AQ',
  },
  'proyectos-materiales': {
    src: proyectosMateriales,
    alt: 'Puntas de lápices de colores alrededor de una hoja blanca',
    autor: 'Jess Bailey',
    url: 'https://unsplash.com/photos/Bg14l3hSAsA',
  },
  'comunidad-colaboracion': {
    src: comunidadColaboracion,
    alt: 'Dos mujeres revisan juntas una idea frente a una computadora',
    autor: 'Vitaly Gariev',
    url: 'https://unsplash.com/photos/dutJL2d2DIA',
  },
  'luz-y-sombras': {
    src: luzYSombras,
    alt: 'La sombra de una mano se distingue sobre una pared iluminada',
    autor: 'Vaginismus Mag',
    url: 'https://unsplash.com/photos/mFqDTW60N0c',
  },
  portada: {
    src: portada,
    alt: 'Una docente acompaña a un grupo de niños que dibujan sentados a una mesa',
    autor: 'Rewired Digital',
    url: 'https://unsplash.com/photos/kPkRpy6pIIg',
  },
  fichas: {
    src: fichas,
    alt: 'Un niño pinta con un crayón el dibujo de una mariposa',
    autor: 'Lucas Alexander',
    url: 'https://unsplash.com/photos/sJuDgtkUyYs',
  },
  planificaciones: {
    src: planificaciones,
    alt: 'Una docente trabaja con un grupo de niños alrededor de una mesa en el aula',
    autor: 'Yegor Makarenko',
    url: 'https://unsplash.com/photos/WGEgIC76RjA',
  },
  juegos: {
    src: juegos,
    alt: 'Niños juegan en un arenero junto a una docente',
    autor: 'Rewired Digital',
    url: 'https://unsplash.com/photos/26vlm0cVvE4',
  },
  efemerides: {
    src: efemerides,
    alt: 'Banderines de colores colgados para una fiesta',
    autor: 'Alexandr Popadin',
    url: 'https://unsplash.com/photos/noirIyNKf2I',
  },
  articulos: {
    src: articulos,
    alt: 'Mesa con acuarelas, lápices de colores y dibujos infantiles',
    autor: 'Anima Visual',
    url: 'https://unsplash.com/photos/iWmc8Ccaooc',
  },
  bosque: {
    src: bosque,
    alt: 'Niños juegan con una hamaca colgada entre los árboles de un bosque',
    autor: 'Alexandr Podvalny',
    url: 'https://unsplash.com/photos/bh476ojZw2g',
  },
  arbol: {
    src: arbol,
    alt: 'Un niño trepa a un árbol',
    autor: 'Annie Spratt',
    url: 'https://unsplash.com/photos/-JUIieIDu54',
  },
  origami: {
    src: origami,
    alt: 'Dos grullas de origami de colores sobre una mesa',
    autor: 'Carolina Garcia Tavizon',
    url: 'https://unsplash.com/photos/Ay7Nkvc49ag',
  },
  'origami-rojo': {
    src: origamiRojo,
    alt: 'Grullas de origami de papel rojo y rosa',
    autor: 'Shinta Kikuchi',
    url: 'https://unsplash.com/photos/Iab-F_63atc',
  },
  semillas: {
    src: semillas,
    alt: 'Manos con tierra plantan plantines en una huerta',
    autor: 'Sandie Clarke',
    url: 'https://unsplash.com/photos/q13Zq1Jufks',
  },
  juguetes: {
    src: juguetes,
    alt: 'Niños juegan en el piso de una sala luminosa',
    autor: 'Rewired Digital',
    url: 'https://unsplash.com/photos/4UFIg9htJgE',
  },
  cuentos: {
    src: cuentos,
    alt: 'Un niño lee un libro ilustrado sentado a una mesa de madera',
    autor: 'Michał Parzuchowski',
    url: 'https://unsplash.com/photos/BPXSTl_HBhk',
  },
  salidas: {
    src: salidas,
    alt: 'Un grupo de niños con mochilas camina por la calle en una salida',
    autor: 'note thanun',
    url: 'https://unsplash.com/photos/CYlPykF-qAM',
  },
} satisfies Record<string, Foto>;

export type FotoId = keyof typeof fotos;

export function esFoto(id: string | undefined): id is FotoId {
  return !!id && Object.hasOwn(fotos, id);
}

export function fotoDeRecurso(category: string, image?: string): FotoId {
  if (esFoto(image)) return image;
  const porSeccion = categories.find((cat) => cat.id === category)?.foto;
  return esFoto(porSeccion) ? porSeccion : 'portada';
}

export function fotosSinRepetir<T extends { data: { category: string; image?: string } }>(
  recursos: readonly T[],
  reservadas: readonly FotoId[],
) {
  const vistas = new Set(reservadas);
  return recursos.map((recurso) => {
    const foto = fotoDeRecurso(recurso.data.category, recurso.data.image);
    if (vistas.has(foto)) return { recurso, foto: null };
    vistas.add(foto);
    return { recurso, foto };
  });
}
