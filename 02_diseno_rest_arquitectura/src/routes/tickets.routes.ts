/* ============================================================================
 * EJERCICIOS CORREGIDOS (Sesión 2): Sistema de Gestión de Incidencias / Tickets
 *
 * PATCH /:id/status es una ruta MÁS ESPECÍFICA que un hipotético PATCH /:id
 * genérico (que aquí no existe): el cambio de estado tiene su propio endpoint
 * porque implica una regla de negocio (máquina de estados), no un simple
 * "actualiza este campo".
 * ========================================================================== */

import { Router } from "express";
import { ticketsController } from "../controllers/tickets.controller.js";

const router = Router();

router.get("/", ticketsController.getAll);
router.get("/:id", ticketsController.getById);
router.post("/", ticketsController.create);
router.patch("/:id/status", ticketsController.updateStatus);
router.delete("/:id", ticketsController.delete);

export default router;
