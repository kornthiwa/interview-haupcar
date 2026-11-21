export type ListQuery = {
  page?: number
  pageSize?: number
  q?: string
}

export type PaginatedMeta = {
  page: number
  pageSize: number
  total: number
  pageCount: number
}

export type Paginated<T> = {
  data: T[]
  meta: PaginatedMeta
}
