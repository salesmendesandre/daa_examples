import type { Server } from "socket.io";
import type { ClientToServerEvents, DocumentEventPayload, ServerToClientEvents, SocketData } from "./types.js";

type RealtimeServer = Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>;

// Las rutas REST no conocen Socket.IO: solo llaman a emitDocumentEvent().
// Si el servidor de tiempo real no se ha creado (tests con Supertest, scripts), es una operación vacía.
let io: RealtimeServer | null = null;

export function setRealtimeServer(server: RealtimeServer | null): void {
  io = server;
}

type DocumentEventType = "created" | "updated" | "deleted";

interface DocumentLike {
  _id: unknown;
  title: string;
  authorName: string;
  status?: string | null;
}

export function emitDocumentEvent(
  type: DocumentEventType,
  doc: DocumentLike,
  actor: { userId: string; fullName: string }
): void {
  if (!io) return;
  // Carga pequeña: quien la reciba y quiera el documento completo lo pide por REST
  const payload: DocumentEventPayload = {
    id: String(doc._id),
    title: doc.title,
    authorName: doc.authorName,
    status: doc.status ?? "draft",
    by: { userId: actor.userId, fullName: actor.fullName },
    at: new Date().toISOString()
  };
  io.emit(`documents:${type}`, payload);
}
