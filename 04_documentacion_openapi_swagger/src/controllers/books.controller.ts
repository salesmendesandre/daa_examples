/* ============================================================================
 * CAPA DE CONTROLADOR — Books
 * ========================================================================== */

import { Request, Response } from "express";
import { booksService } from "../services/books.service.js";

export const getAllBooks = (_req: Request, res: Response) => {
  const books = booksService.getAllBooks();
  res.json({ status: "success", count: books.length, data: books });
};

// EJERCICIO 1: 200 si existe, 404 (vía AppError) si no hay ningún libro con ese ISBN.
export const getBookByIsbn = (req: Request, res: Response) => {
  const book = booksService.getBookByIsbn(String(req.params.isbn));
  res.json({ status: "success", data: book });
};

export const createBook = (req: Request, res: Response) => {
  const nuevo = booksService.createBook(req.body);
  res.status(201).json({ status: "success", data: nuevo });
};
