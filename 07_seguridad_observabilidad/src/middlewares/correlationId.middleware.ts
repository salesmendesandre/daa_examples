/* ============================================================================
 * EJERCICIO 2: Middleware de Correlation ID (X-Request-Id)
 * Si el cliente ya trae su propio X-Request-Id (típico en microservicios,
 * lo genera el API Gateway), se respeta; si no, se genera aquí. Se devuelve
 * en la respuesta y se adjunta a cada log de esa petición.
 * ========================================================================== */

import { Request, Response, NextFunction } from "express";
import crypto from "node:crypto";
import { logger } from "../config/logger.js";

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
    }
  }
}

export const correlationIdMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const existingId = req.header("X-Request-Id");
  const requestId = existingId || crypto.randomUUID();

  req.requestId = requestId;
  res.setHeader("X-Request-Id", requestId);

  logger.info(
    { requestId, method: req.method, url: req.originalUrl, ip: req.ip },
    "Petición HTTP entrante recibida"
  );

  next();
};
