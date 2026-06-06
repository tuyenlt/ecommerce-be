import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { BannerEntity } from "../entities/banner.entity";
import { BaseCrudRepository } from "./base_crud.repository";
import { IBannerRepository } from "src/domain/repositories/banner-repository.interface";

@Injectable()
export class BannerRepository
  extends BaseCrudRepository<BannerEntity>
  implements IBannerRepository
{
  constructor(private readonly dataSource: DataSource) {
    super(dataSource.getRepository(BannerEntity));
  }
}
