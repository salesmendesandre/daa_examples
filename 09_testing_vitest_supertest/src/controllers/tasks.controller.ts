/* ============================================================================
 * CAPA DE CONTROLADOR — Tareas (EJERCICIOS, punto 5)
 * ========================================================================== */

import { Request, Response } from "express";
import { tasksService } from "../services/tasks.service.js";
import { tokenService } from "../services/token.service.js";

export const getAllTasks = (_req: Request, res: Response) => {
  const tasks = tasksService.getAllTasks();
  res.json({ status: "success", count: tasks.length, data: tasks });
};

export const getTaskById = (req: Request, res: Response) => {
  res.json({ status: "success", data: tasksService.getTaskById(Number(req.params.id)) });
};

// EJERCICIO 1: si llega aquí, CreateTaskSchema ya ha validado title/priority.
export const createTask = (req: Request, res: Response) => {
  res.status(201).json({ status: "success", data: tasksService.createTask(req.body) });
};

export const updateTask = (req: Request, res: Response) => {
  res.json({ status: "success", data: tasksService.updateTask(Number(req.params.id), req.body) });
};

// EJERCICIO 2: 204 No Content -> sin cuerpo.
export const deleteTask = (req: Request, res: Response) => {
  tasksService.deleteTask(Number(req.params.id));
  res.status(204).send();
};

// EJERCICIO 3
export const getMetrics = (_req: Request, res: Response) => {
  res.json({ status: "success", data: tasksService.getMetrics() });
};

export const getDemoToken = (_req: Request, res: Response) => {
  res.json({ token: tokenService.generateDemoToken() });
};
