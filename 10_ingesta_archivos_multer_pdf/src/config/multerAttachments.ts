/* ============================================================================
 * EJERCICIO 2: Subida Múltiple con Cuota Agregada
 * .array("attachments", 3): hasta 3 ficheros bajo el MISMO campo de formulario.
 * Cuota más pequeña por archivo (3MB) que el uploadPdf individual (5MB),
 * porque aquí el riesgo de agregado es mayor (hasta 3 archivos por petición).
 * ========================================================================== */

import multer from "multer";
import { InvalidFileTypeError } from "../errors/upload.errors.js";

export const uploadAttachments = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 3 * 1024 * 1024, // 3 MB por archivo
    files: 3
  },
  fileFilter: (_req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new InvalidFileTypeError(`El archivo '${file.originalname}' no es un PDF válido.`));
    }
  }
}).array("attachments", 3);
