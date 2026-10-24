// Contrato de eventos de Socket.IO de DocuMind. Tiparlo hace que socket.emit()/socket.on()
// comprueben nombres y cargas en tiempo de compilación, igual que Zod hace con REST.

export interface ConnectedUser {
  id: string;
  fullName: string;
}

export interface DocumentEventPayload {
  id: string;
  title: string;
  authorName: string;
  status: string;
  by: { userId: string; fullName: string }; // quién hizo el cambio
  at: string; // ISO 8601, hora del servidor
}

export interface ChatMessage {
  id: string;
  text: string;
  user: ConnectedUser;
  at: string;
}

export type ChatAck = { ok: true; message: ChatMessage } | { ok: false; error: string };

export interface ServerToClientEvents {
  "documents:created": (payload: DocumentEventPayload) => void;
  "documents:updated": (payload: DocumentEventPayload) => void;
  "documents:deleted": (payload: DocumentEventPayload) => void;
  "presence:list": (users: ConnectedUser[]) => void;
  "chat:history": (messages: ChatMessage[]) => void;
  "chat:message": (message: ChatMessage) => void;
}

export interface ClientToServerEvents {
  "chat:message": (payload: unknown, ack?: (response: ChatAck) => void) => void;
}

// socket.data: lo que guardamos en cada conexión tras verificar el token
export interface SocketData {
  user: ConnectedUser & { role: string };
}
