import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { FlashSaleEntity } from "../entities/flash-sale.entity";
import { BaseCrudRepository } from "./base_crud.repository";
import { IFlashSaleRepository } from "src/domain/repositories/flash-sale-repository.interface";

@Injectable()
export class FlashSaleRepository
  extends BaseCrudRepository<FlashSaleEntity>
  implements IFlashSaleRepository
{
  constructor(private readonly dataSource: DataSource) {
    super(dataSource.getRepository(FlashSaleEntity));
  }
}
