/* ============================================================================
 * Datos de demostración del dominio Hospital (EJERCICIOS) — IDs fijos para
 * poder referenciarlos directamente desde los ejemplos de curl del README,
 * sin tener que copiar/pegar nada. Lo llama server.ts una vez, ANTES de
 * app.listen, y guarda los datos A TRAVÉS de los modelos (stores). Es async
 * porque bcrypt.hash lo es.
 *
 * Credenciales de prueba (cumplen la regex del Ejercicio 3):
 *   paciente1@hospital.test  / Patient1!  (rol patient, id "p1")
 *   paciente2@hospital.test  / Patient2!  (rol patient, id "p2")
 *   doctor1@hospital.test    / Doctor123! (rol doctor,  id "d1")
 *   admin1@hospital.test     / Admin123!  (rol hospital_admin, id "a1")
 * ========================================================================== */

import bcrypt from "bcrypt";
import { hospitalUserStore } from "../models/hospitalUser.store.js";
import { clinicalRecordStore } from "../models/clinicalRecord.store.js";
import { demoClinicalRecords } from "./clinicalRecords.store.js";

export const seedHospitalData = async (): Promise<void> => {
  const [patient1Hash, patient2Hash, doctorHash, adminHash] = await Promise.all([
    bcrypt.hash("Patient1!", 12),
    bcrypt.hash("Patient2!", 12),
    bcrypt.hash("Doctor123!", 12),
    bcrypt.hash("Admin123!", 12)
  ]);

  hospitalUserStore.insert({ id: "p1", email: "paciente1@hospital.test", passwordHash: patient1Hash, fullName: "Paciente Uno", role: "patient" });
  hospitalUserStore.insert({ id: "p2", email: "paciente2@hospital.test", passwordHash: patient2Hash, fullName: "Paciente Dos", role: "patient" });
  hospitalUserStore.insert({ id: "d1", email: "doctor1@hospital.test", passwordHash: doctorHash, fullName: "Dra. Ana Ruiz", role: "doctor" });
  hospitalUserStore.insert({ id: "a1", email: "admin1@hospital.test", passwordHash: adminHash, fullName: "Admin Hospital", role: "hospital_admin" });

  for (const record of demoClinicalRecords) {
    clinicalRecordStore.insert({ ...record, createdAt: new Date().toISOString() });
  }
};
