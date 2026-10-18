/* ============================================================================
 * CAPA DE SERVICIO — Catálogo E-commerce (EJERCICIOS, punto 5)
 * Une los 3 ejercicios: recibe los parámetros ya validados por
 * CatalogQuerySchema (Ej.1, en la ruta) -> construye el filtro (Ej.2) ->
 * pagina con el mismo patrón Promise.all del contenido -> añade los enlaces
 * HATEOAS (Ej.3). Nada de req/res aquí: la URL original llega como string.
 * ========================================================================== */

import { CatalogProductModel } from "../models/catalogProduct.model.js";
import { CatalogQueryParams } from "../schemas/catalog.schema.js";
import { PaginatedResultWithLinks } from "../types/pagination.types.js";
import { buildMongoCatalogFilter } from "./catalogFilter.service.js";
import { buildPaginationLinks } from "./hateoas.service.js";

export class CatalogService {
  async getPaginatedCatalog(params: CatalogQueryParams, originalUrl: string): Promise<PaginatedResultWithLinks<any>> {
    const filter = buildMongoCatalogFilter(params);

    const skip = (params.page - 1) * params.limit;
    // "sort" ya viene filtrado por la whitelist de CatalogQuerySchema.
    const isDesc = params.sort.startsWith("-");
    const sortField = isDesc ? params.sort.slice(1) : params.sort;

    const [data, total] = await Promise.all([
      CatalogProductModel.find(filter)
        .sort({ [sortField]: isDesc ? -1 : 1 })
        .skip(skip)
        .limit(params.limit)
        .lean()
        .exec(),
      CatalogProductModel.countDocuments(filter).exec()
    ]);

    // "|| 1": sin resultados, Math.ceil(0 / limit) daría 0 páginas y el
    // enlace "last" apuntaría a la página 0.
    const totalPages = Math.ceil(total / params.limit) || 1;

    return {
      data,
      meta: {
        total,
        page: params.page,
        limit: params.limit,
        totalPages,
        hasNextPage: params.page < totalPages,
        hasPrevPage: params.page > 1
      },
      links: buildPaginationLinks(originalUrl, params.page, params.limit, totalPages)
    };
  }
}

export const catalogService = new CatalogService();
