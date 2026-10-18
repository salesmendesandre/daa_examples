# 07 · Autenticación JWT, Bcrypt y Control de Roles (RBAC)

Proyecto de apoyo al capítulo **"Autenticación con JWT y Control de Acceso Basado en Roles"**.
Scaffold igual al del resto de capítulos: `src/server.ts` como punto de entrada (`app.listen`),
`src/app.ts` con la configuración de Express. Swagger UI en `http://localhost:3008/api/docs`
(el botón **Authorize** acepta el token que devuelve el login).

Este proyecto mezcla en el mismo `src/` dos cosas distintas:

- **CONTENIDO** de la sesión (dominio `Users`, `/api/auth` + `/api/users` + `/api/admin`):
  registro/login con bcrypt (costo 10), JWT y RBAC básico (roles `user`/`admin`).
- **EJERCICIOS ya resueltos** (dominio `Hospital`, `/api/hospital-auth` + `/api/clinical-records`):
  Sistema Clínico Hospitalario, sobre el mismo patrón arquitectónico que `Users`:
  - **Ejercicio 1** — `requireHospitalRoles`: middleware de RBAC flexible (recibe la lista de
    roles permitidos) aplicado en `GET /clinical-records/admin/audit` (solo `hospital_admin`) y
    en `POST /clinical-records` (solo `doctor`/`hospital_admin`).
  - **Ejercicio 2** — Autorización por titularidad (Ownership) y protección BOLA en
    `GET /clinical-records/:id`: un `patient` solo ve su propio historial (y sin
    `confidentialNotes`), un `doctor` solo los que tiene asignados, y `hospital_admin` ve todos.
  - **Ejercicio 3** — Contraseña segura: `isStrongPassword` (regex) rechaza con 400
    (`WeakPasswordError`) antes de invertir CPU en `bcrypt.hash` (costo 12) en
    `POST /hospital-auth/register`.

## Estructura

```
src/
├── server.ts                        → arranque del servidor (siembra datos del Hospital)
├── app.ts                           → montaje de rutas + Swagger + manejador de errores
├── config/
│   └── jwt.ts                       → CONTENIDO (JWT_SECRET desde .env y caducidad del token)
├── data/
│   ├── clinicalRecords.store.ts     → EJERCICIOS (historiales clínicos de demostración)
│   └── seed.ts                      → EJERCICIOS (siembra usuarios + historiales del Hospital)
├── controllers/
│   ├── auth.controller.ts           → CONTENIDO (register, login)
│   ├── users.controller.ts          → CONTENIDO (GET /me)
│   ├── admin.controller.ts          → CONTENIDO (GET /admin/metrics)
│   ├── hospitalAuth.controller.ts   → EJERCICIOS (register/login del Hospital)
│   └── clinicalRecords.controller.ts → EJERCICIOS (Ej.1 auditoría, Ej.2 Ownership/BOLA)
├── errors/
│   ├── app.error.ts                 → HEREDADO (clase base AppError)
│   └── auth.errors.ts               → 401/403/409 CONTENIDO + 400 WeakPasswordError (EJERCICIO 3)
├── middlewares/
│   ├── auth.middleware.ts           → CONTENIDO (authenticateToken AuthN y authorizeRoles AuthZ)
│   ├── error.middleware.ts          → HEREDADO (notFoundHandler + globalErrorHandler)
│   ├── validate.middleware.ts       → HEREDADO (validateBody genérico, Zod)
│   └── requireHospitalRoles.ts      → EJERCICIO 1 (RBAC flexible del Hospital)
├── models/
│   ├── user.store.ts                → CONTENIDO (usuarios de "Users" en memoria)
│   ├── hospitalUser.store.ts        → EJERCICIOS (usuarios del Hospital en memoria)
│   └── clinicalRecord.store.ts      → EJERCICIOS (historiales clínicos en memoria)
├── routes/
│   ├── auth.routes.ts               → CONTENIDO (/api/auth)
│   ├── users.routes.ts              → CONTENIDO (/api/users, solo AuthN)
│   ├── admin.routes.ts              → CONTENIDO (/api/admin, AuthN + RBAC de "admin")
│   ├── hospitalAuth.routes.ts       → EJERCICIOS (/api/hospital-auth)
│   └── clinicalRecords.routes.ts    → EJERCICIOS (/api/clinical-records)
├── schemas/
│   ├── auth.schema.ts               → CONTENIDO (RegisterSchema, LoginSchema)
│   ├── hospitalAuth.schema.ts       → EJERCICIOS (HospitalRegisterSchema: role obligatorio)
│   └── clinicalRecord.schema.ts     → EJERCICIOS (CreateClinicalRecordSchema)
├── services/
│   ├── auth.service.ts              → CONTENIDO (bcrypt.hash costo 10 + bcrypt.compare)
│   ├── token.service.ts             → CONTENIDO (jwt.sign, compartido por Users y Hospital)
│   ├── users.service.ts             → CONTENIDO (perfil público sin passwordHash)
│   ├── hospitalAuth.service.ts      → EJERCICIOS (register/login del Hospital)
│   ├── clinicalRecords.service.ts   → EJERCICIOS (Ej.1 auditoría, Ej.2 Ownership/BOLA)
│   └── password.service.ts          → EJERCICIO 3 (hashStrongPassword: regex + bcrypt costo 12)
├── utils/
│   └── strongPassword.ts            → EJERCICIO 3 (regex de contraseña segura, función pura)
└── types/
    ├── auth.types.ts                → CONTENIDO (UserRole, UserEntity, PublicUser...)
    └── hospital.types.ts            → EJERCICIOS (HospitalRole, ClinicalRecord, AuditReport...)
```

Todas las respuestas de error siguen el formato de los capítulos anteriores:
`{ "status": "fail", "error": "<Nombre>", "message": "..." }` (y `details` si es un error de Zod).

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

```bash
# --- Hospital (EJERCICIOS) ---
# El servidor siembra estos usuarios y 2 historiales clínicos al arrancar (ver src/data/seed.ts):
#   paciente1@hospital.test / Patient1!  -> rol patient,        id "p1"
#   paciente2@hospital.test / Patient2!  -> rol patient,        id "p2"
#   doctor1@hospital.test   / Doctor123! -> rol doctor,         id "d1"
#   admin1@hospital.test    / Admin123!  -> rol hospital_admin, id "a1"
#   rec1 -> paciente p1, doctor d1, CON confidentialNotes
#   rec2 -> paciente p2, doctor d1, sin confidentialNotes

# Login como cada rol (copia el "token" de cada respuesta para los pasos siguientes)
curl -X POST http://localhost:3008/api/hospital-auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"paciente1@hospital.test\",\"password\":\"Patient1!\"}"

curl -X POST http://localhost:3008/api/hospital-auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"paciente2@hospital.test\",\"password\":\"Patient2!\"}"

curl -X POST http://localhost:3008/api/hospital-auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"doctor1@hospital.test\",\"password\":\"Doctor123!\"}"

curl -X POST http://localhost:3008/api/hospital-auth/login \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"admin1@hospital.test\",\"password\":\"Admin123!\"}"

# Ej.3 — Registro con contraseña débil (sin mayúscula/especial) -> 400 WeakPassword
curl -i -X POST http://localhost:3008/api/hospital-auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"nuevo@hospital.test\",\"password\":\"abcdefgh\",\"fullName\":\"Nuevo Doctor\",\"role\":\"doctor\"}"

# Ej.3 — Registro con contraseña fuerte -> 201 (bcrypt costo 12)
curl -X POST http://localhost:3008/api/hospital-auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"nuevo@hospital.test\",\"password\":\"Fuerte123!\",\"fullName\":\"Nuevo Doctor\",\"role\":\"doctor\"}"

# Ej.1 — Auditoría con token de rol "doctor" -> 403 (requireHospitalRoles solo admite hospital_admin)
curl -i http://localhost:3008/api/clinical-records/admin/audit -H "Authorization: Bearer <TOKEN_DOCTOR>"

# Ej.1 — Auditoría con token de rol "hospital_admin" -> 200
curl http://localhost:3008/api/clinical-records/admin/audit -H "Authorization: Bearer <TOKEN_ADMIN>"

# Ej.2 — El propio paciente dueño del historial (p1) ve rec1 SIN confidentialNotes -> 200
curl http://localhost:3008/api/clinical-records/rec1 -H "Authorization: Bearer <TOKEN_PACIENTE1>"

# Ej.2 — Otro paciente (p2) intenta ver el historial de p1 -> 403 (Ownership/BOLA)
curl -i http://localhost:3008/api/clinical-records/rec1 -H "Authorization: Bearer <TOKEN_PACIENTE2>"

# Ej.2 — El doctor asignado (d1) ve rec1 CON confidentialNotes -> 200
curl http://localhost:3008/api/clinical-records/rec1 -H "Authorization: Bearer <TOKEN_DOCTOR>"

# Creación de un historial (solo doctor/hospital_admin) -> 201
curl -X POST http://localhost:3008/api/clinical-records \
  -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN_DOCTOR>" \
  -d "{\"patientId\":\"p2\",\"doctorAssignedId\":\"d1\",\"diagnosis\":\"Migraña crónica\",\"prescriptions\":[\"Sumatriptán 50mg si crisis\"]}"

# Un paciente intenta crear un historial -> 403 (rol no autorizado)
curl -i -X POST http://localhost:3008/api/clinical-records \
  -H "Content-Type: application/json" -H "Authorization: Bearer <TOKEN_PACIENTE1>" \
  -d "{\"patientId\":\"p1\",\"doctorAssignedId\":\"d1\",\"diagnosis\":\"Autodiagnóstico\"}"
```
