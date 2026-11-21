export type PaginatedMeta = {
  page: number;
  pageSize: number;
  total: number;
  pageCount: number;
};

export type Paginated<T> = {
  data: T[];
  meta: PaginatedMeta;
};

export function getPagination(page = 1, pageSize = 10) {
  const safePage = Math.max(1, page);
  const safePageSize = Math.min(100, Math.max(1, pageSize));
  return {
    page: safePage,
    pageSize: safePageSize,
    skip: (safePage - 1) * safePageSize,
    take: safePageSize,
  };
}

export function toPaginated<T>(
  data: T[],
  total: number,
  page: number,
  pageSize: number,
): Paginated<T> {
  return {
    data,
    meta: {
      page,
      pageSize,
      total,
      pageCount: Math.max(1, Math.ceil(total / pageSize)),
    },
  };
}

export function searchContains(q?: string) {
  const term = q?.trim();
  return term ? term : undefined;
}
