/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Configuración del Motor de Carga con Multer
 * memoryStorage: el archivo llega como Buffer en RAM, listo para procesar
 * (pdf-parse) sin tocar disco. limits corta ataques de DoS por tamaño;
 * fileFilter es la PRIMERA barrera (mimetype declarado por el cliente), pero
 * no mira el contenido real del archivo.
 * Los errores de fileFilter y de limits llegan al globalErrorHandler
 * (middlewares/error.middleware.ts), que los convierte en un 400.
 * ========================================================================== */

import multer from "multer";
import { InvalidFileTypeError } from "../errors/upload.errors.js";

const storage = multer.memoryStorage();

export const uploadPdf = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB por archivo
    files: 1
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new InvalidFileTypeError("Formato no admitido: Solo se permiten documentos PDF (application/pdf)"));
    }
  }
});
