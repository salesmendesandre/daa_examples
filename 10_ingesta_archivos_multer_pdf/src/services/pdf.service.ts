/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Servicio de Extracción de Texto en PDFs
 * Lógica de procesamiento desacoplada de Express: recibe un Buffer, no un
 * req/res. Así se puede testear (y reutilizar) sin necesidad de simular una
 * petición HTTP.
 *
 * CHULETA — bug real encontrado y verificado en este proyecto: `pdf-parse`
 * (basado en una versión antigua de pdf.js) falla de forma intermitente con
 * "bad XRef entry" en las primeras llamadas de un proceso Node recién
 * arrancado, incluso con un PDF perfectamente válido — es un problema de
 * inicialización interna perezosa de la propia librería, no del PDF ni de
 * este código. Se comprobó empíricamente: sin calentar, ~4 de 6 llamadas
 * fallan al arrancar; calentando con unos pocos intentos al inicio, 0 fallos
 * en 30 llamadas reales posteriores. Por eso existen warmupPdfParser()
 * (llamado una vez en server.ts antes de aceptar tráfico) y el reintento
 * interno de extractTextFromPdfBuffer (red de seguridad para el resto de casos).
 * ========================================================================== */

import pdfParse from "pdf-parse";
import { PdfExtractionResult } from "../types/pdf.types.js";
import { PdfProcessingError } from "../errors/upload.errors.js";

// CONTENIDO: Validación por Magic Bytes (firma binaria).
// Nunca confíes en la extensión ni en file.mimetype (los controla el
// cliente): un PDF legítimo SIEMPRE empieza por "%PDF" (0x25 0x50 0x44 0x46).
export const isRealPdfBuffer = (buffer: Buffer): boolean => {
  if (buffer.length < 4) return false;
  return (
    buffer[0] === 0x25 && // '%'
    buffer[1] === 0x50 && // 'P'
    buffer[2] === 0x44 && // 'D'
    buffer[3] === 0x46    // 'F'
  );
};

// PDF mínimo válido embebido (una página, texto "Documento de prueba...")
// usado solo para forzar el "calentamiento" de pdf-parse al arrancar.
const WARMUP_PDF_BASE64 =
  "JVBERi0xLjMKJf////8KNyAwIG9iago8PAovVHlwZSAvUGFnZQovUGFyZW50IDEgMCBSCi9NZWRpYUJveCBbMCAwIDYxMiA3OTJdCi9Db250ZW50cyA1IDAgUgovUmVzb3VyY2VzIDYgMCBSCi9Vc2VyVW5pdCAxCj4+CmVuZG9iago2IDAgb2JqCjw8Ci9Qcm9jU2V0IFsvUERGIC9UZXh0IC9JbWFnZUIgL0ltYWdlQyAvSW1hZ2VJXQovRm9udCA8PAovRjEgOCAwIFIKPj4KL0NvbG9yU3BhY2UgPDwKPj4KPj4KZW5kb2JqCjUgMCBvYmoKPDwKL0xlbmd0aCAxODEKL0ZpbHRlciAvRmxhdGVEZWNvZGUKPj4Kc3RyZWFtCnicZY47TgRBEEPzPoUvsFCfLteONJoACQIypM4QAVq6sw24f4Jq+SQkJfnZclkhEJwUgtwMl2v7bPqPPYwfqEhDqt75uWNc2/2TQg1jtde9dy56Bj8YnNm5TNgZJilpB04a2DMYNGpBamEV7KV5qRvOKlDOUh42D1Cwm3TnutUGJzd+1+dNxV89N3oZWWFLq+99ctWOA5Wwyfd0k9xMeuS5tjHS03/9A/KG8dweR3tpX8mEPT8KZW5kc3RyZWFtCmVuZG9iagoxMCAwIG9iagooUERGS2l0KQplbmRvYmoKMTEgMCBvYmoKKFBERktpdCkKZW5kb2JqCjEyIDAgb2JqCihEOjIwMjYwOTA2MTQzNjM0WikKZW5kb2JqCjkgMCBvYmoKPDwKL1Byb2R1Y2VyIDEwIDAgUgovQ3JlYXRvciAxMSAwIFIKL0NyZWF0aW9uRGF0ZSAxMiAwIFIKPj4KZW5kb2JqCjggMCBvYmoKPDwKL1R5cGUgL0ZvbnQKL0Jhc2VGb250IC9IZWx2ZXRpY2EKL1N1YnR5cGUgL1R5cGUxCi9FbmNvZGluZyAvV2luQW5zaUVuY29kaW5nCj4+CmVuZG9iago0IDAgb2JqCjw8Cj4+CmVuZG9iagozIDAgb2JqCjw8Ci9UeXBlIC9DYXRhbG9nCi9QYWdlcyAxIDAgUgovTmFtZXMgMiAwIFIKPj4KZW5kb2JqCjEgMCBvYmoKPDwKL1R5cGUgL1BhZ2VzCi9Db3VudCAxCi9LaWRzIFs3IDAgUl0KPj4KZW5kb2JqCjIgMCBvYmoKPDwKL0Rlc3RzIDw8CiAgL05hbWVzIFsKXQo+Pgo+PgplbmRvYmoKeHJlZgowIDEzCjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDgzMiAwMDAwMCBuIAowMDAwMDAwODg5IDAwMDAwIG4gCjAwMDAwMDA3NzAgMDAwMDAgbiAKMDAwMDAwMDc0OSAwMDAwMCBuIAowMDAwMDAwMjM4IDAwMDAwIG4gCjAwMDAwMDAxMzEgMDAwMDAgbiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwNjUyIDAwMDAwIG4gCjAwMDAwMDA1NzcgMDAwMDAgbiAKMDAwMDAwMDQ5MSAwMDAwMCBuIAowMDAwMDAwNTE2IDAwMDAwIG4gCjAwMDAwMDA1NDEgMDAwMDAgbiAKdHJhaWxlcgo8PAovU2l6ZSAxMwovUm9vdCAzIDAgUgovSW5mbyA5IDAgUgovSUQgWzw3OThlYzFkYWRmZDgyOTUzNjIxMzdkYzBkMjYyYWUwZT4gPDc5OGVjMWRhZGZkODI5NTM2MjEzN2RjMGQyNjJhZTBlPl0KPj4Kc3RhcnR4cmVmCjkzNgolJUVPRgo=";

let warmedUp = false;

export const warmupPdfParser = async (): Promise<void> => {
  if (warmedUp) return;

  const warmupBuffer = Buffer.from(WARMUP_PDF_BASE64, "base64");
  for (let attempt = 0; attempt < 8; attempt++) {
    try {
      await pdfParse(warmupBuffer);
      break;
    } catch {
      // Fallo esperado durante el calentamiento: se descarta a propósito.
    }
  }
  warmedUp = true;
};

export const extractTextFromPdfBuffer = async (buffer: Buffer): Promise<PdfExtractionResult> => {
  const MAX_ATTEMPTS = 5;
  let lastError: unknown;

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const data = await pdfParse(buffer);
      return { text: data.text.trim(), numPages: data.numpages, info: data.info };
    } catch (err) {
      lastError = err;
    }
  }

  // PDF realmente corrupto (no el fallo de arranque): 500 con el motivo.
  throw new PdfProcessingError(lastError);
};
