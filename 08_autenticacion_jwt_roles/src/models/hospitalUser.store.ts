/* ============================================================================
 * CAPA DE MODELO — Usuarios del Hospital en memoria (EJERCICIOS)
 * insert() admite un id fijo (lo usa data/seed.ts para que los ejemplos de
 * curl del README referencien siempre "p1", "d1"...); create() lo genera.
 * ========================================================================== */

import { HospitalUserEntity } from "../types/hospital.types.js";

class HospitalUserStore {
  private users: HospitalUserEntity[] = [];

  findByEmail(email: string): HospitalUserEntity | undefined {
    return this.users.find(u => u.email === email.toLowerCase());
  }

  create(data: Omit<HospitalUserEntity, "id">): HospitalUserEntity {
    const nuevo: HospitalUserEntity = { id: String(this.users.length + 1), ...data };
    this.users.push(nuevo);
    return nuevo;
  }

  insert(user: HospitalUserEntity): void {
    this.users.push(user);
  }
}

export const hospitalUserStore = new HospitalUserStore();
