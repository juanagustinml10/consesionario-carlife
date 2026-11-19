import type { Request, Response } from 'express';
import prisma from '../lib/prisma.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

type ValidatedRequest = Request & { validated?: unknown };

/**
 * Sirve una imagen almacenada en Neon. Es pública: el <img> del frontend no
 * envía credenciales. Solo se consulta la fila por su clave opaca.
 */
export const getImage = asyncHandler(async (req: Request, res: Response) => {
  const { key } = (req as ValidatedRequest).validated as { key: string };

  const image = await prisma.bikeImage.findFirst({
    where: { storageKey: key },
    select: { data: true, mimeType: true, checksum: true },
  });

  if (!image?.data || !image.mimeType) {
    res.status(404).json({ message: 'Imagen no encontrada', statusCode: 404 });
    return;
  }

  const etag = image.checksum ? `"${image.checksum}"` : null;
  if (etag && req.headers['if-none-match'] === etag) {
    res.status(304).setHeader('ETag', etag).end();
    return;
  }

  const body = Buffer.from(image.data);
  res.setHeader('Content-Type', image.mimeType);
  res.setHeader('Content-Length', body.length.toString());
  res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
  if (etag) res.setHeader('ETag', etag);
  res.send(body);
});
