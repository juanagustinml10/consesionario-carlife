import * as React from 'react';

interface ImagePlaceholderProps {
  width?: number | string;
  height?: number | string;
  label?: string;
  className?: string;
}

/**
 * Imagen de marcador de posición para datos de prueba.
 * Sustituir por fotografías reales de las motos al integrar el módulo de uploads.
 */
export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  width = 400,
  height = 300,
  label = 'Imagen de prueba',
  className,
}) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <text x="50%" y="50%" font-family="system-ui, sans-serif" font-size="16" fill="#9ca3af" text-anchor="middle" dominant-baseline="middle">${label}</text>
    </svg>
  `;
  const src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;

  return (
    <img
      src={src}
      alt={label}
      width={width}
      height={height}
      className={className}
      style={{ backgroundColor: '#f3f4f6', color: '#9ca3af' }}
    />
  );
};
