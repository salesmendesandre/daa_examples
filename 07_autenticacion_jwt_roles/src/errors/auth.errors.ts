/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Errores de Autenticación (401) y Autorización (403)
 * Mismo patrón que errors/transfer.errors.ts del capítulo de validación: cada
 * subclase fija su propio código HTTP y su "name" (el globalErrorHandler lo
 * devuelve en el campo "error"). La distinción 401 vs 403 ES parte del
 * contenido:
 *   401 -> "no sé quién eres"           (AuthN: falta el token o no es válido)
 *   403 -> "sé quién eres, pero no puedes" (AuthZ: tu rol no tiene permiso)
 * ========================================================================== */

import { AppError } from "./app.error.js";

export class UnauthorizedError extends AppError {
  constructor(message: string = "Se requiere cabecera 'Authorization: Bearer <token>'.") {
    super(message, 401);
    this.name = "Unauthorized";
  }
}

export class InvalidTokenError extends AppError {
  constructor() {
    super("Token inválido o expirado.", 401);
    this.name = "InvalidToken";
  }
}

export class InvalidCredentialsError extends AppError {
  constructor() {
    super("Credenciales inválidas", 401);
    this.name = "InvalidCredentials";
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = "No dispone de privilegios suficientes para ejecutar esta acción.") {
    super(message, 403);
    this.name = "Forbidden";
  }
}

export class EmailAlreadyRegisteredError extends AppError {
  constructor() {
    super("El correo electrónico ya está registrado", 409);
    this.name = "EmailAlreadyRegistered";
  }
}

// EJERCICIO 3: la contraseña no cumple la política de seguridad.
export class WeakPasswordError extends AppError {
  constructor() {
    super(
      "La contraseña debe contener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial.",
      400
    );
    this.name = "WeakPassword";
  }
}
