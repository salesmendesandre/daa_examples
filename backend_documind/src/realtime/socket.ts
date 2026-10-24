import type { Server as HttpServer } from "node:http";
import { randomUUID } from "node:crypto";
import { Server } from "socket.io";
import { allowedOrigins } from "../config/cors.js";
import { logger } from "../config/logger.js";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { ChatMessageSchema } from "../schemas/chat.schema.js";
import { setRealtimeServer } from "./events.js";
import type { ChatMessage, ClientToServerEvents, ConnectedUser, ServerToClientEvents, SocketData } from "./types.js";

const HISTORY_SIZE = 50;

/**
 * Crea el servidor de Socket.IO sobre el mismo servidor HTTP que Express
 * (mismo puerto) y registra la autenticación, la presencia y el chat.
 */
export function createRealtimeServer(httpServer: HttpServer) {
  const io = new Server<ClientToServerEvents, ServerToClientEvents, Record<string, never>, SocketData>(httpServer, {
    // Los mismos orígenes que Express. Ojo: CORS solo afecta al transporte HTTP (long-polling);
    // la protección real de cada conexión es el JWT que se comprueba en io.use().
    cors: { origin: allowedOrigins }
  });

  // Presencia: userId → { nombre, nº de conexiones } (un usuario puede tener varias pestañas)
  const online = new Map<string, { fullName: string; connections: number }>();
  // Últimos mensajes en memoria: se pierden al reiniciar el servidor (suficiente para el curso)
  const history: ChatMessage[] = [];

  const onlineUsers = (): ConnectedUser[] =>
    [...online.entries()]
      .map(([id, { fullName }]) => ({ id, fullName }))
      .sort((a, b) => a.fullName.localeCompare(b.fullName, "es"));

  // 1. Autenticación en el handshake: se ejecuta UNA vez por conexión, antes de "connection"
  io.use((socket, next) => {
    const token = socket.handshake.auth?.token;
    if (typeof token !== "string" || token.length === 0) {
      return next(new Error("unauthorized: token ausente"));
    }
    try {
      const payload = verifyToken(token);
      socket.data.user = { id: payload.userId, fullName: payload.fullName, role: payload.role };

      // El token se comprobó al conectar; si caduca con la conexión abierta, la cerramos nosotros
      if (payload.exp) {
        const ms = payload.exp * 1000 - Date.now();
        const timer = setTimeout(() => socket.disconnect(true), ms);
        socket.once("disconnect", () => clearTimeout(timer));
      }
      next();
    } catch {
      next(new Error("unauthorized: token inválido o caducado"));
    }
  });

  // 2. Cada conexión ya autenticada
  io.on("connection", socket => {
    const { user } = socket.data;
    const entry = online.get(user.id);
    online.set(user.id, { fullName: user.fullName, connections: (entry?.connections ?? 0) + 1 });
    logger.info({ userId: user.id, socketId: socket.id }, "[Socket.IO] Conexión autenticada");

    socket.emit("chat:history", history);
    io.emit("presence:list", onlineUsers());

    socket.on("chat:message", (payload, ack) => {
      // El cliente puede no pedir confirmación (o enviar cualquier cosa en su lugar)
      const reply = typeof ack === "function" ? ack : () => {};
      const parsed = ChatMessageSchema.safeParse(payload);
      if (!parsed.success) {
        reply({ ok: false, error: parsed.error.issues[0]?.message ?? "Mensaje no válido" });
        return;
      }
      // Autor y hora los pone el servidor: un cliente no puede hacerse pasar por otro
      const message: ChatMessage = {
        id: randomUUID(),
        text: parsed.data.text,
        user: { id: user.id, fullName: user.fullName },
        at: new Date().toISOString()
      };
      history.push(message);
      if (history.length > HISTORY_SIZE) history.shift();

      io.emit("chat:message", message); // a todos, también al emisor
      reply({ ok: true, message });
    });

    socket.on("disconnect", reason => {
      const current = online.get(user.id);
      if (current && current.connections > 1) {
        online.set(user.id, { ...current, connections: current.connections - 1 });
      } else {
        online.delete(user.id);
      }
      logger.info({ userId: user.id, reason }, "[Socket.IO] Desconexión");
      io.emit("presence:list", onlineUsers());
    });
  });

  setRealtimeServer(io);
  return io;
}

/** Cierra el servidor de tiempo real (lo usan los tests) */
export async function closeRealtimeServer(io: Server): Promise<void> {
  setRealtimeServer(null);
  await io.close();
}
