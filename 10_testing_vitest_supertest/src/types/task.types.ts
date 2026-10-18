/* ============================================================================
 * EJERCICIOS (punto 5) — Modelo base de tarea del libro
 * TASK_PRIORITIES es la lista única de prioridades: la usan este tipo y el
 * z.enum de ../schemas/task.schema.ts (Ejercicio 1: "urgent" no es válida).
 * ========================================================================== */

export const TASK_PRIORITIES = ["low", "medium", "high"] as const;
export type TaskPriority = (typeof TASK_PRIORITIES)[number];

export interface TaskItem {
  id: number;
  title: string;
  priority: TaskPriority;
  completed: boolean;
  dueDate: string;
}

// EJERCICIO 3: lo que devuelve el endpoint protegido /api/tasks/admin/metrics.
export interface TaskMetrics {
  totalTasks: number;
  completedTasks: number;
}
