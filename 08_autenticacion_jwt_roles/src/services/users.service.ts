/* ============================================================================
 * CAPA DE SERVICIO — Perfil y métricas de Users (CONTENIDO)
 * toPublicUser quita el passwordHash: es el ÚNICO sitio por el que un
 * usuario sale hacia fuera, así que nunca se filtra el hash por descuido.
 * ========================================================================== */

import { userStore } from "../models/user.store.js";
import { PublicUser, UserEntity } from "../types/auth.types.js";
import { AppError } from "../errors/app.error.js";

export const toPublicUser = ({ passwordHash, ...publicUser }: UserEntity): PublicUser => publicUser;

export class UsersService {
  getProfile(userId: string): PublicUser {
    const user = userStore.findById(userId);
    if (!user) throw new AppError("Usuario no encontrado", 404);
    return toPublicUser(user);
  }

  countUsers(): number {
    return userStore.count();
  }
}

export const usersService = new UsersService();
