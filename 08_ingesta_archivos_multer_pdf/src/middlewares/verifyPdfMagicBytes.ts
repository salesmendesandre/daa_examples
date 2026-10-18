/* ============================================================================
 * EJERCICIO 1: Comprobación de Magic Bytes en Memoria
 * Se ejecuta DESPUÉS de multer (necesita el buffer ya en memoria) y ANTES
 * del controlador. El fileFilter de Multer solo mira el mimetype que el
 * CLIENTE declara (falsificable); esto mira los bytes REALES del archivo,
 * con isRealPdfBuffer (services/pdf.service.ts, CONTENIDO).
 *
 * Sirve para los dos casos de Multer:
 *  - .single("cv")          -> req.file          (Ejercicio 1)
 *  - .array("attachments")  -> req.files (array) (Ejercicio 2: hay que
 *    comprobar que TODOS los adjuntos son PDFs legítimos, el fileFilter
 *    solo no basta: un falso con mimetype application/pdf pasaba)
 * ========================================================================== */

import { Request, Response, NextFunction } from "express";
import { isRealPdfBuffer } from "../services/pdf.service.js";
import { CorruptedOrSpoofedFileError } from "../errors/upload.errors.js";

export const verifyPdfMagicBytes = (req: Request, _res: Response, next: NextFunction) => {
  if (req.file && !isRealPdfBuffer(req.file.buffer)) {
    return next(new CorruptedOrSpoofedFileError());
  }

  if (Array.isArray(req.files)) {
    const spoofed = req.files.find(file => !isRealPdfBuffer(file.buffer));
    if (spoofed) {
      return next(new CorruptedOrSpoofedFileError(spoofed.originalname));
    }
  }

  // Sin archivos no hay nada que comprobar: el controlador responderá MissingFile.
  next();
};
