/**
 * Migración manual (NO automática) de imágenes legacy a BYTEA en Neon.
 *
 * Uso:
 *   npx tsx scripts/migrate-images-to-db.ts            # dry-run, solo lectura
 *   npx tsx scripts/migrate-images-to-db.ts --apply    # escribe en Neon
 *
 * Requisitos antes de --apply:
 *   1) Aplicar prisma/migrations/20261119000000_add_image_blobs.
 *   2) Tener los archivos originales en UPLOAD_DIR.
 *   3) PUBLIC_BASE_URL apuntando al backend desplegado.
 *
 * Nunca borra archivos locales ni filas, y nunca sobrescribe una imagen ya
 * migrada: solo rellena columnas nuevas de filas sin binario.
 */
import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import prisma from '../src/lib/prisma.js';
import { env } from '../src/config/env.js';
import { buildStorageKey, getImageMimeType } from '../src/services/storage.service.js';

const apply = process.argv.includes('--apply');
const uploadedPathPattern = /^\/?uploads\/([A-Za-z0-9._-]+)$/;

const filenameFromUrl = (url: string): string | null => {
  try {
    const parsed = new URL(url);
    const match = uploadedPathPattern.exec(parsed.pathname);
    if (!match) return null;
    const filename = match[1];
    if (filename !== path.basename(filename) || !getImageMimeType(filename)) return null;
    return filename;
  } catch {
    return null;
  }
};

// SQL crudo a propósito: to_jsonb funciona antes y después de la migración,
// así el dry-run no depende de que las columnas nuevas ya existan.
const rows = await prisma.$queryRaw<
  Array<{ id: string; url: string; storageKey: string | null; hasData: boolean }>
>`
  SELECT "id", "url",
         to_jsonb("BikeImage")->>'storageKey' AS "storageKey",
         to_jsonb("BikeImage")->>'data' IS NOT NULL AS "hasData"
  FROM "BikeImage" ORDER BY "createdAt" ASC
`;

console.log(`Filas de imagen: ${rows.length}. Modo: ${apply ? 'APPLY' : 'DRY-RUN'}`);

let migrated = 0;
let skipped = 0;

for (const row of rows) {
  if (row.storageKey || row.hasData) {
    skipped++;
    console.log(`[skip] ${row.id}: ya tiene binario/clave, no se sobrescribe`);
    continue;
  }

  const filename = filenameFromUrl(row.url);
  if (!filename) {
    skipped++;
    console.log(`[skip] ${row.id}: URL no migrable (${row.url})`);
    continue;
  }

  const source = path.resolve(env.UPLOAD_DIR, filename);
  let buffer: Buffer;
  try {
    buffer = await fs.readFile(source);
  } catch {
    skipped++;
    console.log(`[skip] ${row.id}: falta el archivo ${source}`);
    continue;
  }

  const mimeType = getImageMimeType(filename);
  if (!mimeType) {
    skipped++;
    console.log(`[skip] ${row.id}: extensión no soportada (${filename})`);
    continue;
  }
  if (buffer.length > Number(env.MAX_FILE_SIZE)) {
    skipped++;
    console.log(`[skip] ${row.id}: ${buffer.length} bytes exceden MAX_FILE_SIZE`);
    continue;
  }

  const storageKey = buildStorageKey();
  const checksum = crypto.createHash('sha256').update(buffer).digest('hex');
  const newUrl = `${env.PUBLIC_BASE_URL.replace(/\/+$/, '')}/api/images/${storageKey}`;

  if (apply) {
    await prisma.bikeImage.update({
      where: { id: row.id },
      data: {
        data: new Uint8Array(buffer),
        mimeType,
        sizeBytes: buffer.length,
        checksum,
        storageKey,
        legacyUrl: row.url,
        url: newUrl,
      },
    });
  }

  migrated++;
  console.log(
    `[${apply ? 'ok' : 'dry'}] ${row.id} -> ${newUrl} (${buffer.length} bytes, sha256 ${checksum.slice(0, 12)}…)`,
  );
}

console.log(`Resumen: ${migrated} migrables, ${skipped} omitidas.`);
if (!apply) {
  console.log('No se escribió en Neon. Para aplicar: npx tsx scripts/migrate-images-to-db.ts --apply');
}
await prisma.$disconnect();
