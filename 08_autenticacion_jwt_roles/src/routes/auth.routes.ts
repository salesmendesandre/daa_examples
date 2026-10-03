/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Registro y Login del dominio Users (/api/auth)
 * CAPA DE ENRUTAMIENTO: solo asigna URI + verbo HTTP -> middlewares ->
 * controlador. Cero lógica aquí (ver services/auth.service.ts).
 * ========================================================================== */

import { Router } from "express";
import { RegisterSchema, LoginSchema } from "../schemas/auth.schema.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { register, login } from "../controllers/auth.controller.js";

const router = Router();

router.post("/register", validateBody(RegisterSchema), register);
router.post("/login", validateBody(LoginSchema), login);

export default router;
