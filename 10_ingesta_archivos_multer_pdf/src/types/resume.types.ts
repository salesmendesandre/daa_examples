/* ============================================================================
 * TIPOS DE DOMINIO — Currículums (EJERCICIOS)
 * SkillsMatchResult: lo que devuelve extractSkillsFromResumeText (Ejercicio 3).
 * UploadedFileInfo: lo que se devuelve de cada adjunto (Ejercicio 2), sin
 * el buffer (el contenido binario nunca viaja de vuelta al cliente).
 * ========================================================================== */

export interface SkillsMatchResult {
  foundSkills: string[];
  matchScore: number;
}

export interface UploadedFileInfo {
  originalName: string;
  sizeBytes: number;
}
