/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Capa de ENRUTAMIENTO
 * Solo asigna URI + verbo HTTP -> método del controlador. Cero lógica aquí.
 * PATCH y no PUT: en este capítulo el "update" es siempre parcial.
 * ========================================================================== */

import { Router } from "express";
import { documentsController } from "../controllers/documents.controller.js";

const router = Router();

router.get("/", documentsController.getAll);
router.get("/:id", documentsController.getById);
router.post("/", documentsController.create);
router.patch("/:id", documentsController.update);
router.delete("/:id", documentsController.delete);

export default router;
