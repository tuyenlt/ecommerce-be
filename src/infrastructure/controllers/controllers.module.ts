import { Module } from "@nestjs/common";
import { UsecasesProxyModule } from "../usecases-proxy/modules/usecases-proxy.module";
import { AuthController } from "./auth/auth.controller";

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [AuthController],
})
export class ControllersModule {}
