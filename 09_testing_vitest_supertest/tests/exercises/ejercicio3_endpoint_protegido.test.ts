/* ============================================================================
 * EJERCICIO 3: Test de Seguridad de Endpoints Protegidos (401 Unauthorized)
 * ========================================================================== */

import { describe, it, expect } from "vitest";
import request from "supertest";
import { app } from "../../src/app.js";

describe("Seguridad en endpoints de administración", () => {
  it("debe rechazar con 401 si se omite la cabecera Authorization", async () => {
    const res = await request(app).get("/api/tasks/admin/metrics");
    expect(res.status).toBe(401);
    expect(res.body.status).toBe("fail");
  });

  it("debe rechazar con 401 si el token proporcionado está manipulado", async () => {
    const res = await request(app)
      .get("/api/tasks/admin/metrics")
      .set("Authorization", "Bearer token_falso_manipulado");

    expect(res.status).toBe(401);
    expect(res.body.error).toBe("InvalidToken");
  });

  it("debe aceptar con 200 un token de demo válido", async () => {
    const tokenRes = await request(app).get("/api/tasks/admin/token-demo");
    const { token } = tokenRes.body;

    const res = await request(app)
      .get("/api/tasks/admin/metrics")
      .set("Authorization", `Bearer ${token}`);

    expect(res.status).toBe(200);
    expect(res.body.status).toBe("success");
  });
});
