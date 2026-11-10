// Generuje zdjęcia strony w formatach AVIF, WebP i JPG w kilku szerokościach.
// Użycie: npm run images
// Oryginały (pełna rozdzielczość) trzymamy lokalnie w folderze SOURCE_DIR – NIE trafiają do repozytorium.
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE_DIR = process.env.SOURCE_DIR || 'Zdjęcie - strona';
const OUT_DIR = 'assets/img';
const WIDTHS = [480, 800, 1200, 1600];

// plik źródłowy -> nazwa wyjściowa (przyjazna dla SEO)
const MANIFEST = {
  'profilowe.jpg': 'rozalia-zaremska-fotografka-warszawa',
  'Kopia DSC03502.jpg': 'sesja-indywidualna-warszawa',
  'Kopia DSC03031.jpg': 'sesja-wizerunkowa-warszawa',
  'Kopia IMG_4859.jpg': 'sesja-modowa-warszawa',
  'Kopia IMG_8632.jpg': 'sesja-artystyczna-warszawa',
  'Kopia DSC09285.jpg': 'sesja-brzuszkowa-warszawa',
  'Kopia DSC09445.jpg': 'sesja-dla-par-i-rodzinna-warszawa',
  'Kopia DSC01221.jpg': 'portret-kobiecy-w-zlotym-swietle',
  'Kopia DSC01389.jpg': 'portret-modowy-o-zachodzie-slonca',
};

mkdirSync(OUT_DIR, { recursive: true });

for (const [src, slug] of Object.entries(MANIFEST)) {
  const input = join(SOURCE_DIR, src);
  if (!existsSync(input)) { console.warn('⚠ brak pliku:', input); continue; }
  const base = sharp(input, { limitInputPixels: false }).rotate();
  const meta = await base.metadata();
  for (const w of WIDTHS) {
    const width = Math.min(w, meta.width);
    const img = base.clone().resize({ width, withoutEnlargement: true });
    await img.clone().avif({ quality: 50, effort: 6 }).toFile(join(OUT_DIR, `${slug}-${w}.avif`));
    await img.clone().webp({ quality: 74 }).toFile(join(OUT_DIR, `${slug}-${w}.webp`));
    await img.clone().jpeg({ quality: 78, mozjpeg: true, progressive: true }).toFile(join(OUT_DIR, `${slug}-${w}.jpg`));
  }
  console.log('✓', slug);
}

// Obraz do udostępniania w mediach społecznościowych (Open Graph) 1200×630
await sharp(join(SOURCE_DIR, 'profilowe.jpg'), { limitInputPixels: false })
  .rotate().resize(1200, 630, { fit: 'cover', position: 'attention' })
  .jpeg({ quality: 80, mozjpeg: true }).toFile(join(OUT_DIR, 'og-image.jpg'));

console.log('Gotowe.');
