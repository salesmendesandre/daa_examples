/* CONTENIDO DE LA SESIÓN — Suite de Pruebas de Integración */

import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("Suite de Integración: API de Documentos", () => {
  describe("GET /api/documents", () => {
    it("debe responder con 200 OK y la lista inicial de documentos", async () => {
      const response = await request(app).get("/api/documents");

      expect(response.status).toBe(200);
      expect(response.body.status).toBe("success");
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
    });
  });

  describe("POST /api/documents", () => {
    it("debe rechazar con 400 Bad Request si el título es demasiado corto", async () => {
      const payloadInvalido = { title: "A", author: "Autor Válido" };
      const response = await request(app).post("/api/documents").send(payloadInvalido);

      expect(response.status).toBe(400);
      expect(response.body.status).toBe("fail");
      expect(response.body.error).toBe("ValidationError");
    });

    it("debe crear un documento y responder con 201 Created ante payload válido", async () => {
      const payloadValido = { title: "Patrones de Diseño en TypeScript", author: "Gang of Four" };
      const response = await request(app).post("/api/documents").send(payloadValido);

      expect(response.status).toBe(201);
      expect(response.body.status).toBe("success");
      expect(response.body.data).toHaveProperty("id");
      expect(response.body.data.title).toBe(payloadValido.title);
    });
  });

  describe("GET /api/documents/:id", () => {
    it("debe responder con 404 Not Found si el ID solicitado no existe", async () => {
      const response = await request(app).get("/api/documents/99999");

      expect(response.status).toBe(404);
      expect(response.body.status).toBe("fail");
    });
  });
});
