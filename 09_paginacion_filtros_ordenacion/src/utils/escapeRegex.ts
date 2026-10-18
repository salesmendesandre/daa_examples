/* ============================================================================
 * Función pura (mismo papel que utils/ en la semana 5): escapa los caracteres
 * especiales de una expresión regular.
 * Los textos que llegan por la URL (?search=...) acaban dentro de un $regex
 * de MongoDB: sin escaparlos, "?search=[" hace fallar la consulta (500) y
 * "?search=.*" deja de ser un filtro (coincide con todo).
 * Lo usa services/pagination.service.ts.
 * ========================================================================== */

export const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
