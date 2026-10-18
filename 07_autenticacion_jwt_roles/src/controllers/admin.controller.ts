/* ============================================================================
 * CAPA DE CONTROLADOR — Panel de administración (CONTENIDO)
 * Si se llega aquí, authenticateToken + authorizeRoles("admin") ya han
 * comprobado identidad y rol en la ruta: el controlador no repite el check.
 * ========================================================================== */

import { Request, Response } from "express";
import { usersService } from "../services/users.service.js";

export const getMetrics = (req: Request, res: Response) => {
  res.json({
    status: "success",
    message: "Bienvenido al panel de administración",
    data: {
      adminUser: req.user?.email,
      totalUsers: usersService.countUsers()
    }
  });
};
