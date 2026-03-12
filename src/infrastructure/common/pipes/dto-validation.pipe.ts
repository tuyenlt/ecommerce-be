import { BadRequestException, ValidationPipe } from "@nestjs/common";

export class DtoValidationPipe extends ValidationPipe {
  constructor() {
    super({
      exceptionFactory: (errors) => {
        const extractErrors = (errors: any[], prefix = ""): any[] => {
          const allErrors: any[] = [];

          errors.forEach((error) => {
            const fieldPath = prefix ? `${prefix}.${error.property}` : error.property;

            if (error.constraints && Object.keys(error.constraints).length > 0) {
              allErrors.push({
                fieldName: fieldPath,
                message: Object.values(error.constraints),
              });
            }

            if (error.children && error.children.length > 0) {
              const childErrors = extractErrors(error.children, fieldPath);
              allErrors.push(...childErrors);
            }
          });

          return allErrors;
        };

        const allErrors = extractErrors(errors);
        return new BadRequestException({
          errors: allErrors,
        });
      },
    });
  }
}
