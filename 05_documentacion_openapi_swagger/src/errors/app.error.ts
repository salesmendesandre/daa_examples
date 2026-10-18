/* ============================================================================
 * Jerarquía de Errores Operacionales (ver capítulo 4, "Validación con Zod y
 * Manejo Centralizado de Errores"). Se reutiliza aquí porque el Ejercicio 1
 * de este capítulo (GET /books/{isbn} -> 404) y el Ejercicio 3 (bearerAuth ->
 * 401) necesitan lanzar errores tipados con su propio código HTTP.
 * ========================================================================== */

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 400, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    // Preservar la jerarquía de prototipos en TypeScript al extender Error:
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}
