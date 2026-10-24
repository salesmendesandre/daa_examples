export const computeEmbedding = (text: string): number[] => {
  const DIMENSIONS = 16;
  const vector = new Array(DIMENSIONS).fill(0);
  const words = text.toLowerCase().split(/\W+/).filter(w => w.length > 2);

  for (const word of words) {
    let hash = 0;
    for (let i = 0; i < word.length; i++) {
      hash = (hash << 5) - hash + word.charCodeAt(i);
      hash |= 0;
    }
    vector[Math.abs(hash) % DIMENSIONS] += 1;
  }

  const norm = Math.sqrt(vector.reduce((sum, val) => sum + val * val, 0));
  return norm === 0 ? vector : vector.map(v => Number((v / norm).toFixed(4)));
};

export const cosineSimilarity = (vecA: number[], vecB: number[]): number => {
  if (vecA.length !== vecB.length || vecA.length === 0) return 0;
  let dotProduct = 0, normA = 0, normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB);
  return denom === 0 ? 0 : Number((dotProduct / denom).toFixed(4));
};
