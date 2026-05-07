import { ILike } from "typeorm";
import { PaginationDto } from "../dtos/base.dto";

export function paginationHelper<T>(
  array: T[],
  paginationDto: PaginationDto,
): IPaginationResponse<T> {
  const limit = +(paginationDto.limit || 10);
  const page = +(paginationDto.page || 1);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  return {
    data: array.slice(startIndex, endIndex),
    pagination: {
      limit,
      page,
      total: array.length,
    },
  };
}

function processObject(obj: any): any {
  return Object.keys(obj).reduce((acc, key) => {
    const value = obj[key];
    if (typeof value === "object" && value !== null) {
      acc[key] = processObject(value);
    } else if (typeof value !== "symbol" && !/id/.test(key)) {
      acc[key] = ILike(`%${value}%`);
    } else {
      acc[key] = value;
    }
    return acc;
  }, {});
}

export function applyLikeFilter(where: Record<string, any | any[]>): Record<string, any | any[]> {
  if (!where) {
    return {};
  } else if (Array.isArray(where)) {
    return where.map((param) => processObject(param));
  } else {
    return processObject(where);
  }
}
