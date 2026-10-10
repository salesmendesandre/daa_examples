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

// EJERCICIO 1: segunda barrera, los bytes REALES del archivo (ver
// middlewares/verifyPdfMagicBytes.ts). Con varios adjuntos (Ejercicio 2) se
// indica cuál de ellos es el falso.
export class CorruptedOrSpoofedFileError extends AppError {
  constructor(fileName?: string) {
    const which = fileName ? ` '${fileName}'` : "";
    super(`El archivo adjunto${which} no es un documento PDF legítimo (la firma de cabecera binaria no coincide).`, 400);
    this.name = "CorruptedOrSpoofedFile";
  }
}
