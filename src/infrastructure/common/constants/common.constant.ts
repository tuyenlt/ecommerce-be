export enum TABLE_NAME {}

export enum ORDER_DIRECTION {
  ASC = "ASC",
  DESC = "DESC",
}

export const STORE_LAT = 20.9707472;
export const STORE_LNG = 105.7888318;
export const MIN_SHIPPING_FEE = 10000;
export const RATE_PER_KM = 3000;

export const HTTP_STATUS_CODE = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
};

export const FIELD_SORT_DEFAULT = "id";
export const PAGINATION_PAGE_SIZE = 10;
export const PAGINATION_PAGE_DEFAULT = 1;
