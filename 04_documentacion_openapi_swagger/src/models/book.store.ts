/* ============================================================================
 * CAPA DE MODELO — Catálogo de Libros en memoria
 * ========================================================================== */

import { BookItem } from "../types/book.types.js";

class BookStore {
  private books: BookItem[] = [
    {
      id: 1,
      isbn: "978-0132350884",
      title: "Clean Code",
      authors: ["Robert C. Martin"],
      publishedYear: 2008,
      availableCopies: 3
    }
  ];

  findAll(): BookItem[] {
    return this.books;
  }

  findByIsbn(isbn: string): BookItem | undefined {
    return this.books.find(b => b.isbn === isbn);
  }

  create(data: Omit<BookItem, "id">): BookItem {
    const nextId = this.books.length > 0 ? Math.max(...this.books.map(b => b.id)) + 1 : 1;
    const nuevo: BookItem = { id: nextId, ...data };
    this.books.push(nuevo);
    return nuevo;
  }
}

export const bookStore = new BookStore();
