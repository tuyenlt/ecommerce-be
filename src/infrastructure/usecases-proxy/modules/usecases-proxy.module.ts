import { DynamicModule, Global, Module } from "@nestjs/common";
import { ProxyModule } from ".";
import { LoggerModule } from "src/infrastructure/logger/logger.module";
import { JwtModule } from "@nestjs/jwt";
import { EnvironmentConfigModule } from "src/infrastructure/config/environment-config/environment-config.module";
import { ExceptionsModule } from "src/infrastructure/exceptions/exceptions.module";
import { JwtTokenService } from "src/infrastructure/services/jwt/jwt.service";
import { BcryptModule } from "src/infrastructure/services/bcrypt/bcrypt.module";
import { RepositoriesModule } from "src/infrastructure/repositories/repositories.module";
import authUsecasesProvider from "../providers/auth-usecases.provider";
import ratingUsecasesProvider from "../providers/rating-usecases.provider";
import productUsecasesProvider from "../providers/product-usecases.provider";
import categoryUsecasesProvider from "../providers/category-usecases.provider";

@Module({
  imports: [
    LoggerModule,
    JwtModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionsModule,
    BcryptModule,
  ],
  providers: [JwtTokenService],
  exports: [JwtTokenService],
})
@Global()
export class UsecasesProxyModule extends ProxyModule {
  static register(): DynamicModule {
    return {
      module: UsecasesProxyModule,
      providers: [
        authUsecasesProvider,
        ratingUsecasesProvider,
        productUsecasesProvider,
        categoryUsecasesProvider,
      ],
      exports: Object.values(ProxyModule),
    };
  }
}
