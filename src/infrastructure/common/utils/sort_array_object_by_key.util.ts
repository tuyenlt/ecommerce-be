import { sortBy } from "lodash";

export function customSortedArray(data, keySort: string) {
  return sortBy(data, [keySort]);
}
