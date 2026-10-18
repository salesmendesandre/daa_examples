# 06 · Seguridad y Observabilidad

Proyecto de apoyo al bloque **"Seguridad y Observabilidad"** (Helmet, CORS, Rate Limiting,
Pino). Scaffold igual al del resto de capítulos: `src/server.ts` como punto de entrada,
`src/app.ts` con la configuración de Express.

Este proyecto mezcla en el mismo `src/` dos cosas distintas:

- **CONTENIDO** de la sesión: Helmet + CORS + rate limiting general + Pino, aplicados a todo
  `/api` y expuestos en `GET /api/secure-data`.
- **EJERCICIOS ya resueltos** (dominio `Payments`, `/api/payments`):
  - **Ejercicio 1** — `strictPaymentLimiter`: solo 5 peticiones cada 15 minutos por IP en
    `POST /payments/charge` (mucho más estricto que el límite general de 100/15min).
  - **Ejercicio 2** — `correlationIdMiddleware`: genera o respeta un `X-Request-Id`, lo
    devuelve en la respuesta y lo adjunta a cada log de Pino de esa petición.
  - **Ejercicio 3** — Helmet y CORS reforzados, aplicados **solo** al router de `/api/payments`
    (más restrictivos que los globales de `app.ts`): HSTS a 1 año, `frameguard: deny`, y CORS
    limitado al origen `https://checkout.tienda.com`.

## Estructura

```
src/
├── server.ts                                → arranque del servidor
├── app.ts                                   → Helmet + CORS + Correlation ID + Rate Limit + rutas
├── config/logger.ts                         → CONTENIDO (Pino, JSON estructurado)
├── errors/app.error.ts                      → clase base AppError (ver capítulo 4)
├── middlewares/
│   ├── rateLimit.middleware.ts              → CONTENIDO (límite general, 100 peticiones/15min)
│   ├── error.middleware.ts                  → notFoundHandler + globalErrorHandler (ver capítulo 4)
│   ├── correlationId.middleware.ts          → EJERCICIOS (Ej.2: X-Request-Id)
│   └── paymentsRateLimit.middleware.ts      → EJERCICIOS (Ej.1: 5 peticiones/15min)
├── services/payments.service.ts             → EJERCICIOS (valida amount/currency, genera el cargo)
├── controllers/payments.controller.ts       → EJERCICIOS
├── routes/payments.routes.ts                → EJERCICIOS (/api/payments, Ej.3: Helmet/CORS reforzados)
└── types/payment.types.ts                   → tipos de PaymentCharge
```

## Ejecución

```bash
npm install
npm run dev        # tsx watch src/server.ts -> http://localhost:3007
npm run typecheck
npm run build && npm start
```

## Probar en directo

```bash
# --- CONTENIDO ---
# Cabeceras de Helmet, CORS, Correlation ID y Rate Limit en la respuesta:
curl -i http://localhost:3007/api/secure-data
```

Fíjate en `Strict-Transport-Security`, `X-Content-Type-Options`, la ausencia de
`X-Powered-By` (Helmet), `Access-Control-Allow-Origin` (CORS), `X-Request-Id` (Ej.2) y
`RateLimit-*` (Rate Limiting).

```bash
# --- Payments (EJERCICIOS) ---

# Válido -> 201
curl -i -X POST http://localhost:3007/api/payments/charge \
  -H "Content-Type: application/json" \
  -d "{\"amount\":49.99,\"currency\":\"EUR\"}"

# Ej.1 — Repite la petición anterior 6 veces seguidas -> la 6ª responde 429
for i in 1 2 3 4 5 6; do
  curl -s -o /dev/null -w "%{http_code}\n" -X POST http://localhost:3007/api/payments/charge \
    -H "Content-Type: application/json" -d "{\"amount\":10,\"currency\":\"EUR\"}"
done

# Ej.3 — Cabeceras CORS reforzadas (compáralas con las de /api/secure-data):
curl -i -X POST http://localhost:3007/api/payments/charge \
  -H "Content-Type: application/json" -H "Origin: https://checkout.tienda.com" \
  -d "{\"amount\":10,\"currency\":\"EUR\"}"
```
