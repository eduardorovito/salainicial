import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const recursos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/recursos' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(170),
    category: z.enum(['fichas', 'planificaciones', 'juegos', 'actividades', 'artistas', 'cuentos', 'efemerides', 'blog']),
    // Edades (en años) para las que sirve el recurso. Vacío = todas.
    edades: z.array(z.enum(['3', '4', '5'])).default([]),
    duration: z.string().optional(),
    published: z.coerce.date(),
    updated: z.coerce.date().optional(),
    // Para fichas imprimibles: qué hoja dibujar (ver src/components/sheets/index.ts)
    sheet: z
      .enum([
        'trazos',
        'contar-1-al-5',
        'vocales',
        'numeros-1-al-10',
        'recortar',
        'emociones',
        'patrones',
        'figuras',
        'bingo-naturaleza',
        'diario-semilla',
        'letra',
        'numeros-11-al-20',
        'secuencias-temporales',
        'unir-sombras',
        'laberintos',
        'unir-puntos-12',
        'clasificar-formas',
        'parejas-rimas',
        'sonido-inicial',
        'palmas-silabas',
        'mi-nombre',
        'comparar-cantidades',
        'adornos-diciembre',
        'postales-cierre',
        'camino-reyes',
        'registro-del-tiempo',
        'explorar-texturas',
        'materiales-y-luz',
        'materiales-y-agua',
        'mapa-de-sonidos',
        'posiciones-con-objetos',
        'observacion-de-aves',
        'comparar-con-tiras',
        'cuidar-libros',
      ])
      .optional(),
    downloadPdf: z.boolean().default(false),
    // Para la hoja `letra`: qué letra dibujar (A, B, ..., Ñ, ..., Z)
    letra: z.string().length(1).optional(),
    // Serie a la que pertenece la ficha (por ejemplo, abecedario). Las series no se repiten en la portada.
    serie: z.string().optional(),
    // Foto de cabecera (clave de src/data/fotos.ts). Las fichas no la usan: su imagen es la hoja.
    image: z.string().optional(),
    fotoComplementaria: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { recursos };
