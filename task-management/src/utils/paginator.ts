import { Injectable } from '@nestjs/common';
import { SelectQueryBuilder } from 'typeorm';

interface PaginationInfo {
  currentPage: number;
  limit: number;
  totalItems: number;
  pages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

@Injectable()
export class Paginator {
  async paginate(queryBuilder, page: number = 1, limit: number = 10) {
    page = Number(page) || 1;
    limit = Number(limit) || 10;
    const offset = (page - 1) * limit;
    const records = await queryBuilder.skip(offset).take(limit).getMany();
    const totalItems = await queryBuilder.getCount();

    const pages = Math.ceil(totalItems / limit);
    const currentPage = offset / limit + 1;
    const hasNext = currentPage < pages;
    const hasPrevious = currentPage > 1;

    const paginationInfo: PaginationInfo = {
      currentPage: page,
      limit: limit,
      totalItems,
      pages,
      hasNext,
      hasPrevious,
    };
    return { records, paginationInfo };
  }

  paginator<TEntity>(
    queryBuilder: SelectQueryBuilder<TEntity>,
    page,
    limit,
  ): SelectQueryBuilder<TEntity> {
    page = Math.max(1, page);
    limit = Math.max(1, limit);
    const skip = (page - 1) * limit;
    return queryBuilder.skip(skip).take(limit);
  }
}
