// src/types/rag.types.ts

export interface RagChunk {
  id: string;
  sourceDoc: string;
  text: string;
}

export interface RagQueryRequest {
  question: string;
  topK?: number;
}

export interface RagQueryResponse {
  question: string;
  retrievedContext: RagChunk[];
  augmentedPrompt: string;
  simulatedAnswer: string;
}
