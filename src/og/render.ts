// Imágenes para compartir (Open Graph, 1200 x 630): las que muestran WhatsApp, Facebook, Pinterest y X.
// Se dibujan como SVG y se convierten a PNG con resvg, usando las tipografías del sitio (src/og/fonts).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { Resvg } from '@resvg/resvg-js';
import { site } from '../site.config.mjs';

const FONTS = path.join(process.cwd(), 'src/og/fonts');
const FOTOS = path.join(process.cwd(), 'src/assets/fotos');
const LOGO_MARK = fs.readFileSync(path.join(process.cwd(), 'public/favicon.svg'), 'utf8')
  .replace('<svg ', '<svg width="120" height="120" ');

// Paleta de global.css para las imágenes que se comparten.
const INK = '#1d2433';
const PAPER = '#fff8ec';
const CAT: Record<string, { color: string; ink: string }> = {
  fichas: { color: '#f6be3b', ink: INK },
  planificaciones: { color: '#1e6b5c', ink: PAPER },
  juegos: { color: '#9b7bd4', ink: INK },
  actividades: { color: '#f0643a', ink: INK },
  artistas: { color: '#9b7bd4', ink: INK },
  cuentos: { color: '#4fa3d9', ink: INK },
  efemerides: { color: '#4a4f5c', ink: PAPER },
  blog: { color: '#4fa3d9', ink: INK },
};

export interface OgData {
  title: string;
  kicker: string;
  cat: string;
  footer: string;
  /** Clave de una foto de src/data/fotos.ts */
  foto?: string;
  /** SVG de una ficha (viewBox 0 0 210 297) */
  sheetSvg?: string;
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Corta el título en líneas según un ancho aproximado por carácter. */
function wrap(text: string, maxChars: number): string[] {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxChars && line) {
      lines.push(line);
      line = w;
    } else {
      line = (line + ' ' + w).trim();
    }
  }
  if (line) lines.push(line);
  return lines;
}

async function fotoBase64(key: string): Promise<string | null> {
  const file = path.join(FOTOS, `${key}.jpg`);
  if (!fs.existsSync(file)) return null;
  const buf = await sharp(file).resize(760, 900, { fit: 'cover' }).jpeg({ quality: 78 }).toBuffer();
  return `data:image/jpeg;base64,${buf.toString('base64')}`;
}

function logo(x: number, y: number) {
  return `<g transform="translate(${x} ${y}) scale(0.45)">${LOGO_MARK}</g>
  <text x="${x + 66}" y="${y + 37}" font-family="Bricolage Grotesque" font-weight="800" font-size="34" fill="${INK}">${site.brand}</text>`;
}

export async function renderOg(d: OgData): Promise<Buffer> {
  const c = CAT[d.cat] ?? CAT.fichas;
  const textW = 600;
  const size = d.title.length <= 28 ? 74 : d.title.length <= 55 ? 62 : 52;
  const lines = wrap(d.title, Math.floor(textW / (size * 0.5))).slice(0, 4);
  const lineH = size * 1.06;
  // Bloque etiqueta + título centrado en el espacio libre, sin pisar el logo (que termina en y≈110).
  const blockH = 48 + 30 + lines.length * lineH;
  const blockTop = Math.max(126, 330 - blockH / 2);
  const kickerTop = blockTop;
  const titleY = blockTop + 78 + size * 0.88;

  let media = '';
  if (d.sheetSvg) {
    // Hoja A4 inclinada, con sombra suave.
    const w = 318;
    const h = (w * 297) / 210;
    const sheet = d.sheetSvg.replace(/<svg\b[^>]*>/, `<svg x="0" y="0" width="${w}" height="${h}" viewBox="0 0 210 297" xmlns="http://www.w3.org/2000/svg">`);
    media = `<g transform="translate(790 82) rotate(-4 ${w / 2} ${h / 2})">
      <rect x="6" y="14" width="${w}" height="${h}" rx="10" fill="${INK}" opacity="0.18" filter="url(#blur)"/>
      <rect width="${w}" height="${h}" rx="10" fill="#fff"/>
      <g clip-path="url(#sheetClip)">${sheet}</g>
    </g>`;
  } else if (d.foto) {
    const data = await fotoBase64(d.foto);
    if (data) {
      media = `<clipPath id="photoClip"><rect x="736" y="56" width="408" height="518" rx="32"/></clipPath>
      <image href="${data}" x="736" y="56" width="408" height="518" preserveAspectRatio="xMidYMid slice" clip-path="url(#photoClip)"/>`;
    }
  }

  if (!media) {
    // Sin foto ni ficha: los tres bloques del logo, grandes, como ilustración.
    media = `<g transform="translate(810 150) scale(2.7)">${LOGO_MARK}</g>`;
  }
  const kickerW = d.kicker.length * 13.2 + 44;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <filter id="blur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="14"/></filter>
    <clipPath id="sheetClip"><rect width="318" height="${(318 * 297) / 210}" rx="10"/></clipPath>
  </defs>
  <rect width="1200" height="630" fill="${PAPER}"/>
  <circle cx="1150" cy="-40" r="155" fill="${c.color}"/>
  <circle cx="20" cy="696" r="126" fill="${c.color}"/>
  ${logo(64, 52)}
  <rect x="64" y="${kickerTop}" width="${kickerW}" height="48" rx="24" fill="${c.color}"/>
  <text x="${64 + 22}" y="${kickerTop + 32}" font-family="Atkinson Hyperlegible Next" font-weight="700" font-size="22" fill="${c.ink}">${esc(d.kicker)}</text>
  <g font-family="Bricolage Grotesque" font-weight="800" font-size="${size}" fill="${INK}" letter-spacing="${-size * 0.03}">
    ${lines.map((l, i) => `<text x="64" y="${titleY + i * lineH}">${esc(l)}</text>`).join('')}
  </g>
  <text x="64" y="574" font-family="Atkinson Hyperlegible Next" font-weight="700" font-size="24" fill="${INK}" opacity="0.75">${esc(d.footer)}</text>
  ${media}
</svg>`;

  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: 1200 },
    font: {
      loadSystemFonts: false,
      fontFiles: ['Bricolage-800.ttf', 'Atkinson-400.ttf', 'Atkinson-700.ttf', 'Andika-400.ttf', 'Andika-700.ttf'].map((f) => path.join(FONTS, f)),
      defaultFontFamily: 'Atkinson Hyperlegible Next',
    },
  });
  // JPEG optimizado: las previsualizaciones de WhatsApp fallan con imágenes de más de ~300 KB.
  return sharp(resvg.render().asPng()).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
}
