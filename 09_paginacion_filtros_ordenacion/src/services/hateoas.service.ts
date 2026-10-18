/* ============================================================================
 * EJERCICIO 3 (punto 5): Enlaces Hipermedia HATEOAS Dinámicos
 * Se reconstruye la URL con la API nativa `URL` (no concatenando strings a
 * mano) para heredar automáticamente cualquier otro query param presente en
 * la petición original (ej. category, brand) al generar first/prev/next/last.
 * (La interfaz HateoasLinks vive en types/pagination.types.ts.)
 * ========================================================================== */

import { HateoasLinks } from "../types/pagination.types.js";

export const buildPaginationLinks = (
  baseUrl: string,
  page: number,
  limit: number,
  totalPages: number
): HateoasLinks => {
  const url = new URL(baseUrl, "http://localhost");

  const buildUrl = (p: number) => {
    url.searchParams.set("page", String(p));
    url.searchParams.set("limit", String(limit));
    return `${url.pathname}${url.search}`;
  };

  return {
    first: buildUrl(1),
    prev: page > 1 ? buildUrl(page - 1) : null,
    next: page < totalPages ? buildUrl(page + 1) : null,
    last: buildUrl(Math.max(1, totalPages))
  };
};
