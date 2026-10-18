/* ============================================================================
 * DATOS DE DEMOSTRACIÓN — Historiales clínicos con los que arranca la API
 * (EJERCICIOS). Mismo papel que data/seed.ts en el capítulo de paginación:
 * datos de ejemplo, no lógica. El almacén en sí (findAll/findById/create) es
 * models/clinicalRecord.store.ts; data/seed.ts carga estos registros en él.
 * IDs fijos para que las peticiones de prueba del README funcionen tal cual:
 *   rec1 -> paciente p1, doctor d1, CON notas confidenciales (Ejercicio 2)
 *   rec2 -> paciente p2, doctor d1, sin notas
 * ========================================================================== */

import { ClinicalRecord } from "../types/hospital.types.js";

export const demoClinicalRecords: Omit<ClinicalRecord, "createdAt">[] = [
  {
    id: "rec1",
    patientId: "p1",
    doctorAssignedId: "d1",
    diagnosis: "Gripe estacional",
    prescriptions: ["Paracetamol 650mg cada 8h"],
    confidentialNotes: "Paciente refiere ansiedad no relacionada con el diagnóstico principal."
  },
  {
    id: "rec2",
    patientId: "p2",
    doctorAssignedId: "d1",
    diagnosis: "Esguince de tobillo grado II",
    prescriptions: ["Ibuprofeno 400mg cada 12h", "Reposo 2 semanas"]
  }
];
