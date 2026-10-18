/* ============================================================================
 * EJERCICIO 3: Contrato de los campos de TEXTO del upload-cv
 * En multipart/form-data, Multer deja los ficheros en req.file y los campos
 * de texto en req.body, pero SIEMPRE como string ("TypeScript,Node,Docker").
 * Zod los convierte aquí en el tipo que de verdad queremos (string[]).
 * ========================================================================== */

import { z } from "zod";

export const DEFAULT_EXPECTED_SKILLS = ["typescript", "node", "express", "mongodb", "docker", "react"];

export const UploadCvSchema = z
  .object({
    skills: z
      .string()
      .optional()
      .transform(raw =>
        raw && raw.trim() !== ""
          ? raw.split(",").map(s => s.trim()).filter(s => s.length > 0)
          : DEFAULT_EXPECTED_SKILLS
      )
  })
  // Si la petición ni siquiera es multipart, Multer no rellena req.body
  // (undefined) -> se trata como "sin campos" y el controlador responderá
  // con un MissingFileError claro en vez de un error de validación confuso.
  .default({});

export type UploadCvDTO = z.infer<typeof UploadCvSchema>;
