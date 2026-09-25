/* ============================================================================
 * EJERCICIOS CORREGIDOS (Sesión 2): Sistema de Gestión de Incidencias / Tickets
 * Mismo patrón que documents.service.ts, aplicado a un dominio independiente.
 * Reglas de negocio 100% agnósticas de Express: el acceso a datos vive en
 * models/ticket.store.ts, aquí solo se decide QUÉ hacer con esos datos.
 * ========================================================================== */

import { ticketStore } from "../models/ticket.store.js";
import { TicketItem, CreateTicketInput } from "../types/ticket.types.js";

export class TicketsService {
  // EJERCICIO 1: filtrado exacto por status/priority + ordenación dinámica
  // (+campo asc, -campo desc). Trabaja sobre una COPIA para no mutar el array
  // original al hacer sort() (evita efectos colaterales entre peticiones).
  getTickets(status?: string, priority?: string, sort?: string): TicketItem[] {
    let result = ticketStore.findAll();

    if (status) {
      result = result.filter(t => t.status === status);
    }
    if (priority) {
      result = result.filter(t => t.priority === priority);
    }

    if (sort) {
      const isDesc = sort.startsWith("-");
      const field = (isDesc ? sort.slice(1) : sort) as keyof TicketItem;

      result.sort((a, b) => {
        const valA = String(a[field] ?? "");
        const valB = String(b[field] ?? "");
        const comparison = valA.localeCompare(valB);
        return isDesc ? -comparison : comparison;
      });
    }

    return result;
  }

  getTicketById(id: number): TicketItem {
    const ticket = ticketStore.findById(id);
    if (!ticket) throw new Error("TICKET_NOT_FOUND");
    return ticket;
  }

  // EJERCICIO 3: antes de insertar, comprueba duplicados por título exacto
  // (case-insensitive) entre tickets NO resueltos. Si existe, lanza un error
  // de negocio que el controlador traduce a 409 Conflict (no a 400).
  createTicket(input: CreateTicketInput): TicketItem {
    const { title, description, priority } = input;
    const normalizedTitle = title.trim().toLowerCase();
    const duplicate = ticketStore
      .findAll()
      .find(t => t.status !== "resolved" && t.title.trim().toLowerCase() === normalizedTitle);

    if (duplicate) {
      throw new Error(`DUPLICATE_TICKET:${duplicate.id}`);
    }

    return ticketStore.create({ title, description, priority });
  }

  // EJERCICIO 2: máquina de estados mínima. La única transición prohibida es
  // "open" -> "resolved" directamente (debe pasar por "in_progress" primero).
  // Se comunica como error de negocio distinto (INVALID_TRANSITION) para que
  // el controlador responda 422 en vez de 400/404.
  updateStatus(id: number, newStatus: TicketItem["status"]): TicketItem {
    const ticket = ticketStore.findById(id);
    if (!ticket) throw new Error("TICKET_NOT_FOUND");

    if (ticket.status === "open" && newStatus === "resolved") {
      throw new Error("INVALID_TRANSITION:No se puede resolver un ticket que no ha estado en progreso.");
    }

    const updated = ticketStore.update(id, { status: newStatus, updatedAt: new Date().toISOString() });
    return updated!;
  }

  deleteTicket(id: number): void {
    const deleted = ticketStore.delete(id);
    if (!deleted) {
      throw new Error("TICKET_NOT_FOUND");
    }
  }
}

export const ticketsService = new TicketsService();
