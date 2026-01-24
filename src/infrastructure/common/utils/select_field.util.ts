import { ClassConstructor, plainToInstance } from "class-transformer";

export function selectFields<T>(
  classType: ClassConstructor<T>,
): Record<string, boolean> {
  const instance = plainToInstance(classType, {});
  const booleanObject: Record<string, boolean> = {};
  for (const key of Object.keys(instance)) {
    booleanObject[key] = true;
  }
  return booleanObject;
}
