/* ============================================================================
 * TIPOS DE DOMINIO — Resultado de la extracción de texto de un PDF (CONTENIDO)
 * Lo devuelve services/pdf.service.ts y lo consume el controlador de
 * documents sin necesidad de importar pdf-parse.
 * ========================================================================== */

export interface PdfExtractionResult {
  text: string;
  numPages: number;
  info: any;
}
