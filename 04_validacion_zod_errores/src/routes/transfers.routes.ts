/* ============================================================================
 * EJERCICIOS: Sistema de Transferencias Bancarias (/api/transfers)
 * Ej.1+Ej.2 -> CompliantTransferSchema (regex IBAN, rango, .refine() AML).
 * Ej.3 -> ver services/transfers.service.ts (InsufficientBalanceError /
 * AccountBlockedError, antes de tocar el saldo).
 *
 * CAPA DE ENRUTAMIENTO: solo asigna URI + verbo HTTP -> middleware de
 * validación -> controlador. Cero lógica de negocio aquí.
 * ========================================================================== */

import { Router } from "express";
import { CompliantTransferSchema } from "../schemas/transfer.schema.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { createTransfer } from "../controllers/transfers.controller.js";

const router = Router();

router.post("/", validateBody(CompliantTransferSchema), createTransfer);

export default router;
