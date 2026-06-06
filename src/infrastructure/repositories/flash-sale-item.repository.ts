import { Injectable } from "@nestjs/common";
import { DataSource } from "typeorm";
import { FlashSaleItemEntity } from "../entities/flash-sale-item.entity";
import { BaseCrudRepository } from "./base_crud.repository";
import { IFlashSaleItemRepository } from "src/domain/repositories/flash-sale-item-repository.interface";

@Injectable()
export class FlashSaleItemRepository
  extends BaseCrudRepository<FlashSaleItemEntity>
  implements IFlashSaleItemRepository
{
  constructor(private readonly dataSource: DataSource) {
    super(dataSource.getRepository(FlashSaleItemEntity));
  }
}
