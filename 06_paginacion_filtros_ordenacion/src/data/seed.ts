/* ============================================================================
 * Datos de demostración — idempotente: solo siembra si la colección está
 * vacía, para no duplicar datos cada vez que se reinicia `npm run dev`.
 * ========================================================================== */

import { DocumentModel } from "../models/document.model.js";

export const seedData = async (): Promise<void> => {
  const docCount = await DocumentModel.countDocuments();

  if (docCount === 0) {
    const docs = Array.from({ length: 15 }, (_, i) => ({
      title: `Documento Técnico #${i + 1}`,
      content: `Contenido descriptivo del documento número ${i + 1} sobre arquitectura de software.`,
      author: i % 2 === 0 ? "André Mendes" : "Miguel Puch",
      tags: i % 3 === 0 ? ["nodejs", "api"] : i % 3 === 1 ? ["typescript"] : ["mongodb"]
    }));
    await DocumentModel.insertMany(docs);
    console.log("[Seed] 15 documentos insertados");
  }
};
