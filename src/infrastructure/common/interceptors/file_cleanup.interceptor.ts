import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { Observable, throwError } from "rxjs";
import { catchError } from "rxjs/operators";
import * as fs from "fs";

@Injectable()
export class FileCleanupInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();

    return next.handle().pipe(
      catchError((err) => {
        if (request.file) {
          try {
            fs.unlink(request.file.path, () => {});
          } catch {}
        }
        return throwError(() => err);
      }),
    );
  }
}
