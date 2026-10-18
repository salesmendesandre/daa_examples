/* ============================================================================
 * Jerarquía de Errores Operacionales (ver capítulo 4, "Validación con Zod y
 * Manejo Centralizado de Errores"). Se reutiliza aquí porque payments.service.ts
 * necesita lanzar errores tipados con su propio código HTTP (400 si amount/
 * currency no son válidos).
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
