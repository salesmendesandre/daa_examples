/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Configuración de los JWT
 * JWT_SECRET es la clave con la que se FIRMAN (y verifican) todos los tokens:
 * quien la conozca puede fabricar un token válido con cualquier rol, así que
 * en producción SIEMPRE viene de una variable de entorno. El valor por
 * defecto existe solo para poder arrancar el proyecto en clase sin .env.
 * ========================================================================== */

export const JWT_SECRET = process.env.JWT_SECRET || "clave_secreta_documind_2026";

// Caducidad del token: pasado este tiempo, jwt.verify lo rechaza (401).
export const JWT_EXPIRES_IN = "8h";
