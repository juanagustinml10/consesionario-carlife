/**
 * Datos oficiales de JAY MOTOS.
 * Fuente única de verdad para la información institucional y comercial.
 * ⚠️ No agregar datos que no hayan sido confirmados oficialmente.
 */
export const BUSINESS = {
  name: 'JAY MOTOS',
  tagline: 'FOR RIDERS, BY RIDERS.',
  activity: 'Venta de motocicletas 0 km y usadas seleccionadas.',
  specialty: 'Concesionaria multimarca · Motos 0 km y usadas seleccionadas.',
  address: 'Corrientes 1440, Tucumán, Argentina',
  addressLink: 'https://maps.google.com/?q=Corrientes+1440+Tucuman+Argentina',
  phoneDisplay: '381 221-2048',
  whatsappNumber: '5493812212048',
  whatsappGeneralMessage: 'Hola! Quisiera recibir información sobre JAY MOTOS.',
  whatsappLink: 'https://wa.me/5493812212048',
  shippingLabel: 'Envíos a todo el país',
} as const;

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
    `Hola! Estoy interesado en la ${label} que vi publicada en JAY MOTOS. ¿Me podrían brindar más información?`
  );
};
