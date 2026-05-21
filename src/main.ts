import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import * as cookieParser from "cookie-parser";
import { AppModule } from "./app.module";
import { AllExceptionFilter } from "./infrastructure/common/filter/exception.filter";
import { LoggingInterceptor } from "./infrastructure/common/interceptors/logger.interceptor";
import {
  ResponseFormat,
  ResponseInterceptor,
} from "./infrastructure/common/interceptors/response.interceptor";
import { LoggerService } from "./infrastructure/logger/logger.service";
import { TrimBodyPipe } from "./infrastructure/common/pipes/trim-body.pipe";
import { ModifyPagingFilterPipe } from "./infrastructure/common/pipes/modify-paging-filter.pipe";
import { useContainer } from "class-validator";
import { DtoValidationPipe } from "./infrastructure/common/pipes/dto-validation.pipe";

async function bootstrap() {
  const env = process.env.NODE_ENV;
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  // Filter
  app.useGlobalFilters(new AllExceptionFilter(new LoggerService()));
  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  // pipes
  app.useGlobalPipes(new TrimBodyPipe(), new ModifyPagingFilterPipe(), new DtoValidationPipe());

  // interceptors
  app.useGlobalInterceptors(new LoggingInterceptor(new LoggerService()));
  app.useGlobalInterceptors(new ResponseInterceptor());

  // base routing
  app.setGlobalPrefix("api/v1");

  // swagger config
  if (env !== "production") {
    const config = new DocumentBuilder().addBearerAuth().setVersion("1.0").build();
    const document = SwaggerModule.createDocument(app, config, {
      extraModels: [ResponseFormat],
      deepScanRoutes: true,
    });
    SwaggerModule.setup("api", app, document);
    // fs.writeFileSync("./local-docs/swagger-spec.json", JSON.stringify(document, null, 2));
  }

  app.enableCors({
    credentials: true,
    origin: [
      "http://localhost:3000",
      process.env.FRONTEND_URL,
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    // alway enable CORS for all origins
    // origin: "*",
  });

  await app.listen(process.env.SERVER_PORT || 3000);
}

bootstrap();
