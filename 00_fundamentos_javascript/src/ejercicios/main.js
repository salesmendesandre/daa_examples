import { registros, limpiarUsuarios } from "./ejercicio1_limpieza_usuarios.js";
import { ContactStore } from "./ejercicio2_contact_store.js";
import { autorizarAcceso } from "./ejercicio3_autorizar_acceso.js";

async function main() {
  console.log("=== SEMANA 1 - SESIÓN 2: CORRECCIÓN EJERCICIOS FUNDAMENTOS JS ===");

  console.log("\n--- Ejercicio 1: limpiarUsuarios ---");
  console.log(limpiarUsuarios(registros));

  console.log("\n--- Ejercicio 2: ContactStore ---");
  const store = new ContactStore();
  const c1 = store.crear({ nombre: "Hugo", email: "hugo@usal.es", telefono: "611223344" });
  console.log("Creado:", c1);
  console.log("Buscar por ID:", store.obtenerPorId(c1.id));
  console.log("Eliminar:", store.eliminar(c1.id)); // true
  console.log("Buscar tras eliminar:", store.obtenerPorId(c1.id)); // null

  console.log("\n--- Ejercicio 3: autorizarAcceso ---");
  await autorizarAcceso(1); // Acceso denegado (plan free)
  await autorizarAcceso(99); // Acceso concedido (plan pro)
  await autorizarAcceso(-5); // Error en autorización
}

main().catch(console.error);
