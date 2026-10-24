import { afterEach, beforeAll, describe, expect, it, vi } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { createToken } from "../src/middlewares/auth.middleware.js";
import { DocumentModel } from "../src/models/document.model.js";
import { computeEmbedding } from "../src/services/embedding.util.js";

const token = createToken({ userId: "u1", email: "ana@documind.test", role: "user", fullName: "Ana García" });

// Sustituimos la consulta a MongoDB por dos documentos en memoria: el test no necesita base de datos
const docs = [
  {
    _id: "64b7f0c2a1b2c3d4e5f60718",
    title: "Autenticación con JWT",
    content: "Los tokens JWT se firman con un secreto y se envían en la cabecera Authorization.",
    embedding: computeEmbedding("Autenticación con JWT tokens firmados secreto cabecera Authorization")
  },
  {
    _id: "64b7f0c2a1b2c3d4e5f60719",
    title: "Subida de PDF con Multer",
    content: "Multer recibe ficheros multipart y pdf-parse extrae su texto para indexarlo.",
    embedding: computeEmbedding("Subida de PDF con Multer ficheros multipart pdf-parse texto")
  }
];

// Convierte el cuerpo text/event-stream en una lista de { event, data }
function parseSse(body: string) {
  return body
    .split("\n\n")
    .filter(Boolean)
    .map(block => {
      const event = /^event: (.+)$/m.exec(block)?.[1];
      const data = /^data: (.+)$/m.exec(block)?.[1];
      return { event, data: data ? JSON.parse(data) : null };
    });
}

describe("POST /api/rag/stream (Server-Sent Events)", () => {
  beforeAll(() => {
    process.env.RAG_STREAM_DELAY_MS = "0"; // sin pausas entre tokens en los tests
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("sin token devuelve 401", async () => {
    const res = await request(app).post("/api/rag/stream").send({ question: "¿Qué es JWT?" });
    expect(res.status).toBe(401);
  });

  it("valida la pregunta con Zod (400 antes de empezar el stream)", async () => {
    const res = await request(app)
      .post("/api/rag/stream")
      .set("Authorization", `Bearer ${token}`)
      .send({ question: "a" });
    expect(res.status).toBe(400);
    expect(res.headers["content-type"]).toMatch(/json/);
  });

  it("envía primero las fuentes, después los tokens y al final el evento done", async () => {
    vi.spyOn(DocumentModel, "find").mockReturnValue({ exec: async () => docs } as never);

    const res = await request(app)
      .post("/api/rag/stream")
      .set("Authorization", `Bearer ${token}`)
      .send({ question: "¿Cómo se firman los tokens JWT?", topK: 2 });

    expect(res.status).toBe(200);
    expect(res.headers["content-type"]).toMatch(/^text\/event-stream/);

    const events = parseSse(res.text);
    expect(events[0].event).toBe("sources");
    expect(events[0].data.context[0]).toMatchObject({ title: "Autenticación con JWT" });

    const tokens = events.filter(e => e.event === "token");
    expect(tokens.length).toBeGreaterThan(3);

    const last = events.at(-1)!;
    expect(last.event).toBe("done");
    expect(last.data.simulated).toBe(true);
    // La respuesta final es la concatenación de todos los tokens
    expect(last.data.answer).toBe(tokens.map(t => t.data.text).join(""));
  });

  it("sin documentos relacionados responde sin inventar (y sin fuentes)", async () => {
    vi.spyOn(DocumentModel, "find").mockReturnValue({ exec: async () => [] } as never);

    const res = await request(app)
      .post("/api/rag/stream")
      .set("Authorization", `Bearer ${token}`)
      .send({ question: "¿Cuál es la capital de Francia?" });

    const events = parseSse(res.text);
    expect(events[0]).toEqual({ event: "sources", data: { context: [] } });
    expect(events.at(-1)!.data.answer).toMatch(/no he encontrado/i);
  });
});
