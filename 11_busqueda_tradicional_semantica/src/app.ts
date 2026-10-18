// src/app.ts
import express, { Request, Response } from "express";
import { cosineSimilarity, generateEmbedding, VectorDocument } from "./services/embedding.service.js";

export const app = express();
const PORT = process.env.PORT || 3011;

app.use(express.json());

const corpus: VectorDocument[] = [
  {
    id: 1,
    title: "Seguridad y Autenticación con JWT",
    content: "Guía completa para emitir y validar tokens JSON Web Token firmados con HMAC-SHA256 en Express.",
    embedding: generateEmbedding("Guía completa para emitir y validar tokens JSON Web Token firmados con HMAC-SHA256 en Express.")
  },
  {
    id: 2,
    title: "Receta de Paella Tradicional",
    content: "Ingredientes indispensables: arroz bomba, azafrán, pollo, conejo y verduras frescas de la huerta.",
    embedding: generateEmbedding("Ingredientes indispensables: arroz bomba, azafrán, pollo, conejo y verduras frescas de la huerta.")
  }
];

app.post("/api/documents/semantic-search", (req: Request, res: Response) => {
  const { query, limit = 5 } = req.body;

  if (!query || typeof query !== "string") {
    return res.status(400).json({ error: "Debe proporcionar una consulta 'query' de tipo string" });
  }

  const queryVector = generateEmbedding(query);

  const results = corpus
    .map(doc => ({
      id: doc.id,
      title: doc.title,
      content: doc.content,
      score: Number(cosineSimilarity(queryVector, doc.embedding).toFixed(4))
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, Number(limit));

  res.json({
    status: "success",
    query,
    totalResults: results.length,
    results
  });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`[Semantic Search API] Servidor activo en http://localhost:${PORT}`);
  });
}
