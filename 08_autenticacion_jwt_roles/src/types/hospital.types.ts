/* ============================================================================
 * EJERCICIOS — Tipos de dominio del Sistema Clínico Hospitalario
 * Mismo reparto que en auth.types.ts: entidad guardada (con passwordHash),
 * versión pública, payload del JWT y resultado de register/login.
 * ClinicalRecord incluye "id"/"createdAt" que genera el servidor -> no es
 * un z.infer del schema de entrada (../schemas/clinicalRecord.schema.ts).
 * ========================================================================== */

// Lista única de roles: la usan este tipo y el z.enum de hospitalAuth.schema.ts.
export const HOSPITAL_ROLES = ["patient", "nurse", "doctor", "hospital_admin"] as const;
export type HospitalRole = (typeof HOSPITAL_ROLES)[number];

export interface HospitalUserEntity {
  id: string;
  email: string;
  passwordHash: string;
  fullName: string;
  role: HospitalRole;
}

export type PublicHospitalUser = Omit<HospitalUserEntity, "passwordHash">;

export interface HospitalTokenPayload {
  userId: string;
  email: string;
  role: HospitalRole;
}

export interface HospitalAuthResult {
  token: string;
  user: PublicHospitalUser;
}

export interface ClinicalRecord {
  id: string;
  patientId: string;
  doctorAssignedId: string;
  diagnosis: string;
  prescriptions: string[];
  confidentialNotes?: string;
  createdAt: string;
}

// EJERCICIO 2: lo que ve el propio paciente (sin las notas confidenciales).
export type PatientClinicalRecord = Omit<ClinicalRecord, "confidentialNotes">;

// EJERCICIO 1: resumen del endpoint de auditoría (solo hospital_admin).
export interface AuditReport {
  totalRecords: number;
  totalPatients: number;
}
