import { FlashSaleEntity } from "src/infrastructure/entities/flash-sale.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface IFlashSaleRepository extends IBaseRepository<FlashSaleEntity> {}
