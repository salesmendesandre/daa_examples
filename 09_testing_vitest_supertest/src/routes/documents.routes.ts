/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Documents testeable (/api/documents)
 * CAPA DE ENRUTAMIENTO: solo asigna URI + verbo HTTP -> middlewares ->
 * controlador. Cero lógica aquí (ver services/documents.service.ts).
 * ========================================================================== */

import { Router } from "express";
import { validateBody } from "../middlewares/validate.middleware.js";
import { CreateDocumentSchema } from "../schemas/document.schema.js";
import { getAllDocuments, getDocumentById, createDocument } from "../controllers/documents.controller.js";

const router = Router();

router.get("/", getAllDocuments);
router.get("/:id", getDocumentById);
router.post("/", validateBody(CreateDocumentSchema), createDocument);

export default router;
