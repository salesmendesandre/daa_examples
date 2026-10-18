// src/app.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { processRagQuery } from "./services/rag.service.js";

export const app = express();
const PORT = process.env.PORT || 3012;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

app.post("/api/rag/ask", (req: Request, res: Response) => {
  const { question, topK = 2 } = req.body;

  if (!question || typeof question !== "string") {
    return res.status(400).json({ error: "Debe proporcionar una pregunta 'question' de tipo string" });
  }

  const result = processRagQuery(question, Number(topK));
  res.json({ status: "success", data: result });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`[RAG API] Servidor activo en http://localhost:${PORT}`);
  });
}
