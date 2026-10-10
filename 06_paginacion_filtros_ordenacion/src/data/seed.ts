/* ============================================================================
 * Datos de demostración — idempotente: solo siembra si la colección está
 * vacía, para no duplicar datos cada vez que se reinicia `npm run dev`.
 * ========================================================================== */

import { DocumentModel } from "../models/document.model.js";
import { CatalogProductModel } from "../models/catalogProduct.model.js";

export const seedData = async (): Promise<void> => {
  const [docCount, catalogCount] = await Promise.all([
    DocumentModel.countDocuments(),
    CatalogProductModel.countDocuments()
  ]);

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

  if (catalogCount === 0) {
    const brands = ["Nike", "Adidas", "Zara", "Levis"];
    const categories = ["calzado", "ropa", "accesorios"];
    const products = Array.from({ length: 24 }, (_, i) => ({
      name: `Producto de Moda #${i + 1}`,
      brand: brands[i % brands.length],
      category: categories[i % categories.length],
      price: Math.round((15 + (i * 7.5) % 180) * 100) / 100,
      rating: Math.round(((i % 5) + 1) * 10) / 10,
      inStock: i % 6 !== 0 // 1 de cada 6, sin stock
    }));
    await CatalogProductModel.insertMany(products);
    console.log("[Seed] 24 productos de catálogo insertados");
  }
};
