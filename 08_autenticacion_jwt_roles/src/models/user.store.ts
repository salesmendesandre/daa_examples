/* ============================================================================
 * CAPA DE MODELO — Usuarios del dominio "Users" en memoria (CONTENIDO)
 * Guarda el passwordHash, NUNCA la contraseña en claro. Empieza vacío: los
 * usuarios se crean con POST /api/auth/register.
 * ========================================================================== */

import { UserEntity } from "../types/auth.types.js";

class UserStore {
  private users: UserEntity[] = [];

  findByEmail(email: string): UserEntity | undefined {
    return this.users.find(u => u.email === email.toLowerCase());
  }

  findById(id: string): UserEntity | undefined {
    return this.users.find(u => u.id === id);
  }

  create(data: Omit<UserEntity, "id">): UserEntity {
    const nuevo: UserEntity = { id: String(this.users.length + 1), ...data };
    this.users.push(nuevo);
    return nuevo;
  }

  count(): number {
    return this.users.length;
  }
}

export const userStore = new UserStore();
