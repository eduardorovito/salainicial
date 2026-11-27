# AGENTS.md: instrucciones para ChatGPT, Codex y cualquier otra IA

Este repo es el sitio **salainicial.com** (recursos para docentes de educación inicial). El dueño trabaja con varias IAs (Claude y ChatGPT) sobre el mismo proyecto. Este repo es el lugar común: lo que se decide y se hace queda escrito acá.

## Antes de empezar

1. Lee `CLAUDE.md`: reglas del proyecto, stack, estructura y política de fuentes. Vale para todas las IAs, no solo para Claude.
2. Lee `contexto-proyectos-ia.md`: estado actual y pendientes.
3. Lee las últimas entradas de `BITACORA.md`: qué hizo la otra IA y qué quedó a medias.

## Reglas que no se negocian

- Habla con el dueño en español rioplatense (vos). El contenido del sitio va en español neutro con "tú".
- **Nunca subas a `main` sin su confirmación**: Vercel está conectado a `main` y cada push publica en salainicial.com. Trabaja en una rama y pide su OK antes de fusionar.
- No copies contenido de terceros. No guardes claves, `.env` ni datos personales en el repo.
- Si no pudiste verificar algo, dilo. No inventes datos ni fuentes.

## Al terminar cada sesión

Agrega una entrada **arriba** de `BITACORA.md` con el formato que está ahí, y actualiza la sección "Estado" de `contexto-proyectos-ia.md` si algo cambió. Haz commit en tu rama.
