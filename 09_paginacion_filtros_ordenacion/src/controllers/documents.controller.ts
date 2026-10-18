/* ============================================================================
 * CAPA DE CONTROLADOR — Documents paginados (CONTENIDO)
 * req.query ya llega validado por DocumentsQuerySchema (ver la ruta). Sin
 * try/catch: en Express 5 un error async llega solo al globalErrorHandler.
 * ========================================================================== */

import { Request, Response } from "express";
import { getPaginatedDocuments } from "../services/pagination.service.js";
import { DocumentsQueryParams } from "../schemas/document.schema.js";

export const getDocuments = async (req: Request, res: Response) => {
  const result = await getPaginatedDocuments(req.query as DocumentsQueryParams);
  res.json({ status: "success", ...result });
};
