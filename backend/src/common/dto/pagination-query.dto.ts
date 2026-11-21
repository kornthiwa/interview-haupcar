import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import {
  getPagination,
  searchContains,
  toPaginated,
  type Paginated,
} from '../pagination.js';

export type { Paginated, PaginatedMeta } from '../pagination.js';

export class PaginationQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  pageSize = 10;

  @IsOptional()
  @IsString()
  q?: string;

  get skip() {
    return getPagination(this.page, this.pageSize).skip;
  }

  get take() {
    return getPagination(this.page, this.pageSize).take;
  }

  get searchTerm() {
    return searchContains(this.q);
  }

  toResult<T>(data: T[], total: number): Paginated<T> {
    const { page, pageSize } = getPagination(this.page, this.pageSize);
    return toPaginated(data, total, page, pageSize);
  }
}
