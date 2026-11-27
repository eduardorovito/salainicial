// Todas las fichas imprimibles. La clave es el valor de `sheet` en el contenido.
// Para sumar una: crea el componente, agrégalo aquí y en el enum de src/content.config.ts.
import Trazos from './Trazos.astro';
import Contar from './Contar.astro';
import Vocales from './Vocales.astro';
import Numeros from './Numeros.astro';
import Recortar from './Recortar.astro';
import Emociones from './Emociones.astro';
import Patrones from './Patrones.astro';
import Figuras from './Figuras.astro';
import BingoNaturaleza from './BingoNaturaleza.astro';
import DiarioSemilla from './DiarioSemilla.astro';
import Letra from './Letra.astro';
import NumerosHastaVeinte from './NumerosHastaVeinte.astro';
import SecuenciasTemporales from './SecuenciasTemporales.astro';
import UnirSombras from './UnirSombras.astro';
import Laberintos from './Laberintos.astro';
import UnirPuntos from './UnirPuntos.astro';
import ClasificarFormas from './ClasificarFormas.astro';
import ParejasRimas from './ParejasRimas.astro';
import SonidoInicial from './SonidoInicial.astro';
import PalmasSilabas from './PalmasSilabas.astro';
import MiNombre from './MiNombre.astro';
import CompararCantidades from './CompararCantidades.astro';
import AdornosDiciembre from './AdornosDiciembre.astro';
import PostalesCierre from './PostalesCierre.astro';
import CaminoReyes from './CaminoReyes.astro';
import RegistroDelTiempo from './RegistroDelTiempo.astro';
import ExplorarTexturas from './ExplorarTexturas.astro';
import MaterialesYLuz from './MaterialesYLuz.astro';
import MaterialesYAgua from './MaterialesYAgua.astro';
import MapaDeSonidos from './MapaDeSonidos.astro';
import PosicionesConObjetos from './PosicionesConObjetos.astro';
import ObservacionDeAves from './ObservacionDeAves.astro';
import CompararConTiras from './CompararConTiras.astro';
import CuidarLibros from './CuidarLibros.astro';

export const sheets = {
  trazos: Trazos,
  'contar-1-al-5': Contar,
  vocales: Vocales,
  'numeros-1-al-10': Numeros,
  recortar: Recortar,
  emociones: Emociones,
  patrones: Patrones,
  figuras: Figuras,
  'bingo-naturaleza': BingoNaturaleza,
  'diario-semilla': DiarioSemilla,
  letra: Letra,
  'numeros-11-al-20': NumerosHastaVeinte,
  'secuencias-temporales': SecuenciasTemporales,
  'unir-sombras': UnirSombras,
  laberintos: Laberintos,
  'unir-puntos-12': UnirPuntos,
  'clasificar-formas': ClasificarFormas,
  'parejas-rimas': ParejasRimas,
  'sonido-inicial': SonidoInicial,
  'palmas-silabas': PalmasSilabas,
  'mi-nombre': MiNombre,
  'comparar-cantidades': CompararCantidades,
  'adornos-diciembre': AdornosDiciembre,
  'postales-cierre': PostalesCierre,
  'camino-reyes': CaminoReyes,
  'registro-del-tiempo': RegistroDelTiempo,
  'explorar-texturas': ExplorarTexturas,
  'materiales-y-luz': MaterialesYLuz,
  'materiales-y-agua': MaterialesYAgua,
  'mapa-de-sonidos': MapaDeSonidos,
  'posiciones-con-objetos': PosicionesConObjetos,
  'observacion-de-aves': ObservacionDeAves,
  'comparar-con-tiras': CompararConTiras,
  'cuidar-libros': CuidarLibros,
} as const;
