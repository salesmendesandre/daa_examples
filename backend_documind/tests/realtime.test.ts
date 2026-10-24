import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { createServer } from "node:http";
import type { AddressInfo } from "node:net";
import { io as ioc, type Socket as ClientSocket } from "socket.io-client";
import type { Server } from "socket.io";
import { createToken } from "../src/middlewares/auth.middleware.js";
import { createRealtimeServer, closeRealtimeServer } from "../src/realtime/socket.js";
import { emitDocumentEvent } from "../src/realtime/events.js";

const ana = createToken({ userId: "u-ana", email: "ana@documind.test", role: "user", fullName: "Ana García" });
const luis = createToken({ userId: "u-luis", email: "luis@documind.test", role: "user", fullName: "Luis Pérez" });

// Espera a que un socket reciba un evento (con límite de tiempo para que el test no se cuelgue)
function waitFor<T = unknown>(socket: ClientSocket, event: string, ms = 2000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Timeout esperando "${event}"`)), ms);
    socket.once(event, (data: T) => {
      clearTimeout(timer);
      resolve(data);
    });
  });
}

describe("Socket.IO: tiempo real de DocuMind", () => {
  let io: Server;
  let url: string;
  const clients: ClientSocket[] = [];

  // Conecta un cliente nuevo y lo registra para cerrarlo al final
  function connect(auth: Record<string, unknown>): ClientSocket {
    const socket = ioc(url, { auth, transports: ["websocket"], reconnection: false, forceNew: true });
    clients.push(socket);
    return socket;
  }

  beforeAll(async () => {
    // El evento se ignora (sin error) mientras no exista el servidor de tiempo real
    expect(() =>
      emitDocumentEvent("created", { _id: "x", title: "t", authorName: "a" }, { userId: "u", fullName: "U" })
    ).not.toThrow();

    const httpServer = createServer();
    io = createRealtimeServer(httpServer);
    await new Promise<void>(resolve => httpServer.listen(0, resolve)); // puerto efímero
    url = `http://localhost:${(httpServer.address() as AddressInfo).port}`;
  });

  afterAll(async () => {
    clients.forEach(c => c.disconnect());
    await closeRealtimeServer(io);
  });

  it("rechaza la conexión sin token", async () => {
    const socket = connect({});
    const err = await waitFor<Error>(socket, "connect_error");
    expect(err.message).toMatch(/unauthorized/);
    expect(socket.connected).toBe(false);
  });

  it("rechaza un token con la firma alterada", async () => {
    const socket = connect({ token: `${ana.slice(0, -3)}abc` });
    const err = await waitFor<Error>(socket, "connect_error");
    expect(err.message).toMatch(/inválido/);
  });

  it("acepta un token válido y publica la lista de conectados con el nombre del JWT", async () => {
    const socket = connect({ token: ana });
    const users = await waitFor<Array<{ id: string; fullName: string }>>(socket, "presence:list");
    expect(users).toContainEqual({ id: "u-ana", fullName: "Ana García" });
  });

  it("difunde los mensajes con autor y hora del servidor, ignorando los datos del cliente", async () => {
    const emisor = connect({ token: luis });
    await waitFor(emisor, "connect");
    const receptor = connect({ token: ana });
    await waitFor(receptor, "connect");

    const recibido = waitFor<{ text: string; user: { fullName: string }; at: string }>(receptor, "chat:message");
    const ack = await emisor.timeout(2000).emitWithAck("chat:message", { text: "  Hola  ", user: { fullName: "Admin" } });

    expect(ack.ok).toBe(true);
    const mensaje = await recibido;
    expect(mensaje.text).toBe("Hola");
    expect(mensaje.user.fullName).toBe("Luis Pérez");
    expect(Number.isNaN(Date.parse(mensaje.at))).toBe(false);
  });

  it("rechaza con un ack de error los mensajes vacíos o demasiado largos", async () => {
    const socket = connect({ token: ana });
    await waitFor(socket, "connect");
    const vacio = await socket.timeout(2000).emitWithAck("chat:message", { text: "   " });
    const largo = await socket.timeout(2000).emitWithAck("chat:message", { text: "x".repeat(501) });
    expect(vacio).toEqual({ ok: false, error: expect.stringMatching(/vacío/) });
    expect(largo).toEqual({ ok: false, error: expect.stringMatching(/500/) });
  });

  it("emitDocumentEvent avisa a los clientes conectados con una carga pequeña", async () => {
    const socket = connect({ token: ana });
    await waitFor(socket, "connect");
    const evento = waitFor<Record<string, unknown>>(socket, "documents:updated");

    emitDocumentEvent(
      "updated",
      { _id: "64b7f0c2a1b2c3d4e5f60718", title: "Guía de JWT", authorName: "Luis Pérez", status: "published" },
      { userId: "u-luis", fullName: "Luis Pérez" }
    );

    expect(await evento).toMatchObject({
      id: "64b7f0c2a1b2c3d4e5f60718",
      title: "Guía de JWT",
      by: { userId: "u-luis", fullName: "Luis Pérez" }
    });
  });
});
