# 07 · Seguridad y Observabilidad

Proyecto de apoyo al bloque **"Seguridad y Observabilidad"** (Helmet, CORS, Rate Limiting,
Pino). Scaffold igual al del resto de capítulos: `src/server.ts` como punto de entrada,
`src/app.ts` con la configuración de Express.

## Estructura

```
src/
├── server.ts                        → arranque del servidor
├── app.ts                           → Helmet + CORS + Rate Limit + endpoint de ejemplo
├── config/logger.ts                 → Pino (JSON estructurado, pino-pretty en desarrollo)
└── middlewares/rateLimit.middleware.ts → límite general de tráfico (100 peticiones/15min)
```

> Este bloque aún no incluye ejercicios resueltos en este repositorio — se añadirán más
> adelante, una vez corregidos en clase.

## Ejecución

```bash
npm install
npm run dev        # tsx watch src/server.ts -> http://localhost:3007
npm run typecheck
npm run build && npm start
```

## Probar en directo

```bash
# Cabeceras de Helmet, CORS y Rate Limit en la respuesta:
curl -i http://localhost:3007/api/secure-data
```

Fíjate en `Strict-Transport-Security`, `X-Content-Type-Options`, la ausencia de
`X-Powered-By` (Helmet), `Access-Control-Allow-Origin` (CORS) y `RateLimit-*` (Rate Limiting).
