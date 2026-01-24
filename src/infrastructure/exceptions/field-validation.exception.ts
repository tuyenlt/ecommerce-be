import { BadRequestException } from "@nestjs/common";

export interface FieldError {
  fieldName?: string;
  message?: string;
}

export class FieldValidationException extends BadRequestException {
  constructor(public readonly errors: FieldError[]) {
    super({
      statusCode: 400,
      errors: errors,
    });
  }
}
