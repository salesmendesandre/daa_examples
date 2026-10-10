/* ============================================================================
 * CAPA DE SERVICIO — Tareas (EJERCICIOS, punto 5)
 * Lo que verifican los tests de tests/exercises/: 404 si la tarea no existe
 * (paso 5 del Ejercicio 2) y las métricas del endpoint protegido (Ejercicio 3).
 * Los DTOs ya llegan validados por Zod (Ejercicio 1, en las rutas).
 * ========================================================================== */

import { taskStore } from "../models/task.store.js";
import { TaskItem, TaskMetrics } from "../types/task.types.js";
import { CreateTaskDTO, UpdateTaskDTO } from "../schemas/task.schema.js";
import { AppError } from "../errors/app.error.js";

export class TasksService {
  getAllTasks(): TaskItem[] {
    return taskStore.findAll();
  }

  getTaskById(id: number): TaskItem {
    const task = taskStore.findById(id);
    if (!task) throw new AppError("Tarea no encontrada", 404);
    return task;
  }

  createTask(input: CreateTaskDTO): TaskItem {
    return taskStore.create({
      title: input.title,
      priority: input.priority,
      completed: false,
      dueDate: input.dueDate || new Date().toISOString()
    });
  }

  updateTask(id: number, patch: UpdateTaskDTO): TaskItem {
    const task = taskStore.update(id, patch);
    if (!task) throw new AppError("Tarea no encontrada", 404);
    return task;
  }

  deleteTask(id: number): void {
    if (!taskStore.delete(id)) throw new AppError("Tarea no encontrada", 404);
  }

  // EJERCICIO 3: lo que solo debe ver alguien con un token válido.
  getMetrics(): TaskMetrics {
    const tasks = taskStore.findAll();
    return { totalTasks: tasks.length, completedTasks: tasks.filter(t => t.completed).length };
  }
}

export const tasksService = new TasksService();
