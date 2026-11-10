// Kopiuje potrzebne pliki fontów (WOFF2, latin + latin-ext) z node_modules do assets/fonts.
// Fonty są hostowane lokalnie – bez zapytań do Google Fonts (szybciej i zgodnie z RODO).
import { copyFileSync, mkdirSync } from 'node:fs';
import { join } from 'node:path';

const out = 'assets/fonts';
mkdirSync(out, { recursive: true });
const files = [
  ['cormorant-garamond', 'cormorant-garamond-latin-500-normal.woff2'],
  ['cormorant-garamond', 'cormorant-garamond-latin-ext-500-normal.woff2'],
  ['cormorant-garamond', 'cormorant-garamond-latin-500-italic.woff2'],
  ['cormorant-garamond', 'cormorant-garamond-latin-ext-500-italic.woff2'],
  ['jost', 'jost-latin-400-normal.woff2'],
  ['jost', 'jost-latin-ext-400-normal.woff2'],
  ['jost', 'jost-latin-500-normal.woff2'],
  ['jost', 'jost-latin-ext-500-normal.woff2'],
];
for (const [pkg, f] of files) {
  copyFileSync(join('node_modules/@fontsource', pkg, 'files', f), join(out, f));
  console.log('✓', f);
}
