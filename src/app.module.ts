
import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ScheduleModule } from "@nestjs/schedule";
import { APP_FILTER } from "@nestjs/core";
import { LoggerModule } from "./infrastructure/logger/logger.module";
import { ExceptionsModule } from "./infrastructure/exceptions/exceptions.module";
import { UsecasesProxyModule } from "./infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { ControllersModule } from "./infrastructure/controllers/controllers.module";
import { JwtModule as JwtServiceModule } from "./infrastructure/services/jwt/jwt.module";
import { EnvironmentConfigModule } from "./infrastructure/config/environment-config/environment-config.module";
import { EmptyQueryMiddleware } from "./infrastructure/common/middlewares/empty_query.middleware";
import { CustomI18nModule } from "./infrastructure/config/i18n/i18n.module";
import { FieldValidationExceptionFilter } from "./infrastructure/exceptions/field-validation-exception.filter";

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.secret,
    }),
    ScheduleModule.forRoot(),
    LoggerModule,
    ExceptionsModule,
    UsecasesProxyModule.register(),
    ControllersModule,
    JwtServiceModule,
    EnvironmentConfigModule,
    CustomI18nModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: FieldValidationExceptionFilter,
    },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(EmptyQueryMiddleware)
      .forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
