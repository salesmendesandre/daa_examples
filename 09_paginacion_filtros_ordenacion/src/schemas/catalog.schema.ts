/* ============================================================================
 * EJERCICIO 1 (punto 5): Esquema Zod de Validación para Query String
 * z.coerce.number(): los query params SIEMPRE llegan como string desde la URL
 * (?minPrice=10 -> "10"), coerce los convierte a number antes de validar rango.
 *
 * Añadido a la solución del libro: lista blanca de ordenación. El enunciado
 * de los ejercicios pide "listas blancas" (como ALLOWED_SORT_FIELDS del punto
 * 3), pero la solución aceptaba cualquier sort: "?sort=-campoInventado" se
 * ejecutaba sin más y "?sort=" o "?sort=$where" hacían fallar MongoDB (500).
 * brand y category admiten varios valores separados por comas
 * (?category=calzado,ropa) -> el Ejercicio 2 los traduce a $in.
 * ========================================================================== */

import { z } from "zod";

export const CATALOG_SORT_FIELDS = ["createdAt", "price", "rating", "name"];

export const CatalogQuerySchema = z
  .object({
    page: z.coerce.number().int("La página debe ser un número entero").positive("La página debe ser mayor que 0").default(1),
    limit: z.coerce.number().int("El límite debe ser un número entero").min(1, "El límite mínimo es 1").max(50, "El límite máximo es 50 productos por página").default(12),
    minPrice: z.coerce.number().min(0, "El precio mínimo no puede ser negativo").optional(),
    maxPrice: z.coerce.number().min(0, "El precio máximo no puede ser negativo").optional(),
    brand: z.string().trim().optional(),
    category: z.string().trim().toLowerCase().optional(),
    sort: z
      .string()
      .trim()
      .default("-createdAt")
      .refine(sort => CATALOG_SORT_FIELDS.includes(sort.replace(/^-/, "")), {
        message: `Solo se puede ordenar por: ${CATALOG_SORT_FIELDS.join(", ")} (con "-" delante para orden descendente)`
      })
  })
  .refine(
    data => {
      if (data.minPrice !== undefined && data.maxPrice !== undefined) {
        return data.minPrice <= data.maxPrice;
      }
      return true;
    },
    {
      message: "El precio mínimo (minPrice) no puede ser superior al precio máximo (maxPrice)",
      path: ["minPrice"]
    }
  );

export type CatalogQueryParams = z.infer<typeof CatalogQuerySchema>;
