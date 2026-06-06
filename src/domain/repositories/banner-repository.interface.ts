import { BannerEntity } from "src/infrastructure/entities/banner.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface IBannerRepository extends IBaseRepository<BannerEntity> {}
