import crypto from 'node:crypto';
import fs from 'node:fs/promises';
import path from 'node:path';
import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { env } from '../config/env.js';

/**
 * Las fotos se guardan en disco solo en desarrollo. En Vercel el filesystem es
 * efímero, así que STORAGE_DRIVER=s3 obliga a usar un bucket S3-compatible.
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

const buildFilename = (originalName: string) => {
  const extension = path.extname(originalName).toLowerCase();
  return `${Date.now()}-${crypto.randomBytes(4).toString('hex')}${extension}`;
};

/** Devuelve la URL pública con la que se guardará la imagen en la BD. */
export const saveUploadedFile = async (
  buffer: Buffer,
  originalName: string,
  contentType?: string,
): Promise<string> => {
  const filename = buildFilename(originalName);
  const mimeType = contentType ?? CONTENT_TYPES[path.extname(filename).toLowerCase()] ?? 'application/octet-stream';

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
    return `${env.STORAGE_PUBLIC_BASE_URL!.replace(/\/+$/, '')}/${filename}`;
  }

  await fs.mkdir(env.UPLOAD_DIR, { recursive: true });
  await fs.writeFile(path.join(env.UPLOAD_DIR, filename), buffer);
  return `${env.PUBLIC_BASE_URL.replace(/\/+$/, '')}/uploads/${filename}`;
};

/** Borra el objeto asociado a una URL guardada. Nunca falla si ya no existe. */
export const deleteUploadedFile = async (url: string): Promise<void> => {
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
