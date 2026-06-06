import { Provider } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { DataSource } from "typeorm";
import { UseCaseProxy } from "../usecases-proxy";
import { BannerUsecases } from "src/usecases/banner/banner.usecases";
import { BannerRepository } from "src/infrastructure/repositories/banner.repository";
import { ProxyModule } from "../modules";

export const bannerUsecasesProvider: Provider = {
  provide: ProxyModule.BANNER_USECASES,
  useFactory: (bannerRepository: BannerRepository, i18n: I18nService, dataSource: DataSource) => {
    return new UseCaseProxy(new BannerUsecases(bannerRepository, i18n, dataSource));
  },
  inject: [BannerRepository, I18nService, DataSource],
};

export default bannerUsecasesProvider;
