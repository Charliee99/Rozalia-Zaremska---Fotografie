// Generuje zdjęcia strony w formatach AVIF, WebP i JPG w kilku szerokościach.
// Użycie: npm run images            – wszystkie zdjęcia
//         ONLY=nazwa npm run images – tylko jedno (nazwa wyjściowa z listy poniżej)
// Oryginały (pełna rozdzielczość) trzymamy lokalnie w folderze SOURCE_DIR – NIE trafiają do repozytorium.
import sharp from 'sharp';
import { mkdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const SOURCE_DIR = process.env.SOURCE_DIR || 'Zdjęcie - strona';
const OUT_DIR = 'assets/img';
const WIDTHS = [480, 800, 1200, 1600];
const ONLY = process.env.ONLY;

// src: plik źródłowy, slug: nazwa wyjściowa (przyjazna dla SEO),
// crop (opcjonalnie): wycinek oryginału w pikselach { left, top, width, height }
const MANIFEST = [
  { src: 'profilowe.jpg', slug: 'rozalia-zaremska-fotografka-warszawa' },
  { src: 'Kopia DSC03502.jpg', slug: 'sesja-indywidualna-warszawa' },
  { src: 'Kopia DSC03031.jpg', slug: 'sesja-wizerunkowa-warszawa' },
  { src: 'Kopia IMG_8632.jpg', slug: 'sesja-artystyczna-warszawa' },
  { src: 'Kopia DSC09285.jpg', slug: 'sesja-brzuszkowa-warszawa' },
  { src: 'Kopia DSC09445.jpg', slug: 'sesja-dla-par-i-rodzinna-warszawa' },
  { src: 'Kopia DSC09445.jpg', slug: 'sesja-narzeczenska-warszawa', crop: { left: 1100, top: 700, width: 2600, height: 3250 } },
  { src: 'Kopia DSC01221.jpg', slug: 'portret-kobiecy-w-zlotym-swietle' },
  { src: 'Kopia DSC01389.jpg', slug: 'portret-modowy-o-zachodzie-slonca' },
];

mkdirSync(OUT_DIR, { recursive: true });

for (const { src, slug, crop } of MANIFEST) {
  if (ONLY && ONLY !== slug) continue;
  const input = join(SOURCE_DIR, src);
  if (!existsSync(input)) { console.warn('⚠ brak pliku:', input); continue; }
  let base = sharp(input, { limitInputPixels: false }).rotate();
  if (crop) base = sharp(await base.extract(crop).toBuffer());
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
if (!ONLY) {
  await sharp(join(SOURCE_DIR, 'profilowe.jpg'), { limitInputPixels: false })
    .rotate().resize(1200, 630, { fit: 'cover', position: 'attention' })
    .jpeg({ quality: 80, mozjpeg: true }).toFile(join(OUT_DIR, 'og-image.jpg'));
}

console.log('Gotowe.');
