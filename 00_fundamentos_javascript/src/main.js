import { usuariosEjemplo, limpiarUsuarios, agruparPorRol } from "./01_array_methods.js";
import { consultarDocumentosParalelo } from "./02_asincronia.js";
import { ContactStore } from "./03_memory_store.js";

async function main() {
  console.log("=== SEMANA 1 - SESIÓN 1: FUNDAMENTOS DE JAVASCRIPT MODERNO ===");

  console.log("\n1. Transformación de usuarios:");
  const limpios = limpiarUsuarios(usuariosEjemplo);
  console.log(limpios);

  console.log("\n2. Agrupación por rol:");
  console.log(agruparPorRol(usuariosEjemplo));

  console.log("\n3. Consultas concurrentes con Promise.all:");
  const docs = await consultarDocumentosParalelo([1, 2, 3]);
  console.log(docs);

  console.log("\n4. Simulador de repositorio en memoria:");
  const store = new ContactStore();
  const c1 = store.crear({ nombre: "Ada Lovelace", email: "ada@usal.es" });
  const c2 = store.crear({ nombre: "Alan Turing", email: "alan@usal.es" });
  console.log("Contactos creados:", store.obtenerTodos());
  console.log("Buscar ID 1:", store.obtenerPorId(1));
  console.log("Eliminar ID 1:", store.eliminar(1));
  console.log("Contactos restantes:", store.obtenerTodos());
}

main().catch(console.error);
