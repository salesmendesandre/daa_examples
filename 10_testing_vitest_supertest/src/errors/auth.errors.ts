/* ============================================================================
 * Errores 401 de la Semana 5 (solo los dos que necesita el EJERCICIO 3).
 * Su "name" es el campo "error" de la respuesta: el test del ejercicio
 * comprueba res.body.error === "InvalidToken".
 * ========================================================================== */

import { AppError } from "./app.error.js";

export class UnauthorizedError extends AppError {
  constructor() {
    super("Se requiere cabecera 'Authorization: Bearer <token>'.", 401);
    this.name = "Unauthorized";
  }
}

export class InvalidTokenError extends AppError {
  constructor() {
    super("Token inválido o expirado.", 401);
    this.name = "InvalidToken";
  }
}
