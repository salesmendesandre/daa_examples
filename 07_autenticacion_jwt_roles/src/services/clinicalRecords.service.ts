/* ============================================================================
 * EJERCICIOS — Reglas de negocio de los Historiales Clínicos
 * El RBAC "grueso" (qué ROL puede entrar a cada endpoint) se resuelve en las
 * rutas con requireHospitalRoles (Ejercicio 1). Lo que NO puede resolver un
 * middleware de roles es la titularidad (Ejercicio 2): un paciente tiene el
 * rol correcto, pero solo para SU historial -> hace falta mirar el registro
 * concreto, y eso es lógica de negocio, así que vive aquí.
 * ========================================================================== */

import { clinicalRecordStore } from "../models/clinicalRecord.store.js";
import {
  AuditReport,
  ClinicalRecord,
  HospitalTokenPayload,
  PatientClinicalRecord
} from "../types/hospital.types.js";
import { CreateClinicalRecordDTO } from "../schemas/clinicalRecord.schema.js";
import { AppError } from "../errors/app.error.js";
import { ForbiddenError } from "../errors/auth.errors.js";

export class ClinicalRecordsService {
  // EJERCICIO 1: resumen solo para hospital_admin (el rol lo filtra la ruta).
  getAuditReport(): AuditReport {
    const records = clinicalRecordStore.findAll();
    return {
      totalRecords: records.length,
      totalPatients: new Set(records.map(r => r.patientId)).size
    };
  }

  createRecord(input: CreateClinicalRecordDTO): ClinicalRecord {
    return clinicalRecordStore.create(input);
  }

  // EJERCICIO 2: autorización por titularidad (Ownership) + protección BOLA.
  getClinicalRecordForUser(id: string, currentUser: HospitalTokenPayload): ClinicalRecord | PatientClinicalRecord {
    const record = clinicalRecordStore.findById(id);
    if (!record) {
      throw new AppError("Historial médico no encontrado", 404);
    }

    const isOwnerPatient = currentUser.role === "patient" && record.patientId === currentUser.userId;
    const isAssignedDoctor = currentUser.role === "doctor" && record.doctorAssignedId === currentUser.userId;
    const isAdmin = currentUser.role === "hospital_admin";

    if (!isOwnerPatient && !isAssignedDoctor && !isAdmin) {
      throw new ForbiddenError("No tiene autorización para consultar el historial médico de este paciente.");
    }

    // Las notas confidenciales internas nunca se muestran al propio paciente.
    if (isOwnerPatient && record.confidentialNotes) {
      const { confidentialNotes, ...sanitizedRecord } = record;
      return sanitizedRecord;
    }

    return record;
  }
}

export const clinicalRecordsService = new ClinicalRecordsService();
