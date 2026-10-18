// src/services/rag.service.ts
import { RagChunk, RagQueryResponse } from "../types/rag.types.js";

const knowledgeBase: RagChunk[] = [
  {
    id: "chunk-1",
    sourceDoc: "Arquitectura Express 5",
    text: "Express 5 gestiona automáticamente las promesas asíncronas rechazadas en los controladores sin requerir envoltorios tipo express-async-errors."
  },
  {
    id: "chunk-2",
    sourceDoc: "Seguridad JWT",
    text: "Los tokens JWT se transmiten en la cabecera Authorization con el esquema Bearer y deben firmarse con algoritmos seguros como HS256."
  },
  {
    id: "chunk-3",
    sourceDoc: "Validación Zod",
    text: "Zod permite la inferencia de tipos estáticos en tiempo de compilación y valida los datos recibidos en el backend en tiempo de ejecución."
  }
];

export const processRagQuery = (question: string, topK: number = 2): RagQueryResponse => {
  const q = question.toLowerCase();

  // 1. Fase de Recuperación (Retrieval): ranking de fragmentos afines
  const ranked = knowledgeBase
    .map(chunk => {
      let score = 0;
      const terms = q.split(/\s+/);
      for (const term of terms) {
        if (chunk.text.toLowerCase().includes(term)) score += 1;
        if (chunk.sourceDoc.toLowerCase().includes(term)) score += 2;
      }
      return { chunk, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(r => r.chunk);

  // 2. Fase de Aumento (Augmentation): inyección de contexto en la plantilla del prompt
  const contextString = ranked
    .map((c, i) => `[Documento ${i + 1} (${c.sourceDoc})]: ${c.text}`)
    .join("\n\n");

  const augmentedPrompt = `Actúa como un asistente experto en ingeniería de software. Responde a la duda del usuario basándote EXCLUSIVAMENTE en el siguiente contexto extraído:\n\n=== CONTEXTO DOCUMENTAL ===\n${contextString}\n\n=== PREGUNTA ===\n${question}\n\nRespuesta fundamentada:`;

  // 3. Fase de Generación (Generation): respuesta anclada (Grounding)
  const simulatedAnswer = ranked.length > 0
    ? `Según la documentación oficial (${ranked.map(c => c.sourceDoc).join(", ")}): ${ranked[0].text}`
    : "No se localizó información relevante en la base de conocimiento para responder a la consulta planteada.";

  return {
    question,
    retrievedContext: ranked,
    augmentedPrompt,
    simulatedAnswer
  };
};
