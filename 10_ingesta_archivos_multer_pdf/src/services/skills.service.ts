/* ============================================================================
 * EJERCICIO 3: Extracción de Palabras Clave y Competencias
 * Límites de palabra: "java" no debe coincidir dentro de "javascript".
 * Case-insensitive vía normalizedText. La lista de skills ya llega como
 * string[] (la convierte UploadCvSchema).
 *
 * CHULETA — dos fallos de una solución "ingenua" (new RegExp(`\\b${skill}\\b`)):
 *  1. La skill viene del CLIENTE y se metía tal cual en la regex: "C++" lanza
 *     SyntaxError ("Nothing to repeat") -> 500. Nunca construyas una RegExp
 *     con texto del usuario sin escaparlo (escapeRegex).
 *  2. \b solo funciona entre letra y no-letra: ".NET" o "C++" empiezan o
 *     acaban en símbolo y NUNCA coincidían. (?<!\w) y (?!\w) significan "no
 *     hay una letra/dígito justo antes/después", que vale para cualquier skill.
 * ========================================================================== */

import { SkillsMatchResult } from "../types/resume.types.js";

const escapeRegex = (value: string): string => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

export const extractSkillsFromResumeText = (text: string, expectedSkills: string[]): SkillsMatchResult => {
  const normalizedText = text.toLowerCase();

  const foundSkills = expectedSkills.filter(skill => {
    const pattern = new RegExp(`(?<!\\w)${escapeRegex(skill.toLowerCase())}(?!\\w)`, "i");
    return pattern.test(normalizedText);
  });

  const matchScore = expectedSkills.length > 0
    ? Number(((foundSkills.length / expectedSkills.length) * 100).toFixed(1))
    : 0;

  return { foundSkills, matchScore };
};
