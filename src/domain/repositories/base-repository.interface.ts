import { DeepPartial, FindOptionsOrder } from "typeorm";

export interface IBaseRepository<T> {
  create(data: DeepPartial<T>, queryRunner?: any): Promise<T>;
  update(id: number, data: DeepPartial<T>, queryRunner?: any): Promise<any>;
  upsert(
    data: any,
    queryRunner?: any,
    options?: {
      conflicts: string[];
    },
  ): Promise<any>;
  findByFilter(
    filter: any,
    select?: { [key: string]: boolean },
    relation?: string[],
    order?: { [key: string]: "ASC" | "DESC" },
  ): Promise<T[]>;
  findOneByFilter(
    filter: any,
    select?: { [key: string]: boolean },
    relation?: string[],
    order?: FindOptionsOrder<any>,
    withDeleted?: boolean,
  ): Promise<T | null>;
  getListsWithGetRawMany(
    query: any,
    callbackQuery: (queryBuilder) => any,
    callbackSelectData: (data) => any,
  ): Promise<any>;
  getListsWithGetMany(
    query: any,
    callbackQuery: (queryBuilder) => any,
    callbackSelectData: (data) => any,
  ): Promise<any>;
  delete(id: number, queryRunner?: any): Promise<any>;
  bulkDelete(ids: number[], queryRunner?: any): Promise<any>;
  deleteBy(where): Promise<any>;
  getOneByFilter(
    callbackQuery: (queryBuilder) => any,
    callbackSelectData: (data) => any,
  ): Promise<any>;
  setSearch(queryBuilder, searchFields: string[], keyword: string): any;
}
