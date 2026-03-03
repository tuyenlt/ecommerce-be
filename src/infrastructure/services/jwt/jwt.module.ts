import { Module } from "@nestjs/common";
import { JwtModule as Jwt } from "@nestjs/jwt";
import { JwtTokenService } from "./jwt.service";
import { EnvironmentConfigModule } from "src/infrastructure/config/environment-config/environment-config.module";

@Module({
  imports: [
    Jwt.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "24h" },
    }),
    EnvironmentConfigModule,
  ],
  providers: [JwtTokenService],
  exports: [JwtTokenService],
})
export class JwtModule {}
