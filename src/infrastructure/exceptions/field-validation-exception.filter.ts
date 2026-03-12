import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import { Response } from "express";
import { FieldValidationException } from "./field-validation.exception";

@Catch(FieldValidationException)
export class FieldValidationExceptionFilter implements ExceptionFilter {
  catch(exception: FieldValidationException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = HttpStatus.BAD_REQUEST;

    response.status(status).json({
      statusCode: status,
      errors: exception.errors,
    });
  }
}
