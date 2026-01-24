import { FindOptionsOrder } from "typeorm";


export interface IBaseRepository {
  create(data: any, queryRunner?: any): Promise<any>;
  update(id: number, data: any, queryRunner?: any): Promise<any>;
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
  ): Promise<any>;
  findOneByFilter(
    filter: any,
    select?: { [key: string]: boolean },
    relation?: string[],
    order?: FindOptionsOrder<any>,
    withDeleted?: boolean,
  ): Promise<any>;
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
