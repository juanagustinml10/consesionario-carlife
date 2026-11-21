import crypto from 'node:crypto';
import sharp from 'sharp';

/** Límites de salida. La miniatura se usa en tarjetas y listados. */
export const MAX_IMAGE_DIMENSION = 1600;
export const THUMBNAIL_DIMENSION = 500;
export const WEBP_QUALITY = 82;

/** Guardia contra bombas de descompresión (≈100 megapíxeles). */
const MAX_INPUT_PIXELS = 100_000_000;
const ALLOWED_INPUT_FORMATS = ['jpeg', 'png', 'webp'];

const httpError = (message: string, statusCode: number) =>
  Object.assign(new Error(message), { statusCode });

export interface ProcessedImage {
  /** Imagen principal WebP, como máximo 1600x1600. */
  data: Buffer;
  /** Miniatura WebP, como máximo 500x500. */
  thumbnail: Buffer;
  mimeType: 'image/webp';
  sizeBytes: number;
  thumbnailSizeBytes: number;
  checksum: string;
  thumbnailChecksum: string;
  width: number;
  height: number;
}

/**
 * Valida, corrige la orientación EXIF, elimina metadatos y genera las dos
 * variantes WebP. Nunca conserva el original: el buffer devuelto ya es el
 * resultado optimizado (no se guarda el archivo original).
 */
export const processUploadedImage = async (buffer: Buffer): Promise<ProcessedImage> => {
  if (!Buffer.isBuffer(buffer) || buffer.length === 0) {
    throw httpError('Archivo de imagen vacío', 400);
  }

  const pipeline = () =>
    sharp(buffer, { failOn: 'error', limitInputPixels: MAX_INPUT_PIXELS }).rotate();

  const metadata = await pipeline().metadata();
  if (!metadata.width || !metadata.height || metadata.width < 1 || metadata.height < 1) {
    throw httpError('No se pudieron leer las dimensiones de la imagen', 400);
  }
  if (!metadata.format || !ALLOWED_INPUT_FORMATS.includes(metadata.format)) {
    throw httpError('Formato no soportado. Subí una imagen JPG, PNG o WebP.', 400);
  }

  // `rotate()` aplica el tag EXIF antes de redimensionar; WebP no conserva EXIF.
  const full = await pipeline()
    .resize(MAX_IMAGE_DIMENSION, MAX_IMAGE_DIMENSION, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer({ resolveWithObject: true });

  const thumb = await pipeline()
    .resize(THUMBNAIL_DIMENSION, THUMBNAIL_DIMENSION, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ quality: WEBP_QUALITY, effort: 4 })
    .toBuffer({ resolveWithObject: true });

  return {
    data: full.data,
    thumbnail: thumb.data,
    mimeType: 'image/webp',
    sizeBytes: full.info.size,
    thumbnailSizeBytes: thumb.info.size,
    checksum: crypto.createHash('sha256').update(full.data).digest('hex'),
    thumbnailChecksum: crypto.createHash('sha256').update(thumb.data).digest('hex'),
    width: full.info.width,
    height: full.info.height,
  };
};
