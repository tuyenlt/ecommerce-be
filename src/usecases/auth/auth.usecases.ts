import { IBcryptService } from "src/domain/adapters/bcrypt.interface";
import { BaseUseCases } from "../base.usecases";
import { IJwtService } from "src/domain/adapters/jwt.interface";
import { TokenPayload } from "src/domain/model/auth";
import { IUserRepository } from "src/domain/repositories/user-repository.interface";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { UserEntity } from "src/infrastructure/entities/user.entity";
import { RegisterRequestDto } from "src/infrastructure/controllers/auth/dtos/register_request.dto";
import { DataSource } from "typeorm";

export class AuthUsecases extends BaseUseCases {
  private readonly RT_EXPIRES_IN = process.env.JWT_REFRESH_TOKEN_EXPIRATION_TIME;
  constructor(
    private readonly userRepository: IUserRepository,
    private readonly bycryptService: IBcryptService,
    private readonly jwtService: IJwtService,
    private readonly i18n: I18nService,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async register(dto: RegisterRequestDto) {
    const userWithSameIdentity = await this.userRepository.findOneByFilter({ email: dto.email });
    if (userWithSameIdentity) {
      throw new BadRequestException(this.i18n.t("auth.EMAIL_ALREADY_EXISTS"));
    }
    const hashedPassword = await this.bycryptService.hash(dto.password);
    const newUser = await this.userRepository.create({
      email: dto.email,
      password: hashedPassword,
      full_name: dto.full_name,
    });
    return this.issueTokens(newUser);
  }

  async loginByEmail(email: string, password: string) {
    const user = await this.userRepository.findOneByFilter(
      { email },
      {
        password: true,
        id: true,
        email: true,
        full_name: true,
        avatar_url: true,
        role: true,
      },
    );
    if (!user) {
      throw new BadRequestException(this.i18n.t("auth.INVALID_CREDENTIALS"));
    }
    const isPasswordValid = await this.bycryptService.compare(password, user.password);
    if (!isPasswordValid) {
      throw new BadRequestException(this.i18n.t("auth.INVALID_CREDENTIALS"));
    }
    return await this.issueTokens(user);
  }

  async refreshToken(refresh_token: string) {
    const payload = this.jwtService.verifyRefreshToken(refresh_token);
    const user = await this.userRepository.findOneByFilter(
      { id: payload.id },
      {
        id: true,
        email: true,
        full_name: true,
        avatar_url: true,
        role: true,
        refresh_token: true,
      },
    );
    if (!user) {
      throw new UnauthorizedException(this.i18n.t("auth.INVALID_CREDENTIALS"));
    }
    if (user.refresh_token !== refresh_token) {
      throw new UnauthorizedException(this.i18n.t("auth.INVALID_CREDENTIALS"));
    }
    return await this.issueTokens(user);
  }

  private async issueTokens(user: UserEntity) {
    const payload = this.createTokenPayload(user);
    const accessToken = this.jwtService.signAccessToken(payload);
    const refreshToken = this.jwtService.signRefreshToken(payload);
    await this.userRepository.update(user.id, {
      refresh_token: refreshToken,
    });

    return {
      accessToken,
      refreshTokenCookie: await this.generateRefreshTokenCookie(refreshToken),
    };
  }

  async logout(userId: number) {
    const user = await this.userRepository.findOneByFilter({ id: userId });
    if (!user) {
      throw new UnauthorizedException(this.i18n.t("auth.INVALID_CREDENTIALS"));
    }
    user.refresh_token = null;
    await this.userRepository.update(userId, user);
  }

  private createTokenPayload(user: UserEntity): TokenPayload {
    const tokenPayload: TokenPayload = {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      avatar_url: user.avatar_url,
      role: user.role,
    };
    return tokenPayload;
  }

  async validateUserForGoogleOAuth2(profile: any) {
    const email = profile.emails[0].value;
    const name = profile.displayName;

    const user = await this.userRepository.findOneByFilter({ email });
    if (!user) {
      const newUser = await this.userRepository.create({
        email,
        full_name: name,
        password: "google-oauth2",
        avatar_url: profile.photos[0]?.value || null,
      });
      return this.issueTokens(newUser);
    }

    return await this.issueTokens(user);
  }

  private async generateRefreshTokenCookie(refresh_token: string) {
    return `Refresh=${refresh_token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${this.RT_EXPIRES_IN}`;
  }
}
