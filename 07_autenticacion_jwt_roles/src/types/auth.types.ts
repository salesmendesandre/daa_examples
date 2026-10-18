/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Tipos de dominio de Users y del payload del JWT
 * UserEntity es lo que GUARDA el servidor (incluye passwordHash, que jamás
 * debe salir en una respuesta). PublicUser es lo que se DEVUELVE al cliente.
 * AuthTokenPayload es lo que viaja DENTRO del JWT: solo lo justo para
 * autorizar (id, email, rol) — el payload de un JWT va firmado, NO cifrado,
 * así que cualquiera puede leerlo pegando el token en jwt.io.
 * Los DTOs de entrada (RegisterDTO/LoginDTO) no están aquí: se infieren de
 * sus schemas Zod, en ../schemas/auth.schema.ts (igual que en validación).
 * ========================================================================== */

// Lista única de roles: la usan este tipo y el z.enum de auth.schema.ts.
export const USER_ROLES = ["user", "admin"] as const;
export type UserRole = (typeof USER_ROLES)[number];

export interface UserEntity {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: UserRole;
}

export type PublicUser = Omit<UserEntity, "passwordHash">;

export interface AuthTokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// Lo que devuelven register y login: el token firmado + el usuario sin hash.
export interface AuthResult {
  token: string;
  user: PublicUser;
}
