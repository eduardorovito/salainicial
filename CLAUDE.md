# salainicial: contexto del proyecto

Sitio de **recursos docentes para educación inicial** (para docentes con niños de 3 a 5 años) para América Latina y los países de habla hispana. El objetivo del dueño es **monetizar con Google AdSense**. Lo principal son los recursos para el aula (fichas imprimibles, planificaciones, juegos); el blog y los artículos son complemento para SEO.

- Producción actual: https://sala-inicial.vercel.app (dominio definitivo: **salainicial.com**, registrado y activo).
- AdSense: cliente `ca-pub-1288652910520806`. El script, la meta `google-adsense-account` y `/ads.txt` ya están en el sitio.
- El README.md tiene la guía para sumar recursos; este archivo tiene el estado y las decisiones.

## Cómo trabajar con el dueño

- Escribirle en **español rioplatense** (vos), claro y sin tecnicismos.
- **Público:** el sitio es para **adultos (docentes)** que trabajan con niños. Ningún título, descripción, badge ni imagen para compartir debe decir "para niños de X años": usar **"para docentes con niños de X años"**. Aplica a todo contenido nuevo y a lo ya publicado. Motivo: AdSense y la clasificación de sitios dirigidos a menores de 13 años (ver "Estado").
- El **contenido del sitio** va en **español neutro con "tú"** (niños, aula, "3 años", juegos con nombres conocidos en toda la región). Nada de voseo ni regionalismos en las páginas.
- Revisa la edad a la que corresponde tanto el objetivo como la consigna (comprensión oral, manejo del lápiz, registro y explicación). Para los grupos de 3 años, describe cómo acompaña la docente y qué se puede hacer con objetos, con el cuerpo o señalando. Si esa variante prepara para la ficha pero la hoja exige otros aprendizajes, etiqueta la ficha con las edades para las que está diseñada la hoja.
- **Solo fuentes de calidad excelente**: currículos oficiales (Finlandia, Japón, Noruega, Ontario, Head Start), Harvard Center on the Developing Child, educ.ar, Ciudad de Buenos Aires. Textos y fichas **originales**: nunca copiar; enlazar la fuente oficial.
- **Política de fuentes (aprobada por el dueño el 19/11/2026):** no se copia contenido de terceros. Se resume con palabras propias, se cita la fuente con nombre y se enlaza el original. Excepción: solo si la licencia lo permite de forma explícita, y nunca con licencias "no comercial" (el sitio tiene AdSense, así que es uso comercial). Fuentes sin licencia confirmada (Gobierno de la Ciudad, PDF "Jugamos con palabras", etc.): resumir y citar; no redistribuir el PDF. Montessori (derechos reservados), Twinkl, Genially y Chalkie: solo enlazar.
- **Redes sociales** (Instagram, TikTok, YouTube): no se rastrean ni se copian. El dueño pasa la lista de cuentas y se enlazan con crédito al creador.
- **Confirmar antes de cada publicación** en Vercel y antes de cualquier compra (el dominio, por ejemplo).
- Fotos: solo Unsplash (conector de Unsplash, registrando la descarga con `download_asset`), con crédito en `src/data/fotos.ts`.

## Stack y comandos

- **Astro 6.4.8**, sitio 100 % estático. Node local 22.16 (Astro 7 pide 22.23.4 o más: no actualizar sin revisar Node).
- `~/.npm` tiene un problema de permisos: usar `export NPM_CONFIG_CACHE="$TMPDIR/npm-cache"` antes de `npm install` o `npx`.
- `npm install` · `npm run dev` (servidor de desarrollo en el puerto 4321) · `npx astro build` (salida en `dist/`).
- Antes de publicar: compilar y revisar enlaces rotos (ver "Chequeo de enlaces" al final).

## Estructura

| Ruta | Qué hay |
|---|---|
| `src/site.config.mjs` | Nombre público (`Salainicial`), `url`, correo, AdSense y secciones (id, nombre, foto, textos) |
| `src/content/recursos/*.md` | **65 recursos**. El esquema está en `src/content.config.ts` |
| `src/components/sheets/` | Fichas imprimibles en SVG A4 (milímetros). Registro en `index.ts`; el enum `sheet` está en `content.config.ts` |
| `src/data/abecedario.mjs` | Las 27 letras con palabras de ejemplo (las usa `Letra.astro`) |
| `src/data/fotos.ts` + `src/assets/fotos/` | 14 fotos de Unsplash con texto alternativo y autor (créditos automáticos en `/aviso-legal/#fotos`) |
| `src/data/efemerides.mjs` | Días internacionales para el cartel "Próxima fecha especial" |
| `src/og/render.ts` + `src/pages/og/[...slug].jpg.ts` | Imágenes para compartir de 1200 × 630, generadas al compilar con resvg y las tipografías de `src/og/fonts/` |
| `src/styles/global.css` | Paleta de marca, escala tipográfica, espacios y radios |
| `vercel.json` | Redirecciones: `/articulos/*` → `/blog/*` y dos recursos que cambiaron de sección |

**Secciones** (orden del menú): fichas, planificaciones, juegos, actividades (Actividades y salidas), cuentos, efemerides, blog.

Campos útiles del encabezado de cada recurso: `category`, `edades` (`['3','4','5']`), `duration`, `sheet` (solo fichas), `letra` (fichas del abecedario), `serie` (las series no se repiten en la portada), `image` (clave de foto; las fichas no llevan foto porque su imagen es la hoja).

## Diseño de Salainicial

La guía vigente es `guia-marca-salainicial-chatgpt.md`, en el Escritorio. Los tokens están en `src/styles/global.css`.

- Fondo Papel `#fff8ec`, tarjetas blancas y texto Tinta `#1d2433`. El color principal es Pizarra `#1e6b5c`.
- **Tipografía:** Fredoka 600 (títulos, logotipo, botones) y Nunito Sans (textos). Las fichas imprimibles (SVG) siguen con Andika y Atkinson.
- Las edades se distinguen con círculo Mandarina, cuadrado Sol y triángulo Cielo, en los tonos 700 con texto blanco. Lila identifica Comunidad y Proyectos. Las etiquetas de sección son Arena con texto Tinta.
- El isotipo de cuatro figuras planas está en `src/assets/isotipo.svg`. El logotipo en minúsculas se renderiza en `src/components/Logo.astro`. La versión del pie usa las siluetas en Papel. Los números de las edades se muestran en sus selectores y etiquetas.
- Las tarjetas tienen un radio de 20 px y las fotografías de 14 px. Usa los tokens de marca y verifica el contraste del texto sobre el fondo real.

## Publicar en Vercel

- Proyecto `sala-inicial`, equipo `holadisenoweb` (projectId `prj_turEJK85RPluMXGI7sdGXJwy6dfa`, teamId `team_dJFtIH5ARoBg0NwH7Uf0yjxR`). La carpeta `.vercel/` ya vincula el proyecto.
- El CLI viejo instalado (v43) no permite entrar con Google: usar **`npx -y vercel@latest`**. La sesión ya está iniciada en esta Mac (inicio con código desde el navegador).
- El CLI escribe su configuración fuera del proyecto, así que **dentro del sandbox falla**: correrlo en el panel de terminal: `npx -y vercel@latest deploy --prod --yes`. Vercel compila en sus servidores (unos 40 segundos).
- Verificar después con `curl` que respondan las páginas, `/ads.txt`, `/sitemap.xml` y las redirecciones.
- **IndexNow (aviso a Bing):** la clave está en `public/<clave>.txt`. Después de cada publicación, correr en el panel de terminal `npm run indexnow` (envía las URLs del sitemap; `202` es correcto) o `npm run indexnow -- <url>` para páginas puntuales. Dentro del sandbox falla porque Node no tiene salida a internet.
- **Buscadores:** Search Console (propiedad de dominio verificada, sitemap enviado) y Bing Webmaster (importado desde Search Console) ya están configurados.

## Estado al 19 de noviembre de 2026

**Publicado en producción:** rediseño moderno, 7 secciones y 37 recursos.

**Hecho pero sin publicar** (sale en la próxima publicación, que el dueño tiene que aprobar):
- Cambio de nombre a **salainicial** (en minúscula, como el dominio) en todo el sitio.
- **Abecedario completo:** 27 fichas (A–Z con la Ñ, `ficha-letra-*.md`) y el índice `abecedario-para-imprimir`.
- **Imágenes para compartir** en todas las páginas (73 JPG de entre 25 y 92 KB; WhatsApp falla por encima de unos 300 KB).

## Pendientes, en orden

1. **Dominio salainicial.com:** ya está registrado a nombre del dueño en Spaceship (registrado el 19/11/2026, vence el 19/11/2027) y conectado al proyecto de Vercel como dominio externo. El sitio responde en salainicial.com (publicado el 25/11/2026). Pendientes menores:
   - `url` en `src/site.config.mjs` ya apunta a `https://salainicial.com`; revisar que siga así;
   - redirigir sala-inicial.vercel.app al dominio (hoy ya redirige).
2. **AdSense:** agregar el sitio en AdSense → Sitios (vercel.app no se acepta), activar el mensaje de consentimiento y pedir la revisión.
3. **Google Search Console:** verificar el dominio y enviar `/sitemap.xml`.
4. **Datos reales:** el correo `contacto@tudominio.com` es provisorio, y "Quiénes somos" tiene que nombrar a una persona real con experiencia.
5. **Comunidad / foro:** el dueño quiere un foro. Recomendación dada:
   - ahora, una comunidad en WhatsApp o Facebook con un botón en el sitio;
   - en 1 o 2 meses, comentarios en cada recurso;
   - el foro propio recién con unas 10.000 visitas por mes (necesita moderación diaria por las políticas de AdSense).
   Falta su decisión.
6. **Plan de contenido** (confirmado por el dueño el 20/11/2026: 5 recursos por semana: 3 fichas, 1 planificación o actividad, 1 cuento o nota de blog):
   - Próximas series: números del 1 al 20, unir puntos, laberintos, sombras, secuencias temporales.
   - Efemérides por país: México, Colombia, Chile, Perú.
   - Publicar cada fecha 4 a 6 semanas antes. Hay dos calendarios escolares: marzo a diciembre en el Cono Sur, agosto a junio en México y Centroamérica.
   - Imágenes verticales para Pinterest (la principal fuente de visitas para fichas imprimibles).
7. **Expectativa de ingresos que se le dio al dueño:** de US$1 a 3 cada 1.000 páginas vistas con público latinoamericano (es una estimación). AdSense paga desde US$100 de saldo; la cuenta tendría un saldo viejo de US$47. Google tarda de 3 a 6 meses en posicionar un sitio nuevo.

## Chequeo de enlaces

Después de `npx astro build`:

```bash
node -e "const fs=require('fs'),path=require('path');const files=[];(function w(d){for(const f of fs.readdirSync(d)){const p=path.join(d,f);fs.statSync(p).isDirectory()?w(p):p.endsWith('.html')&&files.push(p)}})('dist');let bad=0;for(const f of files){const h=fs.readFileSync(f,'utf8');for(const m of h.matchAll(/href=\"(\/[^\"#?]*)/g)){let u=decodeURI(m[1]);let t=path.join('dist',u);if(u.endsWith('/'))t=path.join(t,'index.html');if(!fs.existsSync(t)){bad++;console.log(f,'->',u)}}}console.log('páginas',files.length,'rotos',bad)"
```
