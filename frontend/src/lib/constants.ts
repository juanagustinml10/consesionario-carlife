/**
 * Datos oficiales de SF MOTOS.
 * Fuente única de verdad para la información institucional y comercial.
 * ⚠️ No agregar datos que no hayan sido confirmados oficialmente.
 */
export const BUSINESS = {
  name: 'SF MOTOS',
  tagline: 'POTENCIA EN CADA ARRANQUE.',
  activity: 'Venta de motocicletas 0 km y usadas.',
  specialty: 'Motocicletas 0 km y usadas en Juan B. Alberdi, Tucumán.',
  address: '9 de Julio 119, Juan B. Alberdi, Tucumán, Argentina',
  addressLink:
    'https://maps.google.com/?q=9+de+Julio+119+Juan+B.+Alberdi+Tucuman+Argentina',
  phoneDisplay: '381 201-1613',
  whatsappNumber: '5493812011613',
  whatsappGeneralMessage: 'Hola! Quisiera recibir información sobre las motos de SF MOTOS.',
  whatsappLink: 'https://wa.me/5493812011613',
  shippingLabel: 'Consultá por envíos',
} as const;

/** Año modelo máximo ofrecido (incluye la temporada siguiente). */
export const MAX_MODEL_YEAR = 2027;

export const buildWhatsAppLink = (message: string) =>
  `https://wa.me/${BUSINESS.whatsappNumber}?text=${encodeURIComponent(message)}`;

export const buildBikeWhatsAppLink = (bike: {
  brand?: { name: string } | null;
  model?: string;
  title: string;
  year?: number;
}) => {
  const label = bike.brand?.name && bike.model ? `${bike.brand.name} ${bike.model}` : bike.title;
  return buildWhatsAppLink(
    `Hola! Estoy interesado en la ${label} que vi publicada en SF MOTOS. ¿Me podrían brindar más información?`
  );
};
