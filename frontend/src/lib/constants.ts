/**
 * Datos oficiales de CARLIFE.
 * Fuente única de verdad para la información institucional y comercial.
 * ⚠️ No agregar datos que no hayan sido confirmados oficialmente.
 */
export const BUSINESS = {
  name: 'CARLIFE',
  tagline: 'VEHÍCULOS SELECCIONADOS EN YERBA BUENA.',
  slogan: 'Vehículos seleccionados en Yerba Buena.',
  institutional: 'Confianza, Trayectoria y Renovación.',
  activity: 'Venta de autos usados seleccionados.',
  specialty: 'Autos usados seleccionados en Yerba Buena, Tucumán.',
  address: 'Aconquija 1727, Yerba Buena, Tucumán, Argentina',
  addressLink:
    'https://maps.google.com/?q=Aconquija+1727+Yerba+Buena+Tucuman+Argentina',
  mapsEmbed:
    'https://www.google.com/maps?q=Aconquija+1727+Yerba+Buena+Tucuman+Argentina&output=embed',
  phoneDisplay: '381 361-4178',
  whatsappNumber: '5493813614178',
  whatsappGeneralMessage: 'Hola! Quisiera recibir información sobre los autos usados de CARLIFE.',
  whatsappLink: 'https://wa.me/5493813614178',
  shippingLabel: 'Envíos a todo el país',
  financingMessage:
    'Consultá nuestras opciones de financiación mediante créditos prendarios. Te asesoramos para encontrar una alternativa acorde a tus posibilidades.',
} as const;

/** Año modelo máximo ofrecido (incluye la temporada siguiente). */
export const MAX_MODEL_YEAR = 2027;

/** Año modelo mínimo aceptado en el panel y en los filtros del catálogo. */
export const MIN_MODEL_YEAR = 2000;

/** Años disponibles, de más nuevo a más viejo. */
export const MODEL_YEARS = Array.from(
  { length: MAX_MODEL_YEAR - MIN_MODEL_YEAR + 1 },
  (_, index) => MAX_MODEL_YEAR - index,
);

/** Cantidad máxima de fotografías por publicación. */
export const MAX_IMAGES_PER_BIKE = 10;

/** Usos/disciplinas disponibles para clasificar una publicación. */
export const BIKE_USAGES = [
  { value: 'ENDURO_CROSS', label: 'Todoterreno', title: 'TODOTERRENO' },
  { value: 'RUTA', label: 'Ruta', title: 'RUTA' },
] as const;

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
    `Hola, estoy interesado en el auto usado ${label}. ¿Me podrían brindar más información?`
  );
};
