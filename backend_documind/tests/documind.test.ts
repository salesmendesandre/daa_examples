import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../src/app.js";
import { createToken } from "../src/middlewares/auth.middleware.js";
import { RegisterSchema } from "../src/schemas/auth.schema.js";

describe("DocuMind API Suite", () => {
  it("GET /health debe retornar 200 y el estado de salud", async () => {
    const res = await request(app).get("/health");
    expect(res.status).toBe(200);
    expect(res.body.status).toBe("ok");
    expect(res.body.app).toBe("DocuMind Master API");
  });

  it("GET /api/docs/ debe servir la interfaz Swagger UI", async () => {
    const res = await request(app).get("/api/docs/");
    expect(res.status).toBe(200);
    expect(res.text).toContain("swagger-ui");
  });

  it("GET /ruta-inexistente debe devolver 404 estructurado", async () => {
    const res = await request(app).get("/api/ruta-que-no-existe");
    expect(res.status).toBe(404);
    expect(res.body).toHaveProperty("error");
  });

  it("POST /api/auth/register debe validar los campos requeridos con Zod", async () => {
    const res = await request(app)
      .post("/api/auth/register")
      .send({ email: "correo-invalido", password: "123" });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("fail");
    expect(res.body.details.length).toBeGreaterThan(0);
  });

  it("RegisterSchema descarta el campo role para impedir registrarse como admin", () => {
    const datos = RegisterSchema.parse({
      email: "  Eva@Correo.ES ",
      password: "contraseña-segura",
      fullName: "Eva",
      role: "admin"
    });
    expect(datos).not.toHaveProperty("role");
    expect(datos.email).toBe("eva@correo.es");
  });

  it("POST /api/documents sin token Bearer debe devolver 401 Unauthorized", async () => {
    const res = await request(app)
      .post("/api/documents")
      .send({ title: "Sin Auth", content: "No debe permitir crearlo" });

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("error");
  });
  describe("PATCH /api/documents/:id", () => {
    const token = createToken({ userId: "u1", email: "ana@documind.test", role: "user", fullName: "Ana García" });
    const validId = "64b7f0c2a1b2c3d4e5f60718";

    it("sin token Bearer devuelve 401", async () => {
      const res = await request(app).patch(`/api/documents/${validId}`).send({ title: "Nuevo título" });
      expect(res.status).toBe(401);
    });

    it("con un id mal formado devuelve 400 sin consultar la base de datos", async () => {
      const res = await request(app)
        .patch("/api/documents/no-es-un-id")
        .set("Authorization", `Bearer ${token}`)
        .send({ title: "Nuevo título" });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/identificador/i);
    });

    it("con el cuerpo vacío devuelve 400 de validación", async () => {
      const res = await request(app)
        .patch(`/api/documents/${validId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({});
      expect(res.status).toBe(400);
      expect(res.body.status).toBe("fail");
    });

    it("rechaza campos que no se pueden modificar (authorId)", async () => {
      const res = await request(app)
        .patch(`/api/documents/${validId}`)
        .set("Authorization", `Bearer ${token}`)
        .send({ authorId: "otro-usuario" });
      expect(res.status).toBe(400);
    });
  });

  describe("CORS para el frontend de Vue", () => {
    it("permite el origen del servidor de desarrollo de Vite", async () => {
      const res = await request(app).get("/health").set("Origin", "http://localhost:5173");
      expect(res.headers["access-control-allow-origin"]).toBe("http://localhost:5173");
    });

    it("no añade la cabecera CORS para orígenes no permitidos", async () => {
      const res = await request(app).get("/health").set("Origin", "https://otro-sitio.example");
      expect(res.headers["access-control-allow-origin"]).toBeUndefined();
    });
  });

  describe("POST /api/documents/upload-pdf: errores de subida claros para el frontend", () => {
    const token = createToken({ userId: "u1", email: "ana@documind.test", role: "user", fullName: "Ana García" });

    it("rechaza tipos no admitidos con 415", async () => {
      const res = await request(app)
        .post("/api/documents/upload-pdf")
        .set("Authorization", `Bearer ${token}`)
        .attach("file", Buffer.from([0x89, 0x50, 0x4e, 0x47]), { filename: "foto.png", contentType: "image/png" });
      expect(res.status).toBe(415);
      expect(res.body.error).toMatch(/PDF/);
    });

    it("rechaza ficheros de más de 10 MB con 413", async () => {
      const big = Buffer.alloc(10 * 1024 * 1024 + 1, 0x20);
      const res = await request(app)
        .post("/api/documents/upload-pdf")
        .set("Authorization", `Bearer ${token}`)
        .attach("file", big, { filename: "grande.pdf", contentType: "application/pdf" });
      expect(res.status).toBe(413);
      expect(res.body.error).toMatch(/10 MB/);
    });

    it("devuelve 400 si 'tags' no es un array JSON", async () => {
      const res = await request(app)
        .post("/api/documents/upload-pdf")
        .set("Authorization", `Bearer ${token}`)
        .field("tags", "vue, apuntes")
        .attach("file", Buffer.from("%PDF-1.4 falso"), { filename: "a.pdf", contentType: "application/pdf" });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/tags/);
    });

    it("devuelve 400 (no 500) si el PDF está dañado", async () => {
      const res = await request(app)
        .post("/api/documents/upload-pdf")
        .set("Authorization", `Bearer ${token}`)
        .attach("file", Buffer.from("esto no es un pdf"), { filename: "roto.pdf", contentType: "application/pdf" });
      expect(res.status).toBe(400);
      expect(res.body.error).toMatch(/PDF/);
    });
  });
});
