/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Errores de la subida de archivos
 * Mismo patrón que errors/transfer.errors.ts del capítulo de validación: cada
 * subclase fija su código HTTP y su "name" (el campo "error" de la respuesta).
 * ========================================================================== */

import { AppError } from "./app.error.js";

export class MissingFileError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = "MissingFile";
  }
}

// Primera barrera (fileFilter de Multer): el mimetype que DECLARA el cliente.
export class InvalidFileTypeError extends AppError {
  constructor(message: string) {
    super(message, 400);
    this.name = "InvalidFileType";
  }
}

export class PdfProcessingError extends AppError {
  constructor(cause: unknown) {
    super(`Fallo al procesar el PDF: ${cause instanceof Error ? cause.message : String(cause)}`, 500);
    this.name = "PdfProcessingError";
  }
}
