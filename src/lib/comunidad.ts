export const categorias = [
  { id: 'recursos', nombre: 'Recursos y actividades' },
  { id: 'aula', nombre: 'Experiencias de aula' },
  { id: 'preguntas', nombre: 'Preguntas docentes' },
  { id: 'presentaciones', nombre: 'Presentaciones' },
] as const;

export const proveedores = [
  { id: 'google', nombre: 'Google' },
  { id: 'apple', nombre: 'Apple' },
  { id: 'facebook', nombre: 'Facebook' },
] as const;

export const tiposAporte = [
  { id: 'proyecto', nombre: 'Proyecto' },
  { id: 'recomendacion', nombre: 'Recomendación' },
  { id: 'recurso', nombre: 'Recurso' },
] as const;

const nombresPais = new Intl.DisplayNames(['es'], { type: 'region' });
export const paises = ['AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'ES', 'GT', 'HN', 'MX', 'NI', 'PA', 'PE', 'PR', 'PY', 'SV', 'US', 'UY', 'VE']
  .map((id) => ({ id, nombre: nombresPais.of(id) ?? id }))
  .sort((a, b) => a.nombre.localeCompare(b.nombre, 'es'));
