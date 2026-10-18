// src/services/embedding.service.ts

export interface VectorDocument {
  id: number;
  title: string;
  content: string;
  embedding: number[];
}

// 1. Cálculo de similitud coseno pura:
export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;

  let dotProduct = 0;
  let normA = 0;
  let normB = 0;

  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }

  const denominator = Math.sqrt(normA) * Math.sqrt(normB);
  return denominator === 0 ? 0 : dotProduct / denominator;
};

// 2. Generador pedagógico de embeddings (vector determinista normalizado de 8 dimensiones):
export const generateEmbedding = (text: string): number[] => {
  const hash = Array.from(text.toLowerCase()).reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const rawVector = Array.from({ length: 8 }, (_, i) => Math.sin(hash * (i + 1)));
  const norm = Math.sqrt(rawVector.reduce((acc, val) => acc + val * val, 0));
  return rawVector.map(v => Number((v / norm).toFixed(4)));
};

// 3. Estrategia de fragmentación con solapamiento (Chunking con Overlap):
export const chunkText = (text: string, chunkSize: number = 300, overlap: number = 50): string[] => {
  const words = text.split(/\s+/);
  const chunks: string[] = [];

  for (let i = 0; i < words.length; i += (chunkSize - overlap)) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    if (chunk.trim().length > 0) {
      chunks.push(chunk);
    }
  }

  return chunks;
};
