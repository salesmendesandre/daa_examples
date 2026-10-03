/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Contrato de POST /api/documents
 * Reglas equivalentes a un `if (!title || title.length < 3 || !author)`, pero
 * declaradas con Zod: además rechaza tipos incorrectos (con el if a mano,
 * {"author": 5} se guardaba tal cual, comprobado).
 * El test de integración espera error === "ValidationError": es justo lo que
 * devuelve el globalErrorHandler para un ZodError.
 * ========================================================================== */

import { z } from "zod";

export const CreateDocumentSchema = z.object({
  title: z
    .string({ required_error: "El título es obligatorio", invalid_type_error: "El título debe ser un texto" })
    .trim()
    .min(3, "El título debe tener al menos 3 caracteres"),
  author: z
    .string({ required_error: "El autor es obligatorio", invalid_type_error: "El autor debe ser un texto" })
    .trim()
    .min(1, "El autor es obligatorio")
});

export type CreateDocumentDTO = z.infer<typeof CreateDocumentSchema>;
