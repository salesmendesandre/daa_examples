/* ============================================================================
 * EJERCICIO 2 (punto 5): Construcción de Filtros Dinámicos de Rango
 * $gte/$lte solo se añaden si el parámetro correspondiente llegó -> nunca se
 * envía "price: {}" vacío a MongoDB (sería un filtro sin efecto, pero sucio).
 *
 * Dos huecos de la solución del libro, comprobados contra MongoDB:
 *  1. El enunciado pide $gte, $lte **e $in**, pero la solución no usaba $in:
 *     "?category=calzado,ropa" devolvía 0 productos. Ahora varios valores
 *     separados por comas se traducen a { $in: [...] }.
 *  2. brand se metía SIN escapar en un $regex: "?brand=[" -> 500 y
 *     "?brand=.*" -> todas las marcas. Ahora cada marca se escapa y se busca
 *     exacta (sin distinguir mayúsculas): ^nike$ con la opción "i".
 * ========================================================================== */

import { CatalogQueryParams } from "../schemas/catalog.schema.js";
import { escapeRegex } from "../utils/escapeRegex.js";

const splitList = (raw: string): string[] =>
  raw.split(",").map(value => value.trim()).filter(value => value.length > 0);

export const buildMongoCatalogFilter = (params: CatalogQueryParams): Record<string, any> => {
  const filter: Record<string, any> = { inStock: true };

  if (params.category) {
    const categories = splitList(params.category);
    filter.category = categories.length > 1 ? { $in: categories } : categories[0];
  }

  if (params.brand) {
    const brands = splitList(params.brand).map(brand => new RegExp(`^${escapeRegex(brand)}$`, "i"));
    filter.brand = brands.length > 1 ? { $in: brands } : brands[0];
  }

  if (params.minPrice !== undefined || params.maxPrice !== undefined) {
    filter.price = {};
    if (params.minPrice !== undefined) {
      filter.price.$gte = params.minPrice;
    }
    if (params.maxPrice !== undefined) {
      filter.price.$lte = params.maxPrice;
    }
  }

  return filter;
};
