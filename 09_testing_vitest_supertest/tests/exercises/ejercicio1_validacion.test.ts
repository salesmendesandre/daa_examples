/* ============================================================================
 * EJERCICIO 1: Test de Validación de Entradas Defensivas (400 Bad Request)
 * La API valida con Zod (schemas/task.schema.ts), así que el error llega con
 * el formato de la semana 4: { status: "fail", error: "ValidationError",
 * message: <genérico>, details: [{ field, message }] }. Por eso el mensaje
 * concreto ("El título es obligatorio") se busca en details y no en message
 * (único cambio respecto a la solución del libro).
 * ========================================================================== */

import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("Validación en POST /api/tasks", () => {
  it("debe responder con 400 Bad Request si el título está ausente", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ priority: "medium", dueDate: "2026-10-01" });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("fail");
    expect(res.body.error).toBe("ValidationError");
    expect(res.body.details).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "title", message: expect.stringMatching(/título es obligatorio/i) })
      ])
    );
  });

  it("debe responder con 400 Bad Request si la prioridad es inválida", async () => {
    const res = await request(app)
      .post("/api/tasks")
      .send({ title: "Revisar arquitectura", priority: "urgent" });

    expect(res.status).toBe(400);
    expect(res.body.status).toBe("fail");
  });
});

// CHULETA — añadidos: antes el PATCH hacía Object.assign(task, req.body) sin
// validar, así que la prioridad "urgent" que el POST rechaza se colaba por el
// PATCH, y se podía cambiar hasta el id de la tarea (comprobado).
describe("Validación en PATCH /api/tasks/:id", () => {
  it("debe rechazar con 400 una prioridad inválida también al modificar", async () => {
    const created = await request(app).post("/api/tasks").send({ title: "Tarea a modificar", priority: "low" });

    const res = await request(app)
      .patch(`/api/tasks/${created.body.data.id}`)
      .send({ priority: "urgent" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("ValidationError");
  });

  it("no debe permitir cambiar el id de una tarea", async () => {
    const created = await request(app).post("/api/tasks").send({ title: "Tarea con id fijo" });
    const id = created.body.data.id;

    const res = await request(app).patch(`/api/tasks/${id}`).send({ id: 999, completed: true });

    expect(res.status).toBe(200);
    expect(res.body.data.id).toBe(id);
    expect(res.body.data.completed).toBe(true);
    expect((await request(app).get("/api/tasks/999")).status).toBe(404);
  });
});
