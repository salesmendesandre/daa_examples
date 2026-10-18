/* ============================================================================
 * CONTENIDO — Jerarquía de Errores Operacionales
 * Operacional (4xx, previsible: dato inválido, recurso no encontrado) vs.
 * de Programación (500, bug no anticipado). isOperational distingue ambos
 * para que el errorHandler decida si ocultar o no la traza interna.
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
