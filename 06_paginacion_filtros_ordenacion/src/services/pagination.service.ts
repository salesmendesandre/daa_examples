/* ============================================================================
 * CONTENIDO DE LA SESIÓN — Servicio de Paginación y Filtrado
 * Promise.all: datos y conteo total se piden EN PARALELO (dos consultas
 * independientes a MongoDB), no en serie -> la mitad de latencia percibida.
 * ALLOWED_SORT_FIELDS es una whitelist: sin ella, un cliente podría mandar
 * ?sort=passwordHash y forzar un sort sobre un campo no indexado o sensible.
 * "search" se escapa antes de meterlo en el $regex (con "?search=[" MongoDB
 * rechazaba la consulta -> 500, comprobado).
 * ========================================================================== */

import { DocumentModel } from "../models/document.model.js";
import { PaginationOptions, PaginatedResult } from "../types/pagination.types.js";
import { escapeRegex } from "../utils/escapeRegex.js";

const ALLOWED_SORT_FIELDS = ["createdAt", "title", "author"];

export const getPaginatedDocuments = async (
  options: PaginationOptions = {}
): Promise<PaginatedResult<any>> => {
  const page = Math.max(1, Number(options.page) || 1);
  const limit = Math.min(50, Math.max(1, Number(options.limit) || 10));
  const skip = (page - 1) * limit;

  const query: Record<string, any> = {};

  if (options.tag) {
    query.tags = options.tag.toLowerCase();
  }

  if (options.search) {
    query.title = { $regex: escapeRegex(options.search), $options: "i" };
  }

  let sortField = "createdAt";
  let sortOrder: 1 | -1 = -1;

  if (options.sort) {
    const isDesc = options.sort.startsWith("-");
    const rawField = isDesc ? options.sort.slice(1) : options.sort;

    if (ALLOWED_SORT_FIELDS.includes(rawField)) {
      sortField = rawField;
      sortOrder = isDesc ? -1 : 1;
    }
  }

  const [data, total] = await Promise.all([
    DocumentModel.find(query)
      .sort({ [sortField]: sortOrder })
      .skip(skip)
      .limit(limit)
      .lean()
      .exec(),
    DocumentModel.countDocuments(query).exec()
  ]);

  const totalPages = Math.ceil(total / limit) || 1;

  return {
    data,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
      next: page < totalPages ? `?page=${page + 1}&limit=${limit}` : null,
      prev: page > 1 ? `?page=${page - 1}&limit=${limit}` : null
    }
  };
};
