/* ============================================================================
 * EJERCICIOS: API de Pagos y Transacciones (/api/payments)
 * Ej.1 -> strictPaymentLimiter en /charge (429 tras 5 intentos/15min).
 * Ej.3 -> Helmet + CORS EXTRA, más restrictivos que los globales de app.ts,
 * aplicados SOLO a este router (defensa en profundidad por dominio: un
 * microservicio de pagos es más sensible que el resto de la API).
 *
 * CAPA DE ENRUTAMIENTO: helmet()/cors()/rate-limit son plumbing de Express
 * por ruta, así que se quedan aquí. La lógica del cargo (validación de
 * amount/currency, generación del recibo) vive en services/payments.service.ts.
 * ========================================================================== */

import { Router } from "express";
import helmet from "helmet";
import cors from "cors";
import { strictPaymentLimiter } from "../middlewares/paymentsRateLimit.middleware.js";
import { createCharge } from "../controllers/payments.controller.js";

const router = Router();

// EJERCICIO 3: capa de seguridad adicional solo para /api/payments/*.
// Se ejecuta DESPUÉS del helmet()/cors() globales de app.ts (más permisivos),
// así que estas cabeceras más estrictas son las que prevalecen aquí.
router.use(
  helmet({
    hidePoweredBy: true,
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true }, // 1 año
    frameguard: { action: "deny" },
    noSniff: true
  })
);
router.use(
  cors({
    origin: ["https://checkout.tienda.com"],
    methods: ["POST"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Request-Id"],
    credentials: true,
    maxAge: 86400 // cachea el preflight OPTIONS 24h
  })
);

// EJERCICIO 1: solo 5 peticiones cada 15 min por IP antes de responder 429.
router.post("/charge", strictPaymentLimiter, createCharge);

export default router;
