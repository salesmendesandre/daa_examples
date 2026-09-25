/**
 * Ejercicio 2: Simulador de Repositorio en Memoria (Memory Store)
 *
 * Enunciado (book/fundamentos_javascript.md - Taller Práctico):
 * Crear una clase o módulo ContactStore que gestione una lista de contactos en
 * memoria simulando las operaciones que posteriormente se harán en una base de datos:
 * - obtenerTodos(): Retorna una copia de todos los contactos.
 * - obtenerPorId(id): Retorna el contacto con ese id o null si no existe.
 * - crear(datos): Añade un contacto generando un id único y fecha de creación.
 * - eliminar(id): Elimina el contacto por su id y devuelve un booleano.
 */

export class ContactStore {
  constructor() {
    this.contactos = [];
  }

  obtenerTodos() {
    return [...this.contactos];
  }

  obtenerPorId(id) {
    return this.contactos.find(c => c.id === id) || null;
  }

  crear({ nombre, email, telefono }) {
    const nuevoContacto = {
      id: Date.now().toString(),
      nombre,
      email,
      telefono,
      creadoEn: new Date().toISOString()
    };
    this.contactos.push(nuevoContacto);
    return nuevoContacto;
  }

  eliminar(id) {
    const longitudInicial = this.contactos.length;
    this.contactos = this.contactos.filter(c => c.id !== id);
    return this.contactos.length < longitudInicial;
  }
}
