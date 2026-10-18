/* ============================================================================
 * Middleware mínimo de autenticación, reutilizado de la Semana 5, solo para
 * poder demostrar el EJERCICIO 3 (401 Unauthorized) sobre un endpoint real
 * protegido — no es el foco de esta sesión, solo su soporte necesario.
 * Como en la Semana 5, no responde él: pasa el error con next(err) y el
 * globalErrorHandler devuelve el 401 (error: "Unauthorized" / "InvalidToken").
 * (JWT_SECRET -> config/jwt.ts; el token de demo -> services/token.service.ts)
 * ========================================================================== */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";
import { UnauthorizedError, InvalidTokenError } from "../errors/auth.errors.js";

export const authenticateToken = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError());
  }

  const token = authHeader.split(" ")[1];

  try {
    jwt.verify(token, JWT_SECRET);
  } catch {
    // Firma incorrecta, token manipulado o caducado -> 401.
    return next(new InvalidTokenError());
  }

  next();
};
