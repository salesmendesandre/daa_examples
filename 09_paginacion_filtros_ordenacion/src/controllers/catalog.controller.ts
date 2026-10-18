/* ============================================================================
 * CAPA DE CONTROLADOR — Catálogo E-commerce (EJERCICIOS, punto 5)
 * req.query ya llega validado y coercionado por CatalogQuerySchema (Ej.1):
 * page/limit/minPrice/maxPrice son number, no strings de la URL.
 * ========================================================================== */

import { Request, Response } from "express";
import { catalogService } from "../services/catalog.service.js";
import { CatalogQueryParams } from "../schemas/catalog.schema.js";

export const getCatalog = async (req: Request, res: Response) => {
  const result = await catalogService.getPaginatedCatalog(req.query as unknown as CatalogQueryParams, req.originalUrl);
  res.json({ status: "success", ...result });
};
