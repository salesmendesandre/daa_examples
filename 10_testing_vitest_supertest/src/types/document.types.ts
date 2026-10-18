/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Entidad DocumentItem
 * El "id" lo asigna el servidor -> no es un z.infer del schema de entrada
 * (../schemas/document.schema.ts), igual que en la semana 4.
 * ========================================================================== */

export interface DocumentItem {
  id: number;
  title: string;
  author: string;
}
