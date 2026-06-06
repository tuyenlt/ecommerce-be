import { BadRequestException, Injectable } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { DataSource } from "typeorm";
import { BaseUseCases } from "../base.usecases";
import { IFlashSaleRepository } from "src/domain/repositories/flash-sale-repository.interface";
import { IFlashSaleItemRepository } from "src/domain/repositories/flash-sale-item-repository.interface";
import { IProductRepository } from "src/domain/repositories/product-repository.interface";
import { FlashSaleEntity } from "src/infrastructure/entities/flash-sale.entity";
import { FlashSaleItemEntity } from "src/infrastructure/entities/flash-sale-item.entity";
import {
  CreateFlashSaleDto,
  UpdateFlashSaleDto,
  CreateFlashSaleItemDto,
} from "src/infrastructure/controllers/flash-sale/flash-sale.dto";

@Injectable()
export class FlashSaleUsecases extends BaseUseCases {
  constructor(
    private readonly flashSaleRepository: IFlashSaleRepository,
    private readonly flashSaleItemRepository: IFlashSaleItemRepository,
    private readonly productRepository: IProductRepository,
    private readonly i18n: I18nService,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async getAllFlashSales() {
    return await this.flashSaleRepository.getAll({
      relations: ["items", "items.product"],
      order: { start_time: "DESC" },
    });
  }

  async getFlashSaleById(id: number) {
    const flashSale = await this.flashSaleRepository.getOne({
      where: { id },
      relations: ["items", "items.product"],
    });
    if (!flashSale) {
      throw new BadRequestException(this.i18n.t("flash-sale.NOT_FOUND"));
    }
    return flashSale;
  }

  async getActiveFlashSales() {
    const now = new Date();
    const flashSales = await this.flashSaleRepository.getAll({
      where: { is_active: true },
      relations: ["items", "items.product"],
    });

    return flashSales.filter((fs) => {
      return new Date(fs.start_time) <= now && new Date(fs.end_time) >= now;
    });
  }

  async createFlashSale(dto: CreateFlashSaleDto) {
    return await this.executeTransaction(async (queryRunner) => {
      const flashSale = new FlashSaleEntity();
      flashSale.name = dto.name;
      flashSale.description = dto.description;
      flashSale.start_time = new Date(dto.start_time);
      flashSale.end_time = new Date(dto.end_time);
      flashSale.is_active = dto.is_active !== undefined ? dto.is_active : true;

      const savedFlashSale = await this.flashSaleRepository.create(flashSale, queryRunner);

      if (dto.items && dto.items.length > 0) {
        await this.addItemsToFlashSaleInternal(savedFlashSale.id, dto.items, queryRunner);
      }

      return {
        message: this.i18n.t("flash-sale.CREATED_SUCCESSFULLY"),
      };
    });
  }

  async updateFlashSale(id: number, dto: UpdateFlashSaleDto) {
    return await this.executeTransaction(async (queryRunner) => {
      const flashSale = await this.getFlashSaleById(id);

      const updateData: Partial<FlashSaleEntity> = {};
      if (dto.name !== undefined) updateData.name = dto.name;
      if (dto.description !== undefined) updateData.description = dto.description;
      if (dto.start_time !== undefined) updateData.start_time = new Date(dto.start_time);
      if (dto.end_time !== undefined) updateData.end_time = new Date(dto.end_time);
      if (dto.is_active !== undefined) updateData.is_active = dto.is_active;

      await this.flashSaleRepository.update({ where: { id } }, updateData, queryRunner);

      if (dto.items !== undefined) {
        // Remove existing items first
        if (flashSale.items && flashSale.items.length > 0) {
          await this.removeItemsFromFlashSaleInternal(
            id,
            flashSale.items.map((i) => i.id),
            queryRunner,
          );
        }
        // Add new items
        if (dto.items.length > 0) {
          await this.addItemsToFlashSaleInternal(id, dto.items, queryRunner);
        }
      }

      return {
        message: this.i18n.t("flash-sale.UPDATED_SUCCESSFULLY"),
      };
    });
  }

  async deleteFlashSale(id: number) {
    return await this.executeTransaction(async (queryRunner) => {
      const flashSale = await this.getFlashSaleById(id);

      if (flashSale.items && flashSale.items.length > 0) {
        await this.removeItemsFromFlashSaleInternal(
          id,
          flashSale.items.map((i) => i.id),
          queryRunner,
        );
      }

      await this.flashSaleRepository.removeById(id, {}, queryRunner);

      return {
        message: this.i18n.t("flash-sale.DELETED_SUCCESSFULLY"),
      };
    });
  }

  async addItemsToFlashSale(flashSaleId: number, items: CreateFlashSaleItemDto[]) {
    return await this.executeTransaction(async (queryRunner) => {
      await this.getFlashSaleById(flashSaleId);
      await this.addItemsToFlashSaleInternal(flashSaleId, items, queryRunner);
      return {
        message: this.i18n.t("flash-sale.ITEMS_ADDED_SUCCESSFULLY"),
      };
    });
  }

  async removeItemsFromFlashSale(flashSaleId: number, itemIds: number[]) {
    return await this.executeTransaction(async (queryRunner) => {
      await this.getFlashSaleById(flashSaleId);
      await this.removeItemsFromFlashSaleInternal(flashSaleId, itemIds, queryRunner);
      return {
        message: this.i18n.t("flash-sale.ITEMS_REMOVED_SUCCESSFULLY"),
      };
    });
  }

  private async addItemsToFlashSaleInternal(
    flashSaleId: number,
    items: CreateFlashSaleItemDto[],
    queryRunner: any,
  ) {
    for (const dto of items) {
      const product = await this.productRepository.getOneById(dto.product_id);
      if (!product) {
        throw new BadRequestException(`Product with ID ${dto.product_id} not found`);
      }

      // If the product is already linked to another active flash sale item, we should clean it up
      if (product.flash_sale_item_id) {
        const oldItem = await this.flashSaleItemRepository.getOne({
          where: { id: product.flash_sale_item_id },
        });
        if (oldItem) {
          await this.productRepository.update(
            { where: { id: product.id } },
            { flash_sale_item_id: null },
            queryRunner,
          );
          await this.flashSaleItemRepository.removeById(oldItem.id, {}, queryRunner);
        }
      }

      const item = new FlashSaleItemEntity();
      item.product_id = dto.product_id;
      item.flash_sale_id = flashSaleId;
      item.price = dto.price;
      item.quantity = dto.quantity;

      const savedItem = await this.flashSaleItemRepository.create(item, queryRunner);

      // Link product to the flash sale item
      await this.productRepository.update(
        { where: { id: product.id } },
        { flash_sale_item_id: savedItem.id },
        queryRunner,
      );
    }
  }

  private async removeItemsFromFlashSaleInternal(
    flashSaleId: number,
    itemIds: number[],
    queryRunner: any,
  ) {
    for (const itemId of itemIds) {
      const item = await this.flashSaleItemRepository.getOne({
        where: { id: itemId, flash_sale_id: flashSaleId },
      });
      if (item) {
        // Set relation on product to null first
        await this.productRepository.update(
          { where: { flash_sale_item_id: itemId } },
          { flash_sale_item_id: null },
          queryRunner,
        );
        // Delete the flash sale item
        await this.flashSaleItemRepository.removeById(itemId, {}, queryRunner);
      }
    }
  }
}
