/* ============================================================================
 * EJERCICIO 3: soporte para el candado "Authorize" 🔒 de Swagger UI en
 * POST /api/books (bearerAuth en components.securitySchemes de openapi.json).
 *
 * OJO: esto SOLO comprueba que llega una cabecera "Authorization: Bearer ...".
 * NO verifica ninguna firma todavía — eso es JWT real, que se ve más adelante.
 * Aquí basta con demostrar el contrato de seguridad documentado.
 * ========================================================================== */

import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/app.error.js";

export const requireBearerToken = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ") || authHeader.split(" ")[1]?.length === 0) {
    return next(new AppError("Token de autenticación ausente o no válido", 401));
  }

  next();
};
