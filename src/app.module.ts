import { MiddlewareConsumer, Module, RequestMethod } from "@nestjs/common";
import { PassportModule } from "@nestjs/passport";
import { JwtModule } from "@nestjs/jwt";
import { ScheduleModule } from "@nestjs/schedule";
import { APP_FILTER, APP_GUARD } from "@nestjs/core";
import { LoggerModule } from "./infrastructure/logger/logger.module";
import { ExceptionsModule } from "./infrastructure/exceptions/exceptions.module";
import { UsecasesProxyModule } from "./infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { ControllersModule } from "./infrastructure/controllers/controllers.module";
import { JwtModule as JwtServiceModule } from "./infrastructure/services/jwt/jwt.module";
import { EnvironmentConfigModule } from "./infrastructure/config/environment-config/environment-config.module";
import { EmptyQueryMiddleware } from "./infrastructure/common/middlewares/empty_query.middleware";
import { CustomI18nModule } from "./infrastructure/config/i18n/i18n.module";
import { FieldValidationExceptionFilter } from "./infrastructure/exceptions/field-validation-exception.filter";
import { JwtStrategy } from "./infrastructure/common/strategies/jwt.stategy";
import { JwtAuthGuard } from "./infrastructure/common/guards/jwtAuth.guard";
import { GoogleStrategy } from "./infrastructure/common/strategies/google-oauth2.stategy";
import { join } from "path";
import { ServeStaticModule } from "@nestjs/serve-static";
import { ChatModule } from "./infrastructure/chat/chat.module";
import { SupportChatModule } from "./infrastructure/gateways/support-chat.module";

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, "..", "..", "uploads"),
      serveRoot: "/uploads",
    }),
    PassportModule,
    JwtModule.register({
      secret: process.env.secret,
    }),
    ScheduleModule.forRoot(),
    LoggerModule,
    ExceptionsModule,
    UsecasesProxyModule.register(),
    ControllersModule,
    ChatModule,
    SupportChatModule,
    JwtServiceModule,
    EnvironmentConfigModule,
    CustomI18nModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: FieldValidationExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    JwtStrategy,
    GoogleStrategy,
    EnvironmentConfigModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(EmptyQueryMiddleware).forRoutes({ path: "*", method: RequestMethod.ALL });
  }
}
