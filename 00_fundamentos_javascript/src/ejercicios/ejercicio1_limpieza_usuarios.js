/**
 * Ejercicio 1: Limpieza y Transformación de Datos (Arrays y Destructuring)
 *
 * Enunciado (book/fundamentos_javascript.md - Taller Práctico):
 * Dado un array de registros sin depurar recibidos de un formulario externo,
 * crear limpiarUsuarios(registros) que:
 * 1. Filtre únicamente los usuarios con active === "true" y correo institucional @usal.es.
 * 2. Devuelva un nuevo array con nombres sin espacios sobrantes (trim()), email en
 *    minúsculas y un identificador numérico único secuencial.
 */

export const registros = [
  { full_name: "  Lucía Pérez  ", email: "LUCIA@USAL.ES", role: "admin", active: "true" },
  { full_name: "Marcos Soto", email: "marcos@gmail.com", role: "user", active: "false" },
  { full_name: " Sofia Vega ", email: "sofia@usal.es", role: "editor", active: "true" },
  { full_name: "Raúl Blanco", email: "raul@hotmail.com", role: "user", active: "true" }
];

export const limpiarUsuarios = (lista) => {
  return lista
    .filter(u => u.active === "true" && u.email.toLowerCase().endsWith("@usal.es"))
    .map((u, index) => ({
      id: index + 1,
      nombre: u.full_name.trim(),
      email: u.email.toLowerCase(),
      rol: u.role
    }));
};

// Salida esperada:
// [
//   { id: 1, nombre: 'Lucía Pérez', email: 'lucia@usal.es', rol: 'admin' },
//   { id: 2, nombre: 'Sofia Vega', email: 'sofia@usal.es', rol: 'editor' }
// ]
