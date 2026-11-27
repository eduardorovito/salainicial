# salainicial

Sitio de recursos docentes para educación inicial y preescolar, pensado para América Latina y los países de habla hispana, hecho con [Astro](https://astro.build). Genera páginas estáticas: rápidas, baratas de alojar y fáciles de indexar por Google.

## Antes de publicar

1. **Dominio:** hoy `url` en `src/site.config.mjs` apunta a `https://sala-inicial.vercel.app`. Cuando tengas dominio propio, cambialo ahí.
2. **Correo:** cambiá `email` en el mismo archivo por una casilla que leas.
3. **Quiénes somos:** revisá `src/pages/quienes-somos.astro` y contá quién está detrás del sitio. Google valora que haya una persona real y con experiencia.
4. **AdSense:** el ID `ca-pub-1288652910520806` ya está cargado. Con eso el sitio incluye:
   - el script de AdSense en todas las páginas,
   - la etiqueta `<meta name="google-adsense-account">`,
   - el archivo `/ads.txt` con la línea `google.com, pub-1288652910520806, DIRECT, f08c47fec0942fa0`.

## Para que AdSense apruebe el sitio

- Sumá contenido hasta tener **entre 20 y 30 recursos** propios antes de pedir la revisión. Hoy hay 65.
- Revisá y personalizá cada recurso con tu experiencia. Lo que más pesa es que el contenido sea útil y original.
- En AdSense, agregá el sitio en **Sitios** y pedí la revisión. Puede tardar de unos días a algunas semanas.
- Activá el mensaje de consentimiento de Google en **Privacidad y mensajes** (es obligatorio para visitas de Europa).
- Para usar bloques fijos, creá los bloques adaptables en AdSense y guardá sus IDs en las variables de compilación. `PUBLIC_ADSENSE_HOME_SLOT` reserva un espacio en la portada. `PUBLIC_ADSENSE_IN_ARTICLE_SLOT` y `PUBLIC_ADSENSE_END_OF_ARTICLE_SLOT` corresponden al espacio antes del cuerpo de cada recurso y al de su final. Los espacios sin ID quedan ocultos.

## Cómo sumar un recurso

Creá un archivo `.md` en `src/content/recursos/`. El nombre del archivo es la dirección de la página. Ejemplo, `src/content/recursos/juegos-con-agua.md`:

```markdown
---
title: 'Juegos con agua para el verano'
description: 'Una frase de hasta 170 caracteres que aparece en Google y en los listados.'
category: juegos          # fichas | planificaciones | juegos | efemerides | articulos
edades: ['3', '4']        # edades en años, o [] si sirve para todas
duration: '2 semanas'     # opcional
published: 2026-12-01
---

Acá va el texto, con títulos (##), listas y tablas.
```

La página aparece sola en su sección, en las páginas por edad, en la portada y en el mapa del sitio.

Para una ficha imprimible nueva hay que dibujar la hoja en `src/components/sheets/` (SVG en milímetros, tamaño A4), registrarla en `src/components/sheets/index.ts` y sumarla al enum `sheet` de `src/content.config.ts`.

Para poner una foto de cabecera en un recurso, agrega `image: clave` en el encabezado. Las claves están en `src/data/fotos.ts`. Para sumar una foto nueva: guárdala en `src/assets/fotos/` (de unos 1800 px de ancho), impórtala en `fotos.ts` con su texto alternativo, autor y enlace, y aparecerá sola en los créditos de `/aviso-legal/#fotos`. Usa fotos con licencia libre (por ejemplo, de Unsplash). Las fichas no llevan foto: su imagen es la hoja.

## Estilo de los textos

Español neutro con "tú", para toda América Latina: "niños", "aula", "3 años" (no "sala de 3"). Si un recurso es de un solo país, decilo en el título, como en "Efemérides de Argentina".

## Comandos

Requiere Node 22.12 o superior.

```bash
npm install
```

```bash
npm run dev
```

```bash
npm run build
```

`npm run dev` abre el sitio en http://localhost:4321 mientras editás. `npm run build` genera la carpeta `dist/`, que es lo que se publica.

## Publicar

Cualquier alojamiento de sitios estáticos sirve. Con Vercel o Netlify: conectás la carpeta (o un repositorio de GitHub), el comando de compilación es `npm run build` y la carpeta de salida es `dist`.

## Acceso a Comunidad

- `PUBLIC_SUPABASE_URL` y `PUBLIC_SUPABASE_PUBLISHABLE_KEY` identifican el proyecto. Usá la clave publicable.
- Habilitá el acceso por correo en el sitio con `PUBLIC_COMMUNITY_EMAIL_LOGIN=true` y `PUBLIC_COMMUNITY_TURNSTILE_SITE_KEY`. En Supabase, configurá el SMTP, el CAPTCHA de Turnstile con la clave secreta y la URL de redirección `https://salainicial.com/comunidad/`.
- Antes de abrir el registro, probá el enlace con un correo ajeno al equipo de Supabase y verificá que Supabase rechace solicitudes sin un CAPTCHA válido.
- Configurá `PUBLIC_SALAINICIAL_CONTACT_EMAIL` en Vercel una vez que el buzón pueda enviar y recibir. La página de contacto toma esa dirección.

## Estructura

| Ruta | Qué hay |
| --- | --- |
| `src/site.config.mjs` | Nombre, dominio, correo, AdSense y secciones |
| `src/content/recursos/` | Los recursos en Markdown |
| `src/components/sheets/` | Las fichas imprimibles (dibujadas en SVG, tamaño A4) |
| `src/data/efemerides.mjs` | Fechas para el cuadro "Se viene" de la portada |
| `src/pages/` | Páginas fijas, secciones, sitemap, robots y ads.txt |
| `src/styles/global.css` | Colores, tipografía y estilos de impresión |
