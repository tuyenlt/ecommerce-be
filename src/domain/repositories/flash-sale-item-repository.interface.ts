import { FlashSaleItemEntity } from "src/infrastructure/entities/flash-sale-item.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface IFlashSaleItemRepository extends IBaseRepository<FlashSaleItemEntity> {}
