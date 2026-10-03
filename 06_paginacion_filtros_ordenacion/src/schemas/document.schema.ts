/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Contrato de la query string de GET /api/documents
 * El servicio (services/pagination.service.ts) ya sanea page/limit
 * (Number(...) || 1, tope de 50) y aplica la whitelist de ordenación: eso NO
 * se repite aquí. Este schema solo cierra el hueco que el servicio no cubre:
 * Express convierte un parámetro repetido (?tag=a&tag=b) en un ARRAY, y
 * options.tag.toLowerCase() reventaba con un 500 (comprobado). Ahora es un
 * 400 claro.
 * .catch(undefined) en page/limit: "?page=abc" no es un error, se ignora y el
 * servicio aplica su valor por defecto.
 * ========================================================================== */

import { z } from "zod";

const optionalText = (field: string) =>
  z.string({ invalid_type_error: `El parámetro '${field}' debe aparecer una sola vez` }).trim().optional();

export const DocumentsQuerySchema = z.object({
  page: z.coerce.number().optional().catch(undefined),
  limit: z.coerce.number().optional().catch(undefined),
  sort: optionalText("sort"),
  tag: optionalText("tag"),
  search: optionalText("search")
});

export type DocumentsQueryParams = z.infer<typeof DocumentsQuerySchema>;
