import { Module } from "@nestjs/common";
import { UsecasesProxyModule } from "../usecases-proxy/modules/usecases-proxy.module";

@Module({
  imports: [UsecasesProxyModule.register()],
  controllers: [],
})
export class ControllersModule {}
