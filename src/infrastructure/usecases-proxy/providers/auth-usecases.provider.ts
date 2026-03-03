import { I18nService } from "nestjs-i18n";
import { UserRepository } from "src/infrastructure/repositories/user.repository";
import { BcryptService } from "src/infrastructure/services/bcrypt/bcrypt.service";
import { JwtTokenService } from "src/infrastructure/services/jwt/jwt.service";
import { AuthUsecases } from "src/usecases/auth/auth.usecases";
import { ProxyModule } from "../modules";
import { DataSource } from "typeorm";
import { UseCaseProxy } from "../usecases-proxy";

export default {
  provide: ProxyModule.AUTH_USECASES,
  inject: [UserRepository, JwtTokenService, BcryptService, I18nService, DataSource],
  useFactory: (
    userRepository: UserRepository,
    jwtService: JwtTokenService,
    bcryptService: BcryptService,
    i18nService: I18nService,
    dataSource: DataSource,
  ) => {
    return new UseCaseProxy(
      new AuthUsecases(userRepository, bcryptService, jwtService, i18nService, dataSource),
    );
  },
};
