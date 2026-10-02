/* ============================================================================
 * CAPA DE SERVICIO — Reglas de negocio de Books
 * EJERCICIO 1: 404 (vía AppError) si no hay ningún libro con ese ISBN.
 * ========================================================================== */

import { bookStore } from "../models/book.store.js";
import { BookItem } from "../types/book.types.js";
import { CreateBookInput } from "../schemas/book.schema.js";
import { AppError } from "../errors/app.error.js";

export class BooksService {
  getAllBooks(): BookItem[] {
    return bookStore.findAll();
  }

  getBookByIsbn(isbn: string): BookItem {
    const book = bookStore.findByIsbn(isbn);
    if (!book) {
      throw new AppError(`No se encontró ningún libro con el ISBN '${isbn}'`, 404);
    }
    return book;
  }

  createBook(input: CreateBookInput): BookItem {
    return bookStore.create(input);
  }
}

export const booksService = new BooksService();
