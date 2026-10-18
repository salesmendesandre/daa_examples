/* ============================================================================
 * Configuración de los JWT (la misma de la Semana 5). Solo hace falta para
 * el EJERCICIO 3: un endpoint protegido real sobre el que probar el 401.
 * ========================================================================== */

export const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta_documind_2026";

export const JWT_EXPIRES_IN = "8h";
