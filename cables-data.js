/**
 * Base de Datos Maestra de Cables de Distribución - Luz del Sur
 * Valores según tabla oficial: Corriente al aire por terna (A)
 */
const CABLES_DATABASE = [
  // Cobre - N2XY
  { tipo: 'N2XY', seccion: 70, concatenar: 'N2XY70', capacidad: 279, material: 'Cobre' },
  { tipo: 'N2XY', seccion: 120, concatenar: 'N2XY120', capacidad: 400, material: 'Cobre' },
  { tipo: 'N2XY', seccion: 185, concatenar: 'N2XY185', capacidad: 533, material: 'Cobre' },
  { tipo: 'N2XY', seccion: 240, concatenar: 'N2XY240', capacidad: 634, material: 'Cobre' },
  { tipo: 'N2XY', seccion: 300, concatenar: 'N2XY300', capacidad: 736, material: 'Cobre' },
  { tipo: 'N2XY', seccion: 500, concatenar: 'N2XY500', capacidad: 998, material: 'Cobre' },
  { tipo: 'N2XY', seccion: 800, concatenar: 'N2XY800', capacidad: 998, material: 'Cobre' },

  // Cobre - NYY
  { tipo: 'NYY', seccion: 70, concatenar: 'NYY70', capacidad: 250, material: 'Cobre' },
  { tipo: 'NYY', seccion: 120, concatenar: 'NYY120', capacidad: 356, material: 'Cobre' },
  { tipo: 'NYY', seccion: 185, concatenar: 'NYY185', capacidad: 470, material: 'Cobre' },
  { tipo: 'NYY', seccion: 240, concatenar: 'NYY240', capacidad: 562, material: 'Cobre' },
  { tipo: 'NYY', seccion: 300, concatenar: 'NYY300', capacidad: 646, material: 'Cobre' },
  { tipo: 'NYY', seccion: 500, concatenar: 'NYY500', capacidad: 895, material: 'Cobre' },
  { tipo: 'NYY', seccion: 800, concatenar: 'NYY800', capacidad: 895, material: 'Cobre' },

  // Aluminio - NA2XY
  { tipo: 'NA2XY', seccion: 95, concatenar: 'NA2XY95', capacidad: 256, material: 'Aluminio' },
  { tipo: 'NA2XY', seccion: 120, concatenar: 'NA2XY120', capacidad: 300, material: 'Aluminio' },
  { tipo: 'NA2XY', seccion: 185, concatenar: 'NA2XY185', capacidad: 403, material: 'Aluminio' },
  { tipo: 'NA2XY', seccion: 240, concatenar: 'NA2XY240', capacidad: 482, material: 'Aluminio' },
  { tipo: 'NA2XY', seccion: 300, concatenar: 'NA2XY300', capacidad: 558, material: 'Aluminio' },
  { tipo: 'NA2XY', seccion: 400, concatenar: 'NA2XY400', capacidad: 662, material: 'Aluminio' },
  { tipo: 'NA2XY', seccion: 500, concatenar: 'NA2XY500', capacidad: 662, material: 'Aluminio' },

  // Aluminio - NAYY
  { tipo: 'NAYY', seccion: 120, concatenar: 'NAYY120', capacidad: 272, material: 'Aluminio' },
  { tipo: 'NAYY', seccion: 185, concatenar: 'NAYY185', capacidad: 363, material: 'Aluminio' },
  { tipo: 'NAYY', seccion: 300, concatenar: 'NAYY300', capacidad: 502, material: 'Aluminio' },
  { tipo: 'NAYY', seccion: 400, concatenar: 'NAYY400', capacidad: 594, material: 'Aluminio' },
  { tipo: 'NAYY', seccion: 500, concatenar: 'NAYY500', capacidad: 691, material: 'Aluminio' },
];

// Tipos de cable disponibles
const CABLE_TYPES = ['N2XY', 'NYY', 'NA2XY', 'NAYY'];

// Agrupación por Material
const CABLES_BY_MATERIAL = {
  Cobre: ['N2XY', 'NYY'],
  Aluminio: ['NA2XY', 'NAYY']
};

// Secciones disponibles por tipo de cable (ordenadas)
const SECTIONS_BY_TYPE = {
  N2XY: [70, 120, 185, 240, 300, 500, 800],
  NYY: [70, 120, 185, 240, 300, 500, 800],
  NA2XY: [95, 120, 185, 240, 300, 400, 500],
  NAYY: [120, 185, 300, 400, 500],
};

// Tabla de Factor de Agrupamiento según cantidad de ternas
const FACTORES_AGRUPAMIENTO = {
  1: 1.0,
  2: 0.8,
  3: 0.7,
  4: 0.65,
  5: 0.65
};

// Potencias estándar de Transformador (kVA)
const POTENCIAS_TRANSFORMADOR = [630, 550, 500, 400, 350, 315, 250, 160, 100, 75, 50];

// Factor de corriente nominal y factor de sobrecarga/auge
const FACTOR_I_NOMINAL_TRAFO = 2.51;
const FACTOR_AUGE_TRAFO = 1.2;

// Calcular capacidad máxima admisible del transformador al auge (A)
function getCapacidadMaxTrafo(potenciaKva) {
  const kva = Number(potenciaKva) || 0;
  if (kva <= 0) return 0;
  return kva * FACTOR_I_NOMINAL_TRAFO * FACTOR_AUGE_TRAFO;
}

// Obtener factor de agrupamiento según número de ternas
function getFactorAgrupamiento(totalTernas) {
  if (totalTernas <= 1) return 1.0;
  if (totalTernas === 2) return 0.8;
  if (totalTernas === 3) return 0.7;
  return 0.65; // Para 4, 5 o más ternas
}

// Función para buscar cable por tipo y sección
function findCable(tipo, seccion) {
  const secNum = Number(seccion);
  return CABLES_DATABASE.find(c => c.tipo === tipo && c.seccion === secNum) || null;
}
