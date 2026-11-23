import * as React from 'react';

interface ImagePlaceholderProps {
  width?: number | string;
  height?: number | string;
  label?: string;
  className?: string;
}

/** Marcador de posición dentro de la paleta blanco / rojo / negro de CARLIFE. */
export const ImagePlaceholder: React.FC<ImagePlaceholderProps> = ({
  width = 400,
  height = 300,
  label = 'Imagen no disponible',
  className,
}) => {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
      <rect width="100%" height="100%" fill="#0a0a0a"/>
      <rect x="0.5" y="0.5" width="99%" height="99%" fill="none" stroke="#e91311"/>
      <text x="50%" y="50%" font-family="Inter, system-ui, sans-serif" font-size="14" letter-spacing="2" fill="#ffffff" text-anchor="middle" dominant-baseline="middle">${label.toUpperCase()}</text>
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
      style={{ backgroundColor: '#111111' }}
    />
  );
};
