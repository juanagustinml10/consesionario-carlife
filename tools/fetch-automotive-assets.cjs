/**
 * Descarga fotografías automotrices de Unsplash y las convierte a WebP
 * en escala de grises, listas para el sistema visual CARLIFE.
 *
 * Uso: node tools/fetch-automotive-assets.cjs
 * Requiere `sharp` (ya instalado en backend/node_modules).
 */

const fs = require('node:fs/promises');
const path = require('node:path');
const sharp = require('../backend/node_modules/sharp');

const OUT = path.resolve(__dirname, '../frontend/public/images');

const PHOTOS = [
  { name: 'hero-premium', id: 'photo-1503376780353-7e6692767b70', width: 2200, height: 1300 },
  { name: 'hero-detail', id: 'photo-1552519507-da3b142c6e3d', width: 1600, height: 1100 },
  { name: 'editorial-coupe', id: 'photo-1542362567-b07e54358753', width: 1600, height: 1100 },
  { name: 'editorial-side', id: 'photo-1492144534655-ae79c964c9d7', width: 1600, height: 1100 },
  { name: 'service-permutas', id: 'photo-1606664515524-ed2f786a0bd6', width: 1600, height: 1100 },
  { name: 'service-financiacion', id: 'photo-1507136566006-cfc505b114fc', width: 1600, height: 1100 },
  { name: 'service-consignaciones', id: 'photo-1618843479313-40f8afb4b4d8', width: 1600, height: 1100 },
  { name: 'service-envios', id: 'photo-1580273916550-e323be2ae537', width: 1600, height: 1100 },
];

async function main() {
  await fs.mkdir(OUT, { recursive: true });

  for (const photo of PHOTOS) {
    const url = `https://images.unsplash.com/${photo.id}?auto=format&fit=crop&w=2600&q=90`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`${photo.id}: HTTP ${response.status}`);

    const input = Buffer.from(await response.arrayBuffer());
    const output = path.join(OUT, `${photo.name}.webp`);

    await sharp(input)
      .resize(photo.width, photo.height, { fit: 'cover', position: 'centre' })
      .grayscale()
      .linear(1.08, -10)
      .webp({ quality: 84, effort: 6 })
      .toFile(output);

    const { size } = await fs.stat(output);
    console.log(`${photo.name}.webp — ${(size / 1024).toFixed(0)} KB`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
