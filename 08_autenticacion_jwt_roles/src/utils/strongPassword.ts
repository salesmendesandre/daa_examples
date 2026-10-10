/* ============================================================================
 * EJERCICIO 3 — La regla de "contraseña segura" con Regex
 * Al menos 8 caracteres, una mayúscula, una minúscula, un número y un
 * carácter especial. Es una función PURA (ni bcrypt, ni Express, ni errores
 * HTTP): solo responde sí/no, así que se puede reutilizar en cualquier sitio.
 * La usa services/password.service.ts ANTES de invertir CPU en bcrypt(12).
 * ========================================================================== */

export const STRONG_PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

export const isStrongPassword = (password: string): boolean => STRONG_PASSWORD_REGEX.test(password);
