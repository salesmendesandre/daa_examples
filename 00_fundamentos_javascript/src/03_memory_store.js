/**
 * Simulador de repositorio en memoria (Memory Store)
 * Base conceptual para controladores y servicios antes de conectar una BD.
 */

export class ContactStore {
  constructor() {
    this.contactos = [];
    this.secuencia = 1;
  }

  obtenerTodos() {
    return [...this.contactos];
  }

  obtenerPorId(id) {
    const contacto = this.contactos.find(c => c.id === Number(id));
    return contacto ? { ...contacto } : null;
  }

  crear(datos) {
    const nuevo = {
      id: this.secuencia++,
      nombre: datos.nombre.trim(),
      email: datos.email.toLowerCase().trim(),
      creadoEn: new Date().toISOString()
    };
    this.contactos.push(nuevo);
    return { ...nuevo };
  }

  eliminar(id) {
    const longitudInicial = this.contactos.length;
    this.contactos = this.contactos.filter(c => c.id !== Number(id));
    return this.contactos.length < longitudInicial;
  }
}
