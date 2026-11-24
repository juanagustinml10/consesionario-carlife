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

/** Tipos de vehículo aceptados por el catálogo de CARLIFE. */
export const VEHICLE_CATEGORIES = [
  { value: 'AUTO', label: 'Auto' },
  { value: 'CAMIONETA', label: 'Camioneta' },
  { value: 'SUV', label: 'SUV' },
] as const;

/** Estado del vehículo. CARLIFE comercializa únicamente unidades usadas. */
export const VEHICLE_CONDITIONS = [{ value: 'USADA', label: 'Usado' }] as const;

/** Combustibles disponibles en el panel y en los filtros. */
export const FUEL_TYPES = [
  { value: 'NAFTA', label: 'Nafta' },
  { value: 'DIESEL', label: 'Diésel' },
  { value: 'HIBRIDO', label: 'Híbrido' },
  { value: 'ELECTRICO', label: 'Eléctrico' },
  { value: 'GNC', label: 'GNC' },
  { value: 'OTRO', label: 'Otro' },
] as const;

/** Transmisiones disponibles. */
export const TRANSMISSIONS = [
  { value: 'MANUAL', label: 'Manual' },
  { value: 'AUTOMATICA', label: 'Automática' },
] as const;

/** Tracciones disponibles. X2/X4 son los valores internos de 4x2 y 4x4. */
export const DRIVE_TYPES = [
  { value: 'X2', label: '4x2' },
  { value: 'X4', label: '4x4' },
  { value: 'DELANTERA', label: 'Delantera' },
  { value: 'TRASERA', label: 'Trasera' },
  { value: 'INTEGRAL', label: 'Integral' },
] as const;

/** Equipamiento canónico. Se guarda en `BikeFeature` como clave + valor «Sí». */
export const VEHICLE_EQUIPMENT = [
  { key: 'aire_acondicionado', label: 'Aire acondicionado' },
  { key: 'direccion_asistida', label: 'Dirección asistida' },
  { key: 'levantavidrios_electricos', label: 'Levantavidrios eléctricos' },
  { key: 'cierre_centralizado', label: 'Cierre centralizado' },
  { key: 'airbags', label: 'Airbags' },
  { key: 'abs', label: 'ABS' },
  { key: 'control_estabilidad', label: 'Control de estabilidad' },
  { key: 'control_traccion', label: 'Control de tracción' },
  { key: 'pantalla_multimedia', label: 'Pantalla multimedia' },
  { key: 'bluetooth', label: 'Bluetooth' },
  { key: 'camara_retroceso', label: 'Cámara de retroceso' },
  { key: 'sensores_estacionamiento', label: 'Sensores de estacionamiento' },
  { key: 'velocidad_crucero', label: 'Control de velocidad crucero' },
  { key: 'techo_solar', label: 'Techo solar' },
  { key: 'tapizado_cuero', label: 'Tapizado de cuero' },
  { key: 'asientos_electricos', label: 'Asientos eléctricos' },
  { key: 'sensores_lluvia', label: 'Sensores de lluvia' },
  { key: 'faros_led', label: 'Faros LED' },
  { key: 'isofix', label: 'ISOFIX' },
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
