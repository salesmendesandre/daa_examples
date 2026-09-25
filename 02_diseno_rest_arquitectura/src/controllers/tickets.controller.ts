/* ============================================================================
 * EJERCICIOS CORREGIDOS (Sesión 2): Sistema de Gestión de Incidencias / Tickets
 * Mismo patrón que documents.controller.ts, aplicado a un dominio independiente.
 * ========================================================================== */

import { Request, Response } from "express";
import { ticketsService } from "../services/tickets.service.js";

export class TicketsController {
  // EJERCICIO 1: expone status/priority/sort como query params opcionales.
  getAll = (req: Request, res: Response) => {
    const { status, priority, sort } = req.query;
    const data = ticketsService.getTickets(
      typeof status === "string" ? status : undefined,
      typeof priority === "string" ? priority : undefined,
      typeof sort === "string" ? sort : undefined
    );
    res.json({ status: "success", count: data.length, data });
  };

  getById = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ status: "fail", message: "El ID debe ser un número entero válido" });
    }
    try {
      const ticket = ticketsService.getTicketById(id);
      res.json({ status: "success", data: ticket });
    } catch (err: any) {
      if (err.message === "TICKET_NOT_FOUND") {
        return res.status(404).json({ status: "fail", message: "Ticket no encontrado" });
      }
      res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
  };

  // EJERCICIO 3: 409 Conflict (no 400) cuando el servicio detecta un ticket
  // duplicado — es un conflicto con el estado actual del recurso, no un dato
  // mal formado.
  create = (req: Request, res: Response) => {
    const { title, description, priority } = req.body;
    try {
      const ticket = ticketsService.createTicket({ title, description, priority });
      res.status(201).json({ status: "success", data: ticket });
    } catch (err: any) {
      if (err.message?.startsWith("DUPLICATE_TICKET")) {
        const existingId = err.message.split(":")[1];
        return res.status(409).json({
          status: "fail",
          error: "Conflict",
          message: `Ya existe un ticket abierto idéntico con el ID #${existingId}.`
        });
      }
      res.status(400).json({ status: "fail", message: err.message });
    }
  };

  // EJERCICIO 2: endpoint especializado PATCH /:id/status (no un PATCH /:id
  // genérico) porque cambiar de estado es una transición de máquina de
  // estados con reglas propias, no una simple actualización de campo.
  // 422 Unprocessable Entity: el JSON está bien formado, pero la operación
  // no tiene sentido de negocio en el estado actual (distinto de 400).
  updateStatus = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    const { status } = req.body;

    if (!["open", "in_progress", "resolved"].includes(status)) {
      return res.status(400).json({ status: "fail", message: "Estado de ticket inválido" });
    }

    try {
      const updated = ticketsService.updateStatus(id, status);
      res.json({ status: "success", data: updated });
    } catch (err: any) {
      if (err.message === "TICKET_NOT_FOUND") {
        return res.status(404).json({ status: "fail", message: "Ticket no encontrado" });
      }
      if (err.message?.startsWith("INVALID_TRANSITION")) {
        return res.status(422).json({ status: "fail", message: err.message.split(":")[1] });
      }
      res.status(500).json({ status: "error", message: "Error interno" });
    }
  };

  delete = (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ status: "fail", message: "El ID debe ser numérico" });
    }
    try {
      ticketsService.deleteTicket(id);
      res.status(204).send();
    } catch (err: any) {
      if (err.message === "TICKET_NOT_FOUND") {
        return res.status(404).json({ status: "fail", message: "Ticket no encontrado" });
      }
      res.status(500).json({ status: "error", message: "Error interno del servidor" });
    }
  };
}

export const ticketsController = new TicketsController();
