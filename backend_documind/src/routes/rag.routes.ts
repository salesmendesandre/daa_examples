import { Router, Request, Response } from "express";
import { RagQuerySchema } from "../schemas/document.schema.js";
import { validateBody } from "../middlewares/validate.middleware.js";
import { authenticate } from "../middlewares/auth.middleware.js";
import { logger } from "../config/logger.js";
import {
  buildAugmentedPrompt,
  composeSimulatedAnswer,
  generateAnswerStream,
  retrieveContext
} from "../services/rag.service.js";

const router = Router();

// Respuesta completa en un único JSON (capítulo 12)
router.post("/query", validateBody(RagQuerySchema), async (req: Request, res: Response) => {
  const { question, topK } = req.body;

  const context = await retrieveContext(question, topK); // 1. Retrieval
  const augmentedPrompt = buildAugmentedPrompt(question, context); // 2. Augmentation
  const answer = composeSimulatedAnswer(context); // 3. Generation (simulada)

  res.json({ question, context, augmentedPrompt, answer });
});

// Escribe un evento con el formato de Server-Sent Events: "event: <nombre>\ndata: <json>\n\n"
function sendEvent(res: Response, event: string, data: unknown) {
  res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

/**
 * Respuesta en streaming (capítulo 27). Es un POST (la pregunta va en el cuerpo y el token en
 * la cabecera Authorization) cuya respuesta usa el formato text/event-stream:
 *   event: sources → { context }          (primero, en cuanto termina la recuperación)
 *   event: token   → { text }             (uno por fragmento de la respuesta)
 *   event: done    → { answer, simulated } (al final)
 *   event: error   → { error }            (si algo falla a mitad)
 */
router.post("/stream", authenticate, validateBody(RagQuerySchema), async (req: Request, res: Response) => {
  const { question, topK } = req.body;

  // Si el cliente cierra la conexión (botón «Detener», cambio de página), dejamos de generar.
  // Se escucha en `res`: su evento "close" indica que la respuesta ya no llegará a nadie.
  const controller = new AbortController();
  res.on("close", () => {
    if (!res.writableEnded) controller.abort();
  });

  res.status(200).set({
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache, no-transform",
    Connection: "keep-alive",
    "X-Accel-Buffering": "no" // evita que un proxy (nginx) acumule la respuesta
  });
  res.flushHeaders();

  try {
    const context = await retrieveContext(question, topK);
    sendEvent(res, "sources", { context });

    const prompt = buildAugmentedPrompt(question, context);
    const delayMs = Number(process.env.RAG_STREAM_DELAY_MS ?? 40);
    let answer = "";
    for await (const text of generateAnswerStream(prompt, context, { signal: controller.signal, delayMs })) {
      answer += text;
      sendEvent(res, "token", { text });
    }

    if (controller.signal.aborted) return; // nadie escucha ya
    sendEvent(res, "done", { answer, simulated: true });
    res.end();
  } catch (err) {
    // Las cabeceras (200) ya se enviaron: el error se comunica como un evento más
    logger.error({ err }, "[RAG] Error durante el streaming");
    if (!res.writableEnded) {
      sendEvent(res, "error", { error: "Error al generar la respuesta" });
      res.end();
    }
  }
});

export default router;
