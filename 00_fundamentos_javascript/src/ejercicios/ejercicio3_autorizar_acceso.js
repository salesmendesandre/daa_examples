/**
 * Ejercicio 3: Consulta Asíncrona Encadenada con Simulación de Errores
 *
 * Enunciado (book/fundamentos_javascript.md - Taller Práctico):
 * Implementar dos funciones asíncronas simuladas:
 * 1. obtenerUsuario(id): Retorna tras 500 ms un usuario { id, nombre, plan: "free" }
 *    si id > 0, o lanza un error si id <= 0.
 * 2. verificarPermisos(plan): Retorna tras 300 ms true si el plan es "premium" o "pro",
 *    y false si es "free".
 * Crear autorizarAcceso(idUsuario) que use async/await y try/catch para consultar
 * al usuario, verificar si tiene acceso y mostrar el resultado en consola.
 */

const delay = ms => new Promise(res => setTimeout(res, ms));

export const obtenerUsuario = async id => {
  await delay(500);
  if (id <= 0) {
    throw new Error("Identificador de usuario inválido");
  }
  return { id, nombre: "Estudiante USAL", plan: id === 99 ? "pro" : "free" };
};

export const verificarPermisos = async plan => {
  await delay(300);
  return plan === "pro" || plan === "premium";
};

export const autorizarAcceso = async id => {
  try {
    console.log(`\nVerificando usuario con ID: ${id}...`);
    const usuario = await obtenerUsuario(id);
    const tienePermiso = await verificarPermisos(usuario.plan);

    if (tienePermiso) {
      console.log(`Acceso CONCEDIDO a ${usuario.nombre} (Plan ${usuario.plan})`);
    } else {
      console.log(`Acceso DENEGADO a ${usuario.nombre}: Plan ${usuario.plan} insuficiente`);
    }
  } catch (err) {
    console.error(`Error en autorización: ${err.message}`);
  }
};
