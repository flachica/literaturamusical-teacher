/**
 * Utilidades para el Motor Dinámico de Retos e Interacción Trivia (v0.5.2)
 */

/**
 * Baraja un array utilizando el algoritmo Fisher-Yates (sin mutar el original)
 */
export function shuffleArray(array) {
  if (!Array.isArray(array) || array.length <= 1) return array ? [...array] : [];
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Prepara y baraja las opciones de una pregunta de comprensión leída desde un plugin.
 * Mantiene intacta la marca `correcta: true` en la opción original.
 */
export function prepareQuizOptions(opciones) {
  if (!Array.isArray(opciones) || opciones.length === 0) return [];
  // Barajar opciones
  return shuffleArray(opciones);
}
