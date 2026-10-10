/* ============================================================================
 * EJERCICIOS (punto 5) — Contrato de entrada de /api/tasks
 * El EJERCICIO 1 prueba que POST rechaza con 400 una tarea sin "title" o con
 * una "priority" fuera de la lista (p. ej. "urgent").
 *
 * UpdateTaskSchema (PATCH, Ejercicio 2): la implementación anterior hacía
 * Object.assign(task, req.body) sin validar -> un PATCH con
 * {"priority": "urgent"} se saltaba la validación del Ejercicio 1, y uno con
 * {"id": 999} cambiaba el id de la tarea (comprobado). Zod descarta los
 * campos que no están en el schema (id) y valida los que sí.
 * ========================================================================== */

import { z } from "zod";
import { TASK_PRIORITIES } from "../types/task.types.js";

const titleField = z
  .string({ required_error: "El título es obligatorio", invalid_type_error: "El título debe ser un texto" })
  .trim()
  .min(1, "El título es obligatorio");

const priorityField = z.enum(TASK_PRIORITIES, {
  errorMap: () => ({ message: "La prioridad debe ser 'low', 'medium' o 'high'" })
});

const dueDateField = z
  .string({ invalid_type_error: "La fecha límite (dueDate) debe ser un texto" })
  .refine(value => !Number.isNaN(Date.parse(value)), "La fecha límite (dueDate) no es una fecha válida");

export const CreateTaskSchema = z.object({
  title: titleField,
  priority: priorityField.default("medium"),
  dueDate: dueDateField.optional()
});

export const UpdateTaskSchema = z
  .object({
    title: titleField,
    priority: priorityField,
    dueDate: dueDateField,
    completed: z.boolean({ invalid_type_error: "El campo 'completed' debe ser true o false" })
  })
  .partial();

export type CreateTaskDTO = z.infer<typeof CreateTaskSchema>;
export type UpdateTaskDTO = z.infer<typeof UpdateTaskSchema>;
