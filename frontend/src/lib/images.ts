/**
 * Devuelve la URL de la miniatura (~500 px) de una foto de moto.
 *
 * - Con STORAGE_DRIVER=db la API sirve `/api/images/:key?variant=thumb`.
 * - Con local/S3 el archivo se guardó como `<nombre>-thumb.webp`.
 * - Las imágenes legacy no tienen miniatura: se sirve la original, sin cambios.
 */
export const getThumbnailUrl = (url: string): string => {
  if (!url) return url;

  if (url.includes('/api/images/')) {
    return url.includes('?') ? `${url}&variant=thumb` : `${url}?variant=thumb`;
  }

  const [pathname, query] = url.split('?');
  if (!pathname.endsWith('.webp')) return url;

  const thumb = `${pathname.slice(0, -'.webp'.length)}-thumb.webp`;
  return query ? `${thumb}?${query}` : thumb;
};
