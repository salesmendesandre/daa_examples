/* ============================================================================
 * EJERCICIO 1: Middleware de Validación de ObjectId
 * Sin esto, GET /api/courses/123-abc rompe con un CastError de Mongoose antes
 * de llegar siquiera a preguntar a la BD. Se corta aquí con un 400 claro.
 * ========================================================================== */

import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateObjectId = (paramName: string = "id") => {
  return (req: Request, res: Response, next: NextFunction) => {
    const id = req.params[paramName] as string;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        status: "fail",
        error: "InvalidObjectId",
        message: `El parámetro '${paramName}' con valor '${id}' no es un identificador de MongoDB válido (se esperan 24 caracteres hexadecimales).`
      });
    }

    next();
  };
};
