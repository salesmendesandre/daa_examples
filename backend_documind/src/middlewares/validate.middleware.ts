import { Request, Response, NextFunction } from "express";
import { ZodType, ZodError } from "zod";

export const validateBody = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          status: "fail",
          error: "Error de validación en los datos enviados",
          details: err.issues.map(e => ({
            field: e.path.join("."),
            message: e.message
          }))
        });
      }
      next(err);
    }
  };
};

export const validateQuery = (schema: ZodType) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      // En Express 5 req.query es un getter de solo lectura (ver capítulo 9):
      // se redefine como propiedad propia para que la ruta reciba los datos coercionados.
      const parsed = schema.parse(req.query);
      Object.defineProperty(req, "query", { value: parsed, writable: true, enumerable: true, configurable: true });
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return res.status(400).json({
          status: "fail",
          error: "Parámetros de consulta no válidos",
          details: err.issues.map(e => ({
            param: e.path.join("."),
            message: e.message
          }))
        });
      }
      next(err);
    }
  };
};
