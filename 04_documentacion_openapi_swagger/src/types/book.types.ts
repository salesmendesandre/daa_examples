/* ============================================================================
 * TIPOS DE DOMINIO — Entidad BookItem
 * CreateBookSchema (../schemas/book.schema.ts) valida el payload de ENTRADA
 * del POST /api/books, pero "id" lo asigna el servidor y nunca viaja en el
 * body -> el libro COMPLETO tal y como se guarda no es un z.infer de ese
 * schema, sino una entidad propia que reutilizan modelo, servicio y
 * controlador. Por eso vive aquí, en types/, y no junto al schema.
 * ========================================================================== */

export interface BookItem {
  id: number;
  isbn: string;
  title: string;
  authors: string[];
  publishedYear: number;
  availableCopies: number;
}
