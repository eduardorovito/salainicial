// Configuración general del sitio. Todo lo que hay que cambiar antes de publicar está acá.
export const site = {
  // Marca en minúscula, igual que el dominio (salainicial.com).
  name: 'salainicial',
  brand: 'Salainicial',
  tagline: 'Recursos para docentes de educación inicial',
  description:
    'Fichas, planificaciones y juegos gratis en español para docentes de educación inicial y preescolar en habla hispana.',
  // Dominio definitivo, sin barra final. Se usa en el mapa del sitio y en los enlaces canónicos.
  url: 'https://salainicial.com',
  // Español general para América Latina, Estados Unidos y otras comunidades hispanohablantes.
  locale: 'es',
  ogLocale: 'es_LA',
  author: 'Equipo de salainicial',
  email: import.meta.env?.PUBLIC_SALAINICIAL_CONTACT_EMAIL?.trim() ?? '',
  analyticsId: 'G-94F7Q7EJFK',

  adsense: {
    client: 'ca-pub-1288652910520806',
  },
};

export const redes = [
  { id: 'instagram', nombre: 'Instagram' },
  { id: 'facebook', nombre: 'Facebook' },
  { id: 'pinterest', nombre: 'Pinterest' },
];

// Orden = orden del menú. Las fichas van primero porque son el recurso principal del sitio.
// `foto` es la clave de la foto de la sección en src/data/fotos.ts.
export const categories = [
  {
    id: 'fichas',
    name: 'Fichas para imprimir',
    nav: 'Fichas',
    foto: 'fichas',
    short: 'Hojas de trabajo listas para imprimir o guardar en PDF',
    intro:
      'Fichas de trazos, vocales, números, figuras, series, recortado, emociones y naturaleza para docentes con niños de 3 a 5 años, listas para imprimir en A4 o guardar en PDF. Todas son gratis y cada una trae ideas para presentarla al grupo.',
  },
  {
    id: 'planificaciones',
    name: 'Planificaciones',
    nav: 'Planificaciones',
    foto: 'planificaciones',
    short: 'Proyectos, unidades y secuencias didácticas',
    intro:
      'Proyectos, unidades didácticas y secuencias completas, con propósitos, contenidos, actividades de inicio, desarrollo y cierre, y criterios de evaluación. Están pensadas para adaptarse al currículo de cada país.',
  },
  {
    id: 'juegos',
    name: 'Juegos',
    nav: 'Juegos',
    foto: 'juegos',
    short: 'Juegos de patio, de mesa y de movimiento',
    intro:
      'Juegos probados en el aula y en el patio, con variantes por edad, materiales y lo que cada uno pone en juego. Muchos son tradicionales en toda América Latina y se arman con lo que hay en cualquier escuela.',
  },
  {
    id: 'actividades',
    name: 'Actividades y salidas',
    nav: 'Actividades',
    foto: 'salidas',
    short: 'Salidas educativas, experimentos, arte y cocina',
    intro:
      'Propuestas para hacer con el grupo dentro y fuera de la escuela: salidas educativas y excursiones, experimentos sencillos, arte, origami y cocina en el aula. Cada una trae materiales, pasos y cuidados.',
  },
  {
    id: 'artistas',
    name: 'Artistas para el aula',
    seoTitle: 'Artistas y proyectos de arte para educación inicial',
    nav: 'Artistas',
    foto: 'portada-pintura',
    short: 'Proyectos de arte a partir de obras y procesos creativos',
    intro:
      'Explora obras y formas de crear con propuestas para docentes con niños de 3 a 5 años. Cada proyecto incluye preguntas para mirar, materiales, una secuencia de taller y variantes por edad.',
  },
  {
    id: 'cuentos',
    name: 'Cuentos',
    nav: 'Cuentos',
    foto: 'cuentos',
    short: 'Cuentos para leer en voz alta, con propuestas',
    intro:
      'Cuentos originales para leer en voz alta a niños de 3 a 5 años, con preguntas para conversar y actividades para después de la lectura. También ideas para contar cuentos de otras maneras, como el kamishibai.',
  },
  {
    id: 'efemerides',
    name: 'Efemérides',
    nav: 'Efemérides',
    foto: 'efemerides',
    short: 'Fechas especiales del año escolar',
    intro:
      'Fechas especiales para trabajar con niños de 3 a 5 años, con ideas concretas para el aula. Incluye días internacionales que se celebran en toda la región y calendarios por país.',
  },
  {
    id: 'blog',
    name: 'Blog docente',
    nav: 'Blog',
    foto: 'articulos',
    short: 'Ideas, experiencias y educación inicial en el mundo',
    intro:
      'Notas para docentes sobre el día a día en educación inicial: el período de adaptación, la organización del aula, el trabajo con las familias y lo que podemos aprender de cómo se enseña en otros países.',
  },
];

export const edades = ['3', '4', '5'];
