/* ============================================================================
 * EJERCICIOS — Registro/Login del dominio Hospital (/api/hospital-auth)
 * Ej.3 -> la contraseña débil se rechaza con 400 ANTES de llegar a bcrypt
 * (ver services/password.service.ts).
 *
 * CAPA DE ENRUTAMIENTO: solo asigna URI + verbo HTTP -> middlewares ->
 * controlador. Cero lógica aquí (ver services/hospitalAuth.service.ts).
 * ========================================================================== */

import { Router } from "express";
import { HospitalRegisterSchema } from "../schemas/hospitalAuth.schema.js";
import { LoginSchema } from "../schemas/auth.schema.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { registerHospitalUser, loginHospitalUser } from "../controllers/hospitalAuth.controller.js";

const router = Router();

router.post("/register", validateBody(HospitalRegisterSchema), registerHospitalUser);
router.post("/login", validateBody(LoginSchema), loginHospitalUser);

export default router;
