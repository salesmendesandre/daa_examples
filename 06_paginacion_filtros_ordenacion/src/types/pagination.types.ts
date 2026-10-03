// CONTENIDO DE LA SESIÓN — Contratos y Tipos de Paginación

export interface PaginationOptions {
  page?: number;
  limit?: number;
  sort?: string;
  tag?: string;
  search?: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
  next: string | null;
  prev: string | null;
}

export interface PaginatedResult<T> {
  data: T[];
  meta: PaginationMeta;
}
