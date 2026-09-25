/* ============================================================================
 * EJERCICIOS CORREGIDOS (Sesión 2) — Capa de MODELO (persistencia en memoria)
 * Mismo patrón que document.store.ts: solo lee/escribe datos, sin reglas de
 * negocio. Sustituible mañana por una base de datos real sin tocar el service.
 * ========================================================================== */

import { TicketItem, CreateTicketInput } from "../types/ticket.types.js";

class TicketStore {
  private tickets: TicketItem[] = [
    {
      id: 1,
      title: "El login no redirige tras autenticarse",
      description: "Al hacer login correcto, la SPA se queda en blanco.",
      priority: "high",
      status: "open",
      createdAt: "2026-02-01T09:00:00.000Z",
      updatedAt: "2026-02-01T09:00:00.000Z"
    },
    {
      id: 2,
      title: "Exportar PDF tarda más de 10s",
      description: "La generación de PDF de facturas es demasiado lenta.",
      priority: "medium",
      status: "in_progress",
      assignedTo: "Miguel Puch",
      createdAt: "2026-02-02T11:30:00.000Z",
      updatedAt: "2026-02-03T08:15:00.000Z"
    }
  ];

  findAll(): TicketItem[] {
    return [...this.tickets];
  }

  findById(id: number): TicketItem | null {
    const ticket = this.tickets.find(t => t.id === id);
    return ticket ? { ...ticket } : null;
  }

  create(input: CreateTicketInput): TicketItem {
    const nextId = this.tickets.length > 0 ? Math.max(...this.tickets.map(t => t.id)) + 1 : 1;
    const now = new Date().toISOString();
    const newTicket: TicketItem = {
      id: nextId,
      title: input.title.trim(),
      description: input.description.trim(),
      priority: input.priority,
      status: "open",
      createdAt: now,
      updatedAt: now
    };
    this.tickets.push(newTicket);
    return { ...newTicket };
  }

  update(id: number, changes: Partial<TicketItem>): TicketItem | null {
    const index = this.tickets.findIndex(t => t.id === id);
    if (index === -1) return null;

    const updated: TicketItem = { ...this.tickets[index], ...changes };
    this.tickets[index] = updated;
    return { ...updated };
  }

  delete(id: number): boolean {
    const initialLen = this.tickets.length;
    this.tickets = this.tickets.filter(t => t.id !== id);
    return this.tickets.length < initialLen;
  }
}

export const ticketStore = new TicketStore();
