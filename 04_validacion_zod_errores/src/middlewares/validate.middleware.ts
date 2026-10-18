/* ============================================================================
 * CONTENIDO — Middleware Genérico de Validación
 * Si el parseo falla, se delega el ZodError a next(error) para que lo procese
 * el globalErrorHandler — este middleware NO decide el formato de respuesta.
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

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.query = schema.parse(req.query) as any;
      next();
    } catch (error) {
      next(error);
    }
  };
};
