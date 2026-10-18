/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Emisión de JWT (jwt.sign)
 * Un JWT = header.payload.firma. jwt.sign codifica el payload en Base64URL
 * y lo FIRMA con JWT_SECRET (HMAC-SHA256): si alguien cambia el rol dentro
 * del token, la firma deja de cuadrar y authenticateToken lo rechaza.
 * Lo usan los dos dominios (Users y Hospital, EJERCICIOS): el payload cambia
 * de forma, pero la firma y la caducidad son las mismas.
 * ========================================================================== */

import jwt from "jsonwebtoken";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/jwt.js";
import { AuthTokenPayload } from "../types/auth.types.js";
import { HospitalTokenPayload } from "../types/hospital.types.js";

export class TokenService {
  generateToken(payload: AuthTokenPayload | HospitalTokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
  }
}

export const tokenService = new TokenService();
