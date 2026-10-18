/* ============================================================================
 * Middleware Genérico de Validación (ver capítulo 4). Se reutiliza aquí para
 * validar el payload de POST /api/books contra CreateBookSchema.
 * ========================================================================== */

import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateBody = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      next(error);
    }
  };
};
