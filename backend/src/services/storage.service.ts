import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { env } from '../config/env.js';

/**
 * `local` es solo para desarrollo. En Vercel el filesystem es efímero:
 * - `db` guarda los bytes en Neon (BYTEA) y los sirve /api/images/:key.
 * - `s3` conserva el driver anterior con un bucket S3-compatible.
 */
const s3 =
  env.STORAGE_DRIVER === 's3'
    ? new S3Client({
        forcePathStyle: true, // requerido por Neon Object Storage y Cloudflare R2
        region: env.AWS_REGION,
        endpoint: env.AWS_ENDPOINT_URL_S3,
        credentials: {
          accessKeyId: env.AWS_ACCESS_KEY_ID!,
          secretAccessKey: env.AWS_SECRET_ACCESS_KEY!,
        },
      })
    : null;

const CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.gif': 'image/gif',
  '.avif': 'image/avif',
};

/** Solo formatos raster: no servimos SVG con scripts desde el origin del API. */
export const isAllowedImageMimeType = (mimeType: string): boolean =>
  Object.values(CONTENT_TYPES).includes(mimeType);

export const getImageMimeType = (filename: string): string | null =>
  CONTENT_TYPES[path.extname(filename).toLowerCase()] ?? null;

export const buildStorageKey = (): string => crypto.randomBytes(16).toString('hex');

const buildFilename = (originalName: string) => {
  const extension = path.extname(originalName).toLowerCase();
  return `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${extension}`;
};

/** Resultado de guardar un upload. En `db` incluye los bytes y sus metadatos. */
export interface StoredUpload {
  url: string;
  data?: Buffer;
  storageKey?: string;
  mimeType?: string;
  sizeBytes?: number;
  checksum?: string;
}

/** Guarda el archivo y devuelve la URL pública con la que se guardará en la BD. */
export const saveUploadedFile = async (
  buffer: Buffer,
  originalName: string,
  contentType?: string,
): Promise<StoredUpload> => {
  const maxSize = Number(env.MAX_FILE_SIZE);
  if (buffer.length > maxSize) {
    const err: any = new Error('La imagen supera el tamaño máximo permitido');
    err.statusCode = 413;
    throw err;
  }

  const filename = buildFilename(originalName);
  // El mimetype del navegador es orientativo; la extensión manda si no es raster.
  const mimeType =
    (contentType && isAllowedImageMimeType(contentType) ? contentType : null) ??
    getImageMimeType(filename);
  if (!mimeType) {
    const err: any = new Error('Formato de imagen no soportado');
    err.statusCode = 400;
    throw err;
  }

  if (env.STORAGE_DRIVER === 'db') {
    const storageKey = buildStorageKey();
    return {
      url: `${env.PUBLIC_BASE_URL.replace(/\/+$/, '')}/api/images/${storageKey}`,
      data: buffer,
      storageKey,
      mimeType,
      sizeBytes: buffer.length,
      checksum: crypto.createHash('sha256').update(buffer).digest('hex'),
    };
  }

  if (s3) {
    await s3.send(
      new PutObjectCommand({
        Bucket: env.STORAGE_S3_BUCKET,
        Key: filename,
        Body: buffer,
        ContentType: mimeType,
        CacheControl: 'public, max-age=31536000, immutable',
      }),
    );
    return { url: `${env.STORAGE_PUBLIC_BASE_URL!.replace(/\/+$/, '')}/${filename}` };
  }

  await fs.mkdir(env.UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(env.UPLOAD_DIR, filename), buffer);
  return { url: `${env.PUBLIC_BASE_URL.replace(/\/+$/, '')}/uploads/${filename}` };
};

/** Borra el objeto asociado a una URL guardada. Nunca falla si ya no existe. */
export const deleteUploadedFile = async (url: string): Promise<void> => {
  // Con `db` el binario se elimina con la fila de BikeImage; no hay archivo externo.
  if (env.STORAGE_DRIVER === 'db' || /\/api\/images\//.test(url)) return;

  const filename = url.split('?')[0].split('/').filter(Boolean).pop();
  if (!filename) return;

  if (s3) {
    await s3.send(
      new DeleteObjectCommand({ Bucket: env.STORAGE_S3_BUCKET, Key: filename }),
    );
    return;
  }

  await fs.unlink(path.join(env.UPLOAD_DIR, filename)).catch(() => {
    // El archivo ya no está: no es un error para la baja de la publicación.
  });
};
