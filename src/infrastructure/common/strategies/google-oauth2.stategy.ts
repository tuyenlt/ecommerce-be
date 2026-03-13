import { PassportStrategy } from "@nestjs/passport";
import { Strategy, VerifyCallback } from "passport-google-oauth20";
import { Inject, Injectable } from "@nestjs/common";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { AuthUsecases } from "src/usecases/auth/auth.usecases";

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, "google-oauth2") {
  constructor(
    @Inject(UsecasesProxyModule.AUTH_USECASES)
    private readonly authUsecases: UseCaseProxy<AuthUsecases>,
  ) {
    super({
      clientID: process.env.OAUTH2_GOOGLE_CLIENT_ID,
      clientSecret: process.env.OAUTH2_GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.DOMAIN}/api/v1/auth/google/call-back`,
      scope: ["email", "profile"],
    });
  }

  async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback) {
    const result = await this.authUsecases.getInstance().validateUserForGoogleOAuth2(profile);
    done(null, result);
  }
}
