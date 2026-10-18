/* ============================================================================
 * EJERCICIO 2: Test del Ciclo Completo CRUD
 * ========================================================================== */

import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("Ciclo de vida completo de una tarea", () => {
  it("debe ejecutar el ciclo de vida completo: Crear -> Consultar -> Actualizar -> Borrar", async () => {
    // 1. Crear tarea:
    const createRes = await request(app)
      .post("/api/tasks")
      .send({ title: "Configurar Vitest", priority: "high", dueDate: "2026-11-01" });
    expect(createRes.status).toBe(201);
    const taskId = createRes.body.data.id;

    // 2. Consultar por ID:
    const getRes = await request(app).get(`/api/tasks/${taskId}`);
    expect(getRes.status).toBe(200);
    expect(getRes.body.data.title).toBe("Configurar Vitest");

    // 3. Modificar estado:
    const patchRes = await request(app)
      .patch(`/api/tasks/${taskId}`)
      .send({ completed: true });
    expect(patchRes.status).toBe(200);
    expect(patchRes.body.data.completed).toBe(true);

    // 4. Eliminar:
    const deleteRes = await request(app).delete(`/api/tasks/${taskId}`);
    expect(deleteRes.status).toBe(204);

    // 5. Confirmar que ya no existe:
    const verifyRes = await request(app).get(`/api/tasks/${taskId}`);
    expect(verifyRes.status).toBe(404);
  });
});
