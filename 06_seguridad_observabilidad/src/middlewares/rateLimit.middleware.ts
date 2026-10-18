/* ============================================================================
 * CONTENIDO — Rate Limiting: Mitigación de Abusos y Ataques DoS
 * Límite general para toda la API (100 peticiones / 15 min por IP).
 * ========================================================================== */

import rateLimit from "express-rate-limit";

export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true, // Cabeceras RateLimit-Limit / RateLimit-Remaining / RateLimit-Reset
  legacyHeaders: false,
  message: {
    status: "fail",
    error: "TooManyRequests",
    message: "Límite de peticiones excedido. Intente nuevamente en 15 minutos."
  }
});
