import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

type ValidatedRequest = Request & { validated?: unknown };

/**
 * Sirve una imagen almacenada en Neon. Es pública: el <img> del frontend no
 * envía credenciales. Solo se consulta la fila por su clave opaca.
 *
 * `?variant=thumb` devuelve la miniatura WebP (~500 px). Si la fila es legacy
 * y no tiene miniatura, cae a la imagen completa: nada se rompe en la migración.
 */
export const getImage = asyncHandler(async (req: Request, res: Response) => {
  const { key } = (req as ValidatedRequest).validated as { key: string };
  const wantsThumb = req.query.variant === 'thumb';

  const image = await prisma.bikeImage.findFirst({
    where: { storageKey: key },
    select: {
      data: true,
      mimeType: true,
      checksum: true,
      thumbnailData: true,
      thumbnailMimeType: true,
      thumbnailChecksum: true,
    },
  });

  const useThumb =
    wantsThumb && Boolean(image?.thumbnailData && image?.thumbnailMimeType);

  const bodyBytes = useThumb ? image?.thumbnailData : image?.data;
  const mimeType = useThumb ? image?.thumbnailMimeType : image?.mimeType;
  const checksum = useThumb ? image?.thumbnailChecksum : image?.checksum;

  if (!bodyBytes || !mimeType) {
    res.status(404).json({ message: 'Imagen no encontrada', statusCode: 404 });
    return;
  }

  const etag = checksum ? `"${checksum}"` : null;
  if (etag && req.headers['if-none-match'] === etag) {
    res.status(304).setHeader('ETag', etag).end();
    return;
  }

  const body = Buffer.from(bodyBytes);
  res.setHeader('Content-Type', mimeType);
  res.setHeader('Content-Length', body.length.toString());
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  if (etag) res.setHeader('ETag', etag);
  res.send(body);
});
