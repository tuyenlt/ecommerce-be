import { FindOptionsOrder, FindOptionsSelect, FindOptionsWhere } from "typeorm";
import { BaseEntity } from "src/infrastructure/entities/base.entity";

declare global {
  type FindOptions<T extends BaseEntity> = {
    /** conditions */
    where?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
    /** sorting */
    order?: FindOptionsOrder<T>;
    /** join tables */
    relations?: string[];
    /** on/off eager */
    loadEagerRelations?: boolean;
    /** including data is deleted */
    withDeleted?: boolean;
    /** select fields from DB */
    select?: FindOptionsSelect<T>;
  };

  type FindOrFailOptions<T extends BaseEntity> = FindOptions<T> & {
    /** return when record not found */
    errorMessage?: string;
  };

  type FindPaginatedOptions<T extends BaseEntity> = Partial<FindOptions<T>> & {
    /** item per page */
    limit?: number;
    /** current page */
    page?: number;
    /**
     * filter
     * @examples { "name": "ABC" }
     */
    filter?: FindOptionsWhere<T> | FindOptionsWhere<T>[];
  };

  type IPaginationResponse<T> = {
    /** array items */
    data: T[];
    pagination: {
      /** item per page */
      limit: number;
      /** current page */
      page: number;
      /** total item */
      total: number;
    };
  };

  type IResponse<T> = {
    /** Response status code */
    status: number;
    /** data */
    data: T;
    /** Data pagination */
    pagination?: {
      /** items per page */
      limit: number;
      /** current page */
      page: number;
      /** total item */
      total: number;
    };
  };

  type GenerateTokenData = {
    accessToken: string;
  };

  type LogoutData = {
    success: boolean;
  };
}

export {};
