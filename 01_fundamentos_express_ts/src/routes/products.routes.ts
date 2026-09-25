/* ============================================================================
 * EJERCICIOS RESUELTOS: Catálogo de Productos y Control de Stock
 * Dominio genérico: /api/products
 *
 * Mismos conceptos que Documents, aplicados a un dominio distinto.
 * ========================================================================== */

import { Router, Request, Response } from "express";
import { ProductItem } from "../types.js";

const router = Router();

const products: ProductItem[] = [
  { id: 1, name: "Teclado Mecánico RGB", category: "perifericos", price: 89.99, stock: 15, active: true, createdAt: "2026-09-01T08:00:00Z" },
  { id: 2, name: "Ratón Óptico Ergonómico", category: "perifericos", price: 45.50, stock: 3, active: true, createdAt: "2026-09-02T09:00:00Z" },
  { id: 3, name: "Monitor 27 Pulgadas 4K", category: "monitores", price: 349.00, stock: 0, active: false, createdAt: "2026-09-03T10:00:00Z" }
];

// EJERCICIO 2 · GET /api/products/stats
// OJO: declarado ANTES que cualquier "/:id" que se pudiera añadir más adelante.
// Express matchea rutas en orden: si "/:id" fuera anterior, "stats" se leería como
// un ID literal y esta ruta nunca se alcanzaría. Regla general: rutas estáticas
// primero, rutas parametrizadas después.
router.get("/stats", (_req: Request, res: Response) => {
  if (products.length === 0) {
    return res.status(200).json({
      status: "success",
      data: { totalProducts: 0, totalStock: 0, averagePrice: 0, categories: {} }
    });
  }

  const totalProducts = products.length;
  const totalStock = products.reduce((acc, p) => acc + p.stock, 0);
  const totalPrice = products.reduce((acc, p) => acc + p.price, 0);
  const averagePrice = Number((totalPrice / totalProducts).toFixed(2));

  const categories: Record<string, number> = {};
  for (const prod of products) {
    categories[prod.category] = (categories[prod.category] || 0) + 1;
  }

  res.status(200).json({
    status: "success",
    data: { totalProducts, totalStock, averagePrice, categories }
  });
});

// EJERCICIO 1 · GET /api/products
// 3 query params opcionales, todos combinables entre sí (AND, no OR).
// maxPrice se valida ANTES de filtrar: si no es un número válido, se corta con
// 400 de inmediato en vez de devolver un resultado silenciosamente vacío/erróneo.
router.get("/", (req: Request, res: Response) => {
  const { category, maxPrice, inStock } = req.query;
  let result = products;

  if (typeof category === "string" && category.trim() !== "") {
    const filterCat = category.trim().toLowerCase();
    result = result.filter(p => p.category.toLowerCase() === filterCat);
  }

  if (maxPrice !== undefined) {
    const parsedMaxPrice = Number(maxPrice);
    if (Number.isNaN(parsedMaxPrice) || parsedMaxPrice < 0) {
      return res.status(400).json({
        status: "fail",
        error: "BadRequest",
        message: "El parámetro 'maxPrice' debe ser un número positivo válido."
      });
    }
    result = result.filter(p => p.price <= parsedMaxPrice);
  }

  if (inStock === "true") {
    result = result.filter(p => p.stock > 0);
  } else if (inStock === "false") {
    result = result.filter(p => p.stock === 0);
  }

  res.status(200).json({
    status: "success",
    total: result.length,
    data: result
  });
});

// EJERCICIO 3 · POST /api/products
// Validación manual defensiva de tipo Y de rango (no solo "existe", también
// "tiene sentido": price > 0, stock entero >= 0). Esto es justo lo que Zod
// automatizará más adelante.
// Cabecera "Location": buena práctica REST -> indica dónde vive el recurso creado.
router.post("/", (req: Request, res: Response) => {
  const { name, category, price, stock } = req.body;

  if (
    typeof name !== "string" || name.trim() === "" ||
    typeof category !== "string" || category.trim() === "" ||
    typeof price !== "number" || price <= 0 ||
    typeof stock !== "number" || !Number.isInteger(stock) || stock < 0
  ) {
    return res.status(400).json({
      status: "fail",
      error: "BadRequest",
      message: "Campos requeridos inválidos: 'name' (string), 'category' (string), 'price' (>0) y 'stock' (entero >=0)."
    });
  }

  const nextId = products.length > 0
    ? Math.max(...products.map(p => p.id)) + 1
    : 1;

  const newProduct: ProductItem = {
    id: nextId,
    name: name.trim(),
    category: category.trim().toLowerCase(),
    price: Number(price.toFixed(2)),
    stock,
    active: true,
    createdAt: new Date().toISOString()
  };

  products.push(newProduct);
  res.setHeader("Location", `/api/products/${newProduct.id}`);

  res.status(201).json({
    status: "success",
    message: "Producto creado satisfactoriamente",
    data: newProduct
  });
});

export default router;
