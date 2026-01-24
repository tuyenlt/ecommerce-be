export interface FieldError {
  fieldName?: string;
  message?: string;
}
export interface IFormatExceptionMessage {
  // message: string;
  code_error?: number;
  errors?: FieldError[];
}

export interface IException {
  badRequestException(data: IFormatExceptionMessage): void;
  internalServerErrorException(data?: IFormatExceptionMessage): void;
  forbiddenException(data?: IFormatExceptionMessage): void;
  UnauthorizedException(data?: IFormatExceptionMessage): void;
}
