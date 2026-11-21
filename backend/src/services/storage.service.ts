import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { env } from '../config/env.js';
import { processUploadedImage } from './image-processing.service.js';

/**
 * `local` es solo para desarrollo. En Vercel el filesystem es efímero:
 * - `db` guarda ambos WebP en Neon (BYTEA) y los sirve /api/images/:key.
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

/** Formatos que Sharp sabe convertir a WebP sin perder información útil. */
const SUPPORTED_INPUT_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);

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
  SUPPORTED_INPUT_MIME_TYPES.has(mimeType.toLowerCase());

export const isAllowedImageFilename = (filename: string): boolean => {
  const mimeType = getImageMimeType(filename);
  return mimeType ? isAllowedImageMimeType(mimeType) : false;
};

export const getImageMimeType = (filename: string): string | null =>
  CONTENT_TYPES[path.extname(filename).toLowerCase()] ?? null;

export const buildStorageKey = (): string => crypto.randomBytes(16).toString('hex');

const WEBP_EXTENSION = '.webp';

const buildFilename = () =>
  `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${WEBP_EXTENSION}`;

const thumbnailFilename = (filename: string) =>
  `${filename.slice(0, -WEBP_EXTENSION.length)}-thumb${WEBP_EXTENSION}`;

/** Resultado de guardar un upload. En `db` incluye ambos binarios y sus metadatos. */
export interface StoredUpload {
  url: string;
  thumbnailUrl?: string;
  data?: Buffer;
  storageKey?: string;
  mimeType?: string;
  sizeBytes?: number;
  checksum?: string;
  thumbnailData?: Buffer;
  thumbnailMimeType?: string;
  thumbnailSizeBytes?: number;
  thumbnailChecksum?: string;
  width?: number;
  height?: number;
}

/**
 * Valida y optimiza el archivo ANTES de guardarlo: el original nunca se
 * persiste. Devuelve la imagen full y su miniatura ya en WebP.
 */
export const saveUploadedFile = async (buffer: Buffer): Promise<StoredUpload> => {
  const maxSize = Number(env.MAX_FILE_SIZE);
  if (buffer.length > maxSize) {
    const err: any = new Error('La imagen supera el tamaño máximo permitido');
    err.statusCode = 413;
    throw err;
  }

  // Sharp valida el formato real (no solo el mime declarado), aplica la
  // orientación EXIF, redimensiona y elimina metadatos.
  const processed = await processUploadedImage(buffer);
  const publicBase = env.PUBLIC_BASE_URL.replace(/\/+$/, '');

  if (env.STORAGE_DRIVER === 'db') {
    const storageKey = buildStorageKey();
    const url = `${publicBase}/api/images/${storageKey}`;
    return {
      url,
      thumbnailUrl: `${url}?variant=thumb`,
      data: processed.data,
      storageKey,
      mimeType: processed.mimeType,
      sizeBytes: processed.sizeBytes,
      checksum: processed.checksum,
      thumbnailData: processed.thumbnail,
      thumbnailMimeType: processed.mimeType,
      thumbnailSizeBytes: processed.thumbnailSizeBytes,
      thumbnailChecksum: processed.thumbnailChecksum,
      width: processed.width,
      height: processed.height,
    };
  }

  const filename = buildFilename();
  const thumbName = thumbnailFilename(filename);

  if (s3) {
    const base = env.STORAGE_PUBLIC_BASE_URL!.replace(/\/+$/, '');
    await Promise.all([
      s3.send(
        new PutObjectCommand({
          Bucket: env.STORAGE_S3_BUCKET,
          Key: filename,
          Body: processed.data,
          ContentType: processed.mimeType,
          CacheControl: 'public, max-age=31536000, immutable',
        }),
      ),
      s3.send(
        new PutObjectCommand({
          Bucket: env.STORAGE_S3_BUCKET,
          Key: thumbName,
          Body: processed.thumbnail,
          ContentType: processed.mimeType,
          CacheControl: 'public, max-age=31536000, immutable',
        }),
      ),
    ]);
    return {
      url: `${base}/${filename}`,
      thumbnailUrl: `${base}/${thumbName}`,
      mimeType: processed.mimeType,
      sizeBytes: processed.sizeBytes,
      checksum: processed.checksum,
      width: processed.width,
      height: processed.height,
    };
  }

  await fs.mkdir(env.UPLOAD_DIR, { recursive: true });
  await Promise.all([
    fs.writeFile(path.join(env.UPLOAD_DIR, filename), processed.data),
    fs.writeFile(path.join(env.UPLOAD_DIR, thumbName), processed.thumbnail),
  ]);
  return {
    url: `${publicBase}/uploads/${filename}`,
    thumbnailUrl: `${publicBase}/uploads/${thumbName}`,
    mimeType: processed.mimeType,
    sizeBytes: processed.sizeBytes,
    checksum: processed.checksum,
    width: processed.width,
    height: processed.height,
  };
};

/** Borra el objeto asociado a una URL guardada. Nunca falla si ya no existe. */
export const deleteUploadedFile = async (url: string): Promise<void> => {
  // Con `db` los binarios se eliminan con la fila de BikeImage; no hay archivo externo.
  if (env.STORAGE_DRIVER === 'db' || /\/api\/images\//.test(url)) return;

  const filename = url.split('?')[0].split('/').filter(Boolean).pop();
  if (!filename) return;

  const keys = new Set([filename]);
  if (filename.endsWith(WEBP_EXTENSION)) keys.add(thumbnailFilename(filename));

  for (const key of keys) {
    if (s3) {
      await s3.send(
        new DeleteObjectCommand({ Bucket: env.STORAGE_S3_BUCKET, Key: key }),
      );
      continue;
    }

    await fs.unlink(path.join(env.UPLOAD_DIR, key)).catch(() => {
      // El archivo ya no está: no es un error para la baja de la publicación.
    });
  }
};
