import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { IJwtService } from "../../../domain/adapters/jwt.interface";
import { TokenPayload } from "src/domain/model/auth";
import { EnvironmentConfigService } from "src/infrastructure/config/environment-config/environment-config.service";

@Injectable()
export class JwtTokenService implements IJwtService {
  constructor(
    private readonly environmentConfig: EnvironmentConfigService,
    private readonly jwtService: JwtService,
  ) {}

  signAccessToken(payload: TokenPayload): string {
    const secret = this.environmentConfig.getJwtSecret();
    const expiresIn = this.environmentConfig.getJwtExpirationTime();
    return this.jwtService.sign(payload, {
      secret,
      expiresIn,
    });
  }

  signRefreshToken(payload: TokenPayload): string {
    return this.jwtService.sign(payload, {
      secret: this.environmentConfig.getJwtRefreshSecret(),
      expiresIn: this.environmentConfig.getJwtRefreshExpirationTime(),
    });
  }

  verifyAccessToken(token: string): TokenPayload {
    try {
      return this.jwtService.verify<TokenPayload>(token, {
        secret: this.environmentConfig.getJwtSecret(),
      });
    } catch {
      throw new UnauthorizedException("Invalid access token");
    }
  }

  verifyRefreshToken(token: string): TokenPayload {
    try {
      return this.jwtService.verify<TokenPayload>(token, {
        secret: this.environmentConfig.getJwtRefreshSecret(),
      });
    } catch {
      throw new UnauthorizedException("Invalid refresh token");
    }
  }
}
