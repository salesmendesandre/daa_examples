/* ============================================================================
 * HEREDADO DE SEMANA 4 — Middleware Genérico de Validación (versión query)
 * Si el parseo falla, se delega el ZodError a next(error) para que lo procese
 * el globalErrorHandler — este middleware NO decide el formato de respuesta.
 *
 * CHULETA — en Express 5, req.query es un getter de SOLO LECTURA: el
 * `req.query = schema.parse(req.query)` de la semana 4 se ignoraba sin dar
 * error (comprobado), así que el controlador seguía recibiendo los strings
 * crudos de la URL. Aquí se redefine "query" como propiedad propia de ESTA
 * petición para que los controladores reciban los datos ya coercionados.
 * ========================================================================== */

import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";

export const validateQuery = (schema: ZodSchema) => {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const parsed = schema.parse(req.query);
      Object.defineProperty(req, "query", { value: parsed, writable: true, enumerable: true, configurable: true });
      next();
    } catch (error) {
      next(error);
    }
  };
};
