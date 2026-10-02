/* ============================================================================
 * EJERCICIO 1: Rate Limiter Estricto para Operaciones Financieras
 * Los endpoints transaccionales (POST /charge) son objetivo prioritario de
 * "card cracking" (fuerza bruta con tarjetas robadas). 5 intentos / 15 min
 * por IP, mucho más estricto que el globalLimiter general (100/15min).
 * ========================================================================== */

import rateLimit from "express-rate-limit";

export const strictPaymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (_req, res) => {
    res.status(429).json({
      status: "fail",
      error: "TooManyRequests",
      message: "Ha excedido el número máximo de intentos de pago (5 intentos por cada 15 minutos). Por favor espere antes de reintentar.",
      retryAfterMinutes: 15
    });
  }
});
