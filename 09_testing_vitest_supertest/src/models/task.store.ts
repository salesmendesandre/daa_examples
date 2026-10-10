/* ============================================================================
 * CAPA DE MODELO — Tareas en memoria (EJERCICIOS, punto 5)
 * El id lo genera un contador que nunca se reutiliza: aunque se borre una
 * tarea (Ejercicio 2), la siguiente no puede heredar su id.
 * ========================================================================== */

import { TaskItem } from "../types/task.types.js";

class TaskStore {
  private tasks: TaskItem[] = [];
  private nextId = 1;

  findAll(): TaskItem[] {
    return this.tasks;
  }

  findById(id: number): TaskItem | undefined {
    return this.tasks.find(t => t.id === id);
  }

  create(data: Omit<TaskItem, "id">): TaskItem {
    const nueva: TaskItem = { id: this.nextId++, ...data };
    this.tasks.push(nueva);
    return nueva;
  }

  update(id: number, patch: Partial<Omit<TaskItem, "id">>): TaskItem | undefined {
    const task = this.findById(id);
    if (!task) return undefined;
    Object.assign(task, patch);
    return task;
  }

  delete(id: number): boolean {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }
}

export const taskStore = new TaskStore();
