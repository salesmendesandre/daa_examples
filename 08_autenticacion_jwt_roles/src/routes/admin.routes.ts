/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Endpoint restringido por rol (/api/admin)
 * AuthN + AuthZ encadenados en ESE orden: authenticateToken primero (401
 * si no hay token válido) y authorizeRoles después (403 si el rol no basta).
 * ========================================================================== */

import { Router } from "express";
import { authenticateToken, authorizeRoles } from "../middlewares/auth.middleware.js";
import { getMetrics } from "../controllers/admin.controller.js";

const router = Router();

router.get("/metrics", authenticateToken, authorizeRoles("admin"), getMetrics);

export default router;
