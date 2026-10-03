# 08 · Autenticación JWT, Bcrypt y Control de Roles (RBAC)

Proyecto de apoyo al capítulo **"Autenticación con JWT y Control de Acceso Basado en Roles"**.
Scaffold igual al del resto de capítulos: `src/server.ts` como punto de entrada (`app.listen`),
`src/app.ts` con la configuración de Express. Swagger UI en `http://localhost:3008/api/docs`
(el botón **Authorize** acepta el token que devuelve el login).

## Estructura

```
src/
├── server.ts                  → arranque del servidor
├── app.ts                     → montaje de rutas + Swagger + manejador de errores
├── config/
│   └── jwt.ts                 → JWT_SECRET (desde .env) y caducidad del token
├── controllers/
│   ├── auth.controller.ts     → register, login
│   ├── users.controller.ts    → GET /me
│   └── admin.controller.ts    → GET /admin/metrics
├── errors/
│   ├── app.error.ts           → clase base AppError (ver capítulo de validación)
│   └── auth.errors.ts         → 401 Unauthorized/InvalidToken, 403 Forbidden, 409 EmailAlreadyRegistered...
├── middlewares/
│   ├── auth.middleware.ts     → authenticateToken (AuthN) y authorizeRoles (AuthZ)
│   ├── error.middleware.ts    → notFoundHandler + globalErrorHandler centralizado
│   └── validate.middleware.ts → validateBody genérico y reutilizable (Zod)
├── models/
│   └── user.store.ts          → usuarios en memoria (guarda el passwordHash, nunca la contraseña)
├── routes/
│   ├── auth.routes.ts         → /api/auth (register/login)
│   ├── users.routes.ts        → /api/users (solo AuthN)
│   └── admin.routes.ts        → /api/admin (AuthN + RBAC de "admin")
├── schemas/
│   └── auth.schema.ts         → RegisterSchema, LoginSchema (Zod)
├── services/
│   ├── auth.service.ts        → bcrypt.hash (costo 10) + bcrypt.compare
│   ├── token.service.ts       → jwt.sign
│   └── users.service.ts       → perfil público (sin passwordHash) y conteo de usuarios
└── types/
    └── auth.types.ts          → UserRole, UserEntity, PublicUser, AuthTokenPayload
```

Todas las respuestas de error siguen el formato de los capítulos anteriores:
`{ "status": "fail", "error": "<Nombre>", "message": "..." }` (y `details` si es un error de Zod).

> Este capítulo aún no incluye ejercicios resueltos en este repositorio — se añadirán más
> adelante, una vez corregidos en clase.

## Ejecución

```bash
npm install
npm run dev        # tsx watch src/server.ts -> http://localhost:3008
npm run typecheck
npm run build && npm start
```

Variables de entorno opcionales (ver `.env.example`): `JWT_SECRET` y `PORT`. Si no se definen,
el proyecto arranca igualmente con valores por defecto pensados solo para clase.

## Probar en directo

```bash
# Registro -> 201 (devuelve el token firmado)
curl -X POST http://localhost:3008/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@usal.es\",\"password\":\"SecretPassword123\",\"fullName\":\"Profesor Admin\",\"role\":\"admin\"}"

# Login -> 200 (copia el "token" de la respuesta)
curl -X POST http://localhost:3008/api/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin@usal.es\",\"password\":\"SecretPassword123\"}"

# Perfil autenticado (sustituye <TOKEN>) -> 200
curl http://localhost:3008/api/users/me -H "Authorization: Bearer <TOKEN>"

# Sin token -> 401
curl -i http://localhost:3008/api/users/me

# Métricas de admin con un token de rol "admin" -> 200
curl http://localhost:3008/api/admin/metrics -H "Authorization: Bearer <TOKEN_ADMIN>"

# Métricas de admin con un token de rol "user" -> 403
curl -i http://localhost:3008/api/admin/metrics -H "Authorization: Bearer <TOKEN_USER>"
```
