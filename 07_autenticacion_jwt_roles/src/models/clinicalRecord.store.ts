/* ============================================================================
 * CAPA DE MODELO — Historiales clínicos en memoria (EJERCICIOS)
 * El modelo solo guarda y busca: decidir QUIÉN puede ver cada historial
 * (Ownership/BOLA, Ejercicio 2) es regla de negocio -> clinicalRecords.service.ts.
 * ========================================================================== */

import { ClinicalRecord } from "../types/hospital.types.js";

class ClinicalRecordStore {
  private records: ClinicalRecord[] = [];

  findAll(): ClinicalRecord[] {
    return this.records;
  }

  findById(id: string): ClinicalRecord | undefined {
    return this.records.find(r => r.id === id);
  }

  create(data: Omit<ClinicalRecord, "id" | "createdAt">): ClinicalRecord {
    const nuevo: ClinicalRecord = {
      id: `rec${this.records.length + 1}`,
      ...data,
      createdAt: new Date().toISOString()
    };
    this.records.push(nuevo);
    return nuevo;
  }

  insert(record: ClinicalRecord): void {
    this.records.push(record);
  }
}

export const clinicalRecordStore = new ClinicalRecordStore();
