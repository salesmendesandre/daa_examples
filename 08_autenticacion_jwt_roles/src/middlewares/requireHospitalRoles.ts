/* ============================================================================
 * EJERCICIO 1 — Middleware de Autorización RBAC Flexible
 * Análogo a authorizeRoles() del contenido, pero con mensaje de error más
 * descriptivo (indica QUÉ roles sí tendrían acceso) y aplicado al dominio
 * Hospital en vez de Users.
 * ========================================================================== */

import { Request, Response, NextFunction } from "express";
import { HospitalRole } from "../types/hospital.types.js";
import { UnauthorizedError, ForbiddenError } from "../errors/auth.errors.js";

export const requireHospitalRoles = (...roles: HospitalRole[]) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new UnauthorizedError("Se requiere autenticación previa para acceder a este historial."));
    }

    const userRole = (req.user as any).role as HospitalRole;

    if (!roles.includes(userRole)) {
      return next(
        new ForbiddenError(
          `Acceso denegado. Se requiere uno de los siguientes roles: [${roles.join(", ")}]. Su rol actual es '${userRole}'.`
        )
      );
    }

    next();
  };
};
