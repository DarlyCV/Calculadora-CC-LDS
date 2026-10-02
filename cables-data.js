/**
 * Base de Datos Maestra de Cables de Distribución - Luz del Sur
 * Extraído de la matriz oficial de conductores
 */
const CABLES_DATABASE = [
  // Cobre - NYY
  { tipo: 'NYY', seccion: 16, concatenar: 'NYY16', capacidad: 96, material: 'Cobre' },
  { tipo: 'NYY', seccion: 35, concatenar: 'NYY35', capacidad: 145, material: 'Cobre' },
  { tipo: 'NYY', seccion: 70, concatenar: 'NYY70', capacidad: 211, material: 'Cobre' },
  { tipo: 'NYY', seccion: 120, concatenar: 'NYY120', capacidad: 286, material: 'Cobre' },
  { tipo: 'NYY', seccion: 185, concatenar: 'NYY185', capacidad: 363, material: 'Cobre' },
  { tipo: 'NYY', seccion: 240, concatenar: 'NYY240', capacidad: 471, material: 'Cobre' },
  { tipo: 'NYY', seccion: 300, concatenar: 'NYY300', capacidad: 471, material: 'Cobre' },
  { tipo: 'NYY', seccion: 500, concatenar: 'NYY500', capacidad: 594, material: 'Cobre' },
  { tipo: 'NYY', seccion: 800, concatenar: 'NYY800', capacidad: 950, material: 'Cobre' },

  // Aluminio - NA2XY
  { tipo: 'NA2XY', seccion: 70, concatenar: 'NA2XY70', capacidad: 212, material: 'Aluminio' },
  { tipo: 'NA2XY', seccion: 95, concatenar: 'NA2XY95', capacidad: 254, material: 'Aluminio' },
  { tipo: 'NA2XY', seccion: 120, concatenar: 'NA2XY120', capacidad: 289, material: 'Aluminio' },
  { tipo: 'NA2XY', seccion: 185, concatenar: 'NA2XY185', capacidad: 368, material: 'Aluminio' },
  { tipo: 'NA2XY', seccion: 240, concatenar: 'NA2XY240', capacidad: 427, material: 'Aluminio' },
  { tipo: 'NA2XY', seccion: 300, concatenar: 'NA2XY300', capacidad: 483, material: 'Aluminio' },
  { tipo: 'NA2XY', seccion: 400, concatenar: 'NA2XY400', capacidad: 553, material: 'Aluminio' },
  { tipo: 'NA2XY', seccion: 500, concatenar: 'NA2XY500', capacidad: 629, material: 'Aluminio' },

  // Cobre - N2XY
  { tipo: 'N2XY', seccion: 16, concatenar: 'N2XY16', capacidad: 123, material: 'Cobre' },
  { tipo: 'N2XY', seccion: 35, concatenar: 'N2XY35', capacidad: 190, material: 'Cobre' },
  { tipo: 'N2XY', seccion: 70, concatenar: 'N2XY70', capacidad: 275, material: 'Cobre' },
  { tipo: 'N2XY', seccion: 120, concatenar: 'N2XY120', capacidad: 375, material: 'Cobre' },
  { tipo: 'N2XY', seccion: 185, concatenar: 'N2XY185', capacidad: 475, material: 'Cobre' },
  { tipo: 'N2XY', seccion: 240, concatenar: 'N2XY240', capacidad: 549, material: 'Cobre' },
  { tipo: 'N2XY', seccion: 300, concatenar: 'N2XY300', capacidad: 622, material: 'Cobre' },
  { tipo: 'N2XY', seccion: 500, concatenar: 'N2XY500', capacidad: 790, material: 'Cobre' },

  // Aluminio - NAYY
  { tipo: 'NAYY', seccion: 70, concatenar: 'NAYY70', capacidad: 161, material: 'Aluminio' },
  { tipo: 'NAYY', seccion: 95, concatenar: 'NAYY95', capacidad: 193, material: 'Aluminio' },
  { tipo: 'NAYY', seccion: 120, concatenar: 'NAYY120', capacidad: 221, material: 'Aluminio' },
  { tipo: 'NAYY', seccion: 185, concatenar: 'NAYY185', capacidad: 281, material: 'Aluminio' },
  { tipo: 'NAYY', seccion: 300, concatenar: 'NAYY300', capacidad: 370, material: 'Aluminio' },
  { tipo: 'NAYY', seccion: 400, concatenar: 'NAYY400', capacidad: 493, material: 'Aluminio' },
  { tipo: 'NAYY', seccion: 500, concatenar: 'NAYY500', capacidad: 485, material: 'Aluminio' },
];

// Tipos de cable disponibles
const CABLE_TYPES = ['NYY', 'NA2XY', 'N2XY', 'NAYY'];

// Agrupación por Material
const CABLES_BY_MATERIAL = {
  Cobre: ['NYY', 'N2XY'],
  Aluminio: ['NA2XY', 'NAYY']
};

// Secciones disponibles por tipo de cable
const SECTIONS_BY_TYPE = {
  NYY: [16, 35, 70, 120, 185, 240, 300, 500, 800],
  NA2XY: [70, 95, 120, 185, 240, 300, 400, 500],
  N2XY: [16, 35, 70, 120, 185, 240, 300, 500],
  NAYY: [70, 95, 120, 185, 300, 400, 500],
};

// Función para buscar cable por tipo y sección
function findCable(tipo, seccion) {
  const secNum = Number(seccion);
  return CABLES_DATABASE.find(c => c.tipo === tipo && c.seccion === secNum) || null;
}
