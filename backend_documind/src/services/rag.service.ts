import { DocumentModel } from "../models/document.model.js";
import { computeEmbedding, cosineSimilarity } from "./embedding.util.js";

export interface ContextChunk {
  documentId: string;
  title: string;
  snippet: string;
  similarity: number;
}

// 1. Retrieval: los topK documentos publicados más parecidos a la pregunta
export async function retrieveContext(question: string, topK: number): Promise<ContextChunk[]> {
  const questionVector = computeEmbedding(question);
  const documents = await DocumentModel.find({ status: "published" }).exec();

  return documents
    .map(doc => ({ doc, score: cosineSimilarity(questionVector, doc.embedding || []) }))
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map(r => ({
      documentId: String(r.doc._id),
      title: r.doc.title,
      snippet: r.doc.content.slice(0, 300),
      similarity: r.score
    }));
}

// 2. Augmentation: el prompt que recibiría un LLM real, con las fuentes numeradas
export function buildAugmentedPrompt(question: string, context: ContextChunk[]): string {
  const contextText = context.map((c, i) => `[Fuente ${i + 1}: ${c.title}]: ${c.snippet}`).join("\n\n");
  return `Eres DocuMind Assistant. Responde a la siguiente pregunta usando la información técnica provista:\n\n=== CONTEXTO DOCUMENTAL ===\n${contextText}\n\n=== PREGUNTA ===\n${question}`;
}

// Corta un texto en la última palabra completa antes de `max` caracteres
function cutAtWord(text: string, max: number): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max);
  return `${cut.slice(0, cut.lastIndexOf(" ") > 0 ? cut.lastIndexOf(" ") : max)}…`;
}

// Respuesta SIMULADA: compone un texto a partir de las fuentes, citándolas como [1], [2]…
export function composeSimulatedAnswer(context: ContextChunk[]): string {
  if (context.length === 0) {
    return "No he encontrado documentos publicados relacionados con tu pregunta, así que prefiero no inventar una respuesta.";
  }
  const [first, ...rest] = context;
  const others = rest.map((c, i) => `«${c.title}» [${i + 2}]`).join(" y ");
  return [
    `Según «${first.title}» [1]: ${cutAtWord(first.snippet, 220)}`,
    others ? `También puede interesarte ${others}.` : "",
    "(Respuesta simulada: DocuMind no usa todavía un modelo de lenguaje; comprueba siempre las fuentes.)"
  ]
    .filter(Boolean)
    .join("\n\n");
}

const sleep = (ms: number, signal?: AbortSignal) =>
  new Promise<void>(resolve => {
    if (ms <= 0 || signal?.aborted) return resolve();
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener("abort", () => { clearTimeout(timer); resolve(); }, { once: true });
  });

/**
 * 3. Generation en streaming: produce la respuesta trozo a trozo.
 *
 * ES EL ÚNICO PUNTO QUE CAMBIARÍA CON UN LLM REAL: en lugar de partir un texto simulado,
 * llamarías a la API de streaming del proveedor con `prompt` y harías `yield` de cada
 * fragmento que devuelva, pasándole `signal` para cancelar la generación si el cliente se va.
 */
export async function* generateAnswerStream(
  prompt: string,
  context: ContextChunk[],
  { signal, delayMs = 40 }: { signal?: AbortSignal; delayMs?: number } = {}
): AsyncGenerator<string> {
  void prompt; // un LLM real lo usaría; la simulación solo necesita las fuentes
  const answer = composeSimulatedAnswer(context);
  // Cada "token" es una palabra con el espacio o salto de línea que la sigue
  const tokens = answer.match(/\S+\s*/g) ?? [];
  for (const token of tokens) {
    if (signal?.aborted) return;
    await sleep(delayMs, signal);
    if (signal?.aborted) return;
    yield token;
  }
}
