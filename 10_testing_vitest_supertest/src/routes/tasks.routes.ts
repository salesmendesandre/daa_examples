/* ============================================================================
 * EJERCICIOS (punto 5): API de Gestión de Tareas y Proyectos (/api/tasks)
 * La API real que verifican los 3 ejercicios de testing (ver tests/exercises/).
 *
 * CAPA DE ENRUTAMIENTO: solo asigna URI + verbo HTTP -> middlewares ->
 * controlador. Cero lógica aquí (ver services/tasks.service.ts).
 * ========================================================================== */

import { Router } from "express";
import { authenticateToken } from "../middlewares/auth.middleware.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { CreateTaskSchema, UpdateTaskSchema } from "../schemas/task.schema.js";
import {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getMetrics,
  getDemoToken
} from "../controllers/tasks.controller.js";

const router = Router();

// Rutas /admin/* declaradas antes de "/:id" por precedencia de rutas.
// Ruta pública de conveniencia: genera un token de demo para probar
// /admin/metrics desde Thunder Client sin montar un flujo de login completo.
router.get("/admin/token-demo", getDemoToken);

// EJERCICIO 3: endpoint administrativo protegido.
router.get("/admin/metrics", authenticateToken, getMetrics);

router.get("/", getAllTasks);

// EJERCICIO 1: validación defensiva (title obligatorio, priority en whitelist).
router.post("/", validateBody(CreateTaskSchema), createTask);

// EJERCICIO 2: ciclo completo (consultar, modificar, borrar).
router.get("/:id", getTaskById);
router.patch("/:id", validateBody(UpdateTaskSchema), updateTask);
router.delete("/:id", deleteTask);

export default router;
