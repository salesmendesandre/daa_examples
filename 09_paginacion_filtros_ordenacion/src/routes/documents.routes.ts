/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Documents paginados (/api/documents)
 * CAPA DE ENRUTAMIENTO: solo asigna URI + verbo HTTP -> middleware de
 * validación -> controlador. Cero lógica aquí (ver services/pagination.service.ts).
 * ========================================================================== */

import { Router } from "express";
import { validateQuery } from "../middlewares/validate.middleware.js";
import { DocumentsQuerySchema } from "../schemas/document.schema.js";
import { getDocuments } from "../controllers/documents.controller.js";

const router = Router();

router.get("/", validateQuery(DocumentsQuerySchema), getDocuments);

export default router;
