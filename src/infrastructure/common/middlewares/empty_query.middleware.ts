import { Injectable, NestMiddleware } from "@nestjs/common";
import { Request, Response, NextFunction } from "express";
import { trim, mapKeys, isArray } from "lodash";

type QueryType =
  | string
  | number
  | number[]
  | string[]
  | Record<string, string | number>
  | Record<string, string | number>[];

@Injectable()
export class EmptyQueryMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req?.query && Object.keys(req.query).length) {
      this.removeEmptyValue(req.query as unknown as QueryType);
    }
    next();
  }

  removeEmptyValue(query: QueryType): void {
    const removeEmpty = (item: any) => {
      mapKeys(item, (value, key) => {
        // remove null, undefined, empty
        if (value !== 0 && !value) {
          delete item[key];
        }
        // remove string contain only space characters
        else if (typeof value === "string" && !trim(value as string)) {
          delete item[key];
        }

        // iterate array
        else if (isArray(value)) {
          value = value.filter((property) => {
            // remove null, undefined, empty
            if (property !== 0 && !property) {
              return false;
            }

            // remove string contain only space characters
            else if (typeof property === "string" && !trim(property as string)) {
              return false;
            }
            return true;
          });
        }
      });
    };
    removeEmpty(query);
  }
}
