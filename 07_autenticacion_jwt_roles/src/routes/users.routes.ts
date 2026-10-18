/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Endpoint autenticado (/api/users)
 * Solo AuthN: cualquier usuario con un token válido, sea cual sea su rol.
 * ========================================================================== */

import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { getMe } from "../controllers/users.controller.js";

const router = Router();

router.get("/me", authenticateToken, getMe);

export default router;
