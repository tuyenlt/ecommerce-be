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
import { HttpModule } from "@nestjs/axios";
import userUsecasesProvider from "../providers/user-usecases.provider";
import cartUsecasesProvider from "../providers/cart-usecases.provider";
import orderUsecasesProvider from "../providers/order-usecases.provider";
import statUsecasesProvider from "../providers/stat-usecases.provider";
import bannerUsecasesProvider from "../providers/banner-usecases.provider";
import supportChatUsecasesProvider from "../providers/support-chat-usecases.provider";
import { OnlineBankingModule } from "src/infrastructure/services/online-banking/online-banking.module";
import { StorageModule } from "src/infrastructure/services/storage/storage.module";
import { DataProcessingModule } from "src/infrastructure/services/data-processing/data-processing.module";
@Module({
  imports: [
    LoggerModule,
    JwtModule,
    EnvironmentConfigModule,
    RepositoriesModule,
    ExceptionsModule,
    BcryptModule,
    HttpModule,
    OnlineBankingModule,
    StorageModule,
    DataProcessingModule,
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
        userUsecasesProvider,
        cartUsecasesProvider,
        orderUsecasesProvider,
        statUsecasesProvider,
        bannerUsecasesProvider,
        supportChatUsecasesProvider,
      ],
      exports: Object.values(ProxyModule),
    };
  }
}
