# 03 · Validación con Zod y Manejo Centralizado de Errores

Proyecto de apoyo al capítulo **"Validación de Esquemas con Zod y Manejo Centralizado de
Errores"**. Scaffold igual al del resto de capítulos: `src/server.ts` como punto de entrada
(`app.listen`), `src/app.ts` con la configuración de Express.

Este proyecto mezcla en el mismo `src/` dos cosas distintas:

- **CONTENIDO** de la sesión (dominio `Documents`, `/api/documents`): esquema Zod, middleware
  de validación genérico y manejador centralizado de errores.
- **EJERCICIOS ya resueltos** (dominio `Transfers`, `/api/transfers`), sobre el mismo patrón
  arquitectónico que `Documents`:
  - **Ejercicio 1** — `CreateTransferSchema`: IBAN español validado con regex, `amount` acotado
    entre 0.01 y 50.000, `currency` como enum.
  - **Ejercicio 2** — `CompliantTransferSchema`: dos `.refine()` encadenados para reglas que
    cruzan varios campos (IBAN origen ≠ destino, `complianceCode` obligatorio a partir de
    10.000 €) — reglas que un esquema declarativo campo a campo no puede expresar por sí solo.
  - **Ejercicio 3** — `InsufficientBalanceError` (422) y `AccountBlockedError` (403), subclases
    de `AppError` que se lanzan desde `transfers.service.ts` antes de tocar el saldo.

## Estructura

```
src/
├── server.ts                         → arranque del servidor
├── app.ts                            → configuración de Express + montaje de rutas
├── schemas/
│   ├── document.schema.ts            → CONTENIDO (CreateDocumentSchema/UpdateDocumentSchema)
│   └── transfer.schema.ts            → EJERCICIOS (Ej.1 regex/rango, Ej.2 .refine())
├── middlewares/
│   ├── validate.middleware.ts        → CONTENIDO (validateBody/validateQuery genéricos)
│   └── error.middleware.ts           → CONTENIDO (notFoundHandler + globalErrorHandler)
├── errors/
│   ├── app.error.ts                  → CONTENIDO (clase base AppError)
│   └── transfer.errors.ts            → EJERCICIOS (Ej.3: InsufficientBalanceError, AccountBlockedError)
├── models/account.store.ts           → EJERCICIOS (cuentas de demostración en memoria)
├── services/transfers.service.ts     → EJERCICIOS (lógica de negocio + Ej.3)
├── controllers/transfers.controller.ts → EJERCICIOS
├── routes/transfers.routes.ts        → EJERCICIOS (/api/transfers)
└── types/transfer.types.ts           → tipos de Account/TransferRecord
```

## Ejecución

```bash
npm install
npm run dev        # tsx watch src/server.ts -> http://localhost:3003
npm run typecheck
npm run build && npm start
```

## Probar en directo

```bash
# --- Documents (CONTENIDO) ---

# Válido -> 201
curl -X POST http://localhost:3003/api/documents \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Clean Code\",\"content\":\"Principios de código limpio\",\"author\":\"Robert C. Martin\"}"

# Inválido (title demasiado corto) -> 400 con detalle de campo
curl -X POST http://localhost:3003/api/documents \
  -H "Content-Type: application/json" \
  -d "{\"title\":\"Hi\",\"content\":\"Muy corto\",\"author\":\"A\"}"

# Ruta inexistente -> 404 (notFoundHandler)
curl http://localhost:3003/api/nope

# --- Transfers (EJERCICIOS) ---
# Cuentas de demostración (ver models/account.store.ts):
#   ES1234567890123456789012 -> saldo 500€, activa
#   ES9999999999999999999999 -> saldo 200.000€, BLOQUEADA
#   ES1111111111111111111111 -> saldo 5€, activa

# Ej.1 — IBAN con formato inválido -> 400
curl -X POST http://localhost:3003/api/transfers \
  -H "Content-Type: application/json" \
  -d "{\"sourceIban\":\"ES123\",\"targetIban\":\"ES1111111111111111111111\",\"amount\":100,\"concept\":\"Alquiler\"}"

# Ej.2 — Importe >= 10.000€ sin complianceCode -> 400 (AML)
curl -X POST http://localhost:3003/api/transfers \
  -H "Content-Type: application/json" \
  -d "{\"sourceIban\":\"ES1234567890123456789012\",\"targetIban\":\"ES1111111111111111111111\",\"amount\":15000,\"concept\":\"Compraventa\"}"

# Ej.3 — Saldo insuficiente -> 422
curl -X POST http://localhost:3003/api/transfers \
  -H "Content-Type: application/json" \
  -d "{\"sourceIban\":\"ES1111111111111111111111\",\"targetIban\":\"ES1234567890123456789012\",\"amount\":100,\"concept\":\"Compraventa\"}"

# Ej.3 — Cuenta bloqueada -> 403
curl -X POST http://localhost:3003/api/transfers \
  -H "Content-Type: application/json" \
  -d "{\"sourceIban\":\"ES9999999999999999999999\",\"targetIban\":\"ES1111111111111111111111\",\"amount\":100,\"concept\":\"Compraventa\"}"

# Válida -> 201
curl -X POST http://localhost:3003/api/transfers \
  -H "Content-Type: application/json" \
  -d "{\"sourceIban\":\"ES1234567890123456789012\",\"targetIban\":\"ES1111111111111111111111\",\"amount\":100,\"concept\":\"Compraventa\"}"
```
