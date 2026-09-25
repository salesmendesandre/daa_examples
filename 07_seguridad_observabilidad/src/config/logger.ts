/* ============================================================================
 * CONTENIDO — Observabilidad Profesional con Pino
 * console.log es síncrono (bloquea el hilo bajo carga) y emite texto plano no
 * indexable. Pino emite JSON estructurado con impacto casi nulo en CPU. En
 * desarrollo se formatea bonito con pino-pretty; en producción se deja el
 * JSON crudo (lo consumiría Datadog/Elastic/Grafana Loki, no un humano).
 * ========================================================================== */

import pino from "pino";

const isProduction = process.env.NODE_ENV === "production";

export const logger = pino({
  level: process.env.LOG_LEVEL || "info",
  base: {
    service: "documind-api",
    env: process.env.NODE_ENV || "development"
  },
  transport: !isProduction
    ? {
        target: "pino-pretty",
        options: { colorize: true, translateTime: "SYS:standard", ignore: "pid,hostname" }
      }
    : undefined
});
