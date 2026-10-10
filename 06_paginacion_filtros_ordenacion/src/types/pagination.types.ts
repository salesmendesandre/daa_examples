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

// EJERCICIO 3 (punto 5): enlaces HATEOAS. En el catálogo sustituyen a los
// "next"/"prev" relativos del contenido por URLs completas que conservan el
// resto de filtros de la petición (?category=..., ?brand=...).
export interface HateoasLinks {
  first: string;
  prev: string | null;
  next: string | null;
  last: string;
}

export interface PaginatedResultWithLinks<T> {
  data: T[];
  meta: Omit<PaginationMeta, "next" | "prev">;
  links: HateoasLinks;
}
