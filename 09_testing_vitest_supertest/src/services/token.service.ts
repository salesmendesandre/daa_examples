/* ============================================================================
 * Emisión de JWT (jwt.sign, Semana 5) — solo para el EJERCICIO 3.
 * No hay login en esta sesión: GET /api/tasks/admin/token-demo devuelve este
 * token para poder probar el endpoint protegido desde Thunder Client y para
 * que el test del ejercicio compruebe también el caso válido (200).
 * ========================================================================== */

import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/jwt.js";

export class TokenService {
  generateDemoToken(): string {
    return jwt.sign({ userId: "1", role: "admin" }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }
}

export const tokenService = new TokenService();
