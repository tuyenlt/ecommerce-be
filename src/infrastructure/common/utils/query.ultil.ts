import { Between, LessThanOrEqual, MoreThanOrEqual, FindOptionsWhere } from "typeorm";

export function buildRangeQueryOperator<T>(
  field: keyof T,
  from?: any,
  to?: any,
): FindOptionsWhere<T> | undefined {
  if (from === undefined && to === undefined) {
    return undefined;
  }

  if (from !== undefined && to !== undefined) {
    return {
      [field]: Between(from, to),
    } as FindOptionsWhere<T>;
  }

  if (from !== undefined) {
    return {
      [field]: MoreThanOrEqual(from),
    } as FindOptionsWhere<T>;
  }

  return {
    [field]: LessThanOrEqual(to),
  } as FindOptionsWhere<T>;
}
