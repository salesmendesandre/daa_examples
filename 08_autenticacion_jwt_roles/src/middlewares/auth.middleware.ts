/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Middlewares de Autenticación y Control de Roles
 * authenticateToken SOLO verifica la firma/caducidad del JWT (AuthN: ¿quién
 * eres?). authorizeRoles decide si ese "quién" tiene permiso (AuthZ: ¿qué
 * puedes hacer?) — son dos preocupaciones distintas y dos middlewares
 * distintos, encadenados en ese orden en las rutas protegidas.
 * Igual que requireBearerToken en el capítulo de validación, no responden
 * ellos: pasan el error con next(err) y el globalErrorHandler decide el
 * formato (401/403).
 * (generateToken -> services/token.service.ts; JWT_SECRET -> config/jwt.ts)
 * ========================================================================== */

import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/jwt.js";
import { AuthTokenPayload, UserRole } from "../types/auth.types.js";
import { UnauthorizedError, InvalidTokenError, ForbiddenError } from "../errors/auth.errors.js";

// Tipado de req.user: a partir de aquí, cualquier handler posterior a
// authenticateToken puede leer req.user.userId / req.user.role con tipos.
declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export const authenticateToken = (req: Request, _res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new UnauthorizedError());
  }

  const token = authHeader.split(" ")[1];

  try {
    req.user = jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
  } catch {
    // Firma incorrecta, token manipulado o caducado (expiresIn) -> 401.
    return next(new InvalidTokenError());
  }

  next();
};

export const authorizeRoles = (...allowedRoles: UserRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return next(new ForbiddenError());
    }
    next();
  };
};
