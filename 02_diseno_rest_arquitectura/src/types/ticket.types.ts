// EJERCICIOS CORREGIDOS (Sesión 2): Sistema de Gestión de Incidencias / Tickets

export interface TicketItem {
  id: number;
  title: string;
  description: string;
  priority: "low" | "medium" | "high";
  status: "open" | "in_progress" | "resolved";
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicketInput {
  title: string;
  description: string;
  priority: TicketItem["priority"];
}
