/* ============================================================================
 * EJERCICIO 2: Definición de Esquemas en components.schemas
 * Este esquema NO es un ejercicio de Zod en sí — se añade para que la
 * implementación real cumpla exactamente el contrato que se documenta en
 * "CreateBookPayload" (components.schemas de openapi.json): el spec promete
 * unas reglas, y el servidor las hace cumplir de verdad.
 * ========================================================================== */

import { z } from "zod";

export const CreateBookSchema = z.object({
  isbn: z.string().trim().min(10, "El ISBN debe tener un formato válido"),
  title: z.string().trim().min(2, "El título debe tener al menos 2 caracteres"),
  authors: z.array(z.string().trim()).min(1, "Debe incluir al menos un autor"),
  publishedYear: z.number().int().min(1450).max(2026),
  availableCopies: z.number().int().min(0).default(1)
});

export type CreateBookInput = z.infer<typeof CreateBookSchema>;
