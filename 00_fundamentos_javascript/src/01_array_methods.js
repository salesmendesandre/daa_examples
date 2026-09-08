/**
 * Transformaciones y operaciones funcionales sobre arrays en ES6+
 */

export const usuariosEjemplo = [
  { id: 1, full_name: "  Lucía Pérez ", email: "lucia@usal.es", role: "admin", active: "true" },
  { id: 2, full_name: "Carlos Ruiz", email: "carlos@gmail.com", role: "user", active: "true" },
  { id: 3, full_name: " Sofia Vega ", email: "sofia@usal.es", role: "editor", active: "true" },
  { id: 4, full_name: "Marcos León", email: "marcos@usal.es", role: "user", active: "false" }
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

export const agruparPorRol = (lista) => {
  return lista.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1;
    return acc;
  }, {});
};
