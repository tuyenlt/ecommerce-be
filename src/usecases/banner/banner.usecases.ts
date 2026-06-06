import { BadRequestException, Injectable } from "@nestjs/common";
import { I18nService } from "nestjs-i18n";
import { DataSource } from "typeorm";
import { BaseUseCases } from "../base.usecases";
import { IBannerRepository } from "src/domain/repositories/banner-repository.interface";
import { BannerEntity } from "src/infrastructure/entities/banner.entity";
import { CreateBannerDto, UpdateBannerDto } from "src/infrastructure/controllers/banner/banner.dto";
import * as fs from "fs";
import * as path from "path";

@Injectable()
export class BannerUsecases extends BaseUseCases {
  constructor(
    private readonly bannerRepository: IBannerRepository,
    private readonly i18n: I18nService,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async getAllBanners() {
    return await this.bannerRepository.getAll({
      order: {
        sort_order: "ASC",
        created_at: "DESC",
      },
    });
  }

  async getActiveBanners() {
    const now = new Date();
    const banners = await this.bannerRepository.getAll({
      where: {
        is_active: true,
      },
      order: {
        sort_order: "ASC",
      },
    });

    return banners.filter((banner) => {
      const isAfterStart = !banner.start_date || new Date(banner.start_date) <= now;
      const isBeforeEnd = !banner.end_date || new Date(banner.end_date) >= now;
      return isAfterStart && isBeforeEnd;
    });
  }

  async getBannerById(id: number) {
    const banner = await this.bannerRepository.getOneById(id);
    if (!banner) {
      throw new BadRequestException(this.i18n.t("banner.BANNER_NOT_FOUND"));
    }
    return banner;
  }

  async createBanner(dto: CreateBannerDto, image: Express.Multer.File): Promise<BannerEntity> {
    const banner = new BannerEntity();
    banner.title = dto.title;
    banner.description = dto.description;

    const DOMAIN = process.env.DOMAIN || "http://localhost:3000";
    banner.image_url = `${DOMAIN}/uploads/images/${image.filename}`;

    banner.redirect_url = dto.redirect_url || null;
    banner.sort_order = dto.sort_order || 0;
    banner.is_active = dto.is_active !== undefined ? dto.is_active : true;
    banner.start_date = dto.start_date ? new Date(dto.start_date) : null;
    banner.end_date = dto.end_date ? new Date(dto.end_date) : null;

    return await this.bannerRepository.create(banner);
  }

  async updateBanner(id: number, dto: UpdateBannerDto, image?: Express.Multer.File) {
    const currentBanner = await this.getBannerById(id);

    const updateData: Partial<BannerEntity> = {};
    if (dto.title !== undefined) updateData.title = dto.title;
    if (dto.description !== undefined) updateData.description = dto.description;

    if (image) {
      const DOMAIN = process.env.DOMAIN || "http://localhost:3000";
      updateData.image_url = `${DOMAIN}/uploads/images/${image.filename}`;

      // Delete old image file if it's hosted locally
      if (currentBanner.image_url && currentBanner.image_url.startsWith(DOMAIN)) {
        const oldFilename = currentBanner.image_url.split("/").pop();
        if (oldFilename) {
          const oldFilePath = path.join("./uploads/images", oldFilename);
          fs.unlink(oldFilePath, (err) => {
            if (err) console.error(`Failed to delete old banner file: ${oldFilePath}`, err);
          });
        }
      }
    }

    if (dto.redirect_url !== undefined) updateData.redirect_url = dto.redirect_url;
    if (dto.sort_order !== undefined) updateData.sort_order = dto.sort_order;
    if (dto.is_active !== undefined) updateData.is_active = dto.is_active;
    if (dto.start_date !== undefined)
      updateData.start_date = dto.start_date ? new Date(dto.start_date) : null;
    if (dto.end_date !== undefined)
      updateData.end_date = dto.end_date ? new Date(dto.end_date) : null;

    await this.bannerRepository.update({ where: { id } }, updateData);

    return {
      message: this.i18n.t("banner.BANNER_UPDATED_SUCCESSFULLY"),
    };
  }

  async deleteBanner(id: number) {
    const banner = await this.getBannerById(id);

    // Delete image file if it's hosted locally
    const DOMAIN = process.env.DOMAIN || "http://localhost:3000";
    if (banner.image_url && banner.image_url.startsWith(DOMAIN)) {
      const filename = banner.image_url.split("/").pop();
      if (filename) {
        const filePath = path.join("./uploads/images", filename);
        fs.unlink(filePath, (err) => {
          if (err) console.error(`Failed to delete banner file on removal: ${filePath}`, err);
        });
      }
    }

    await this.bannerRepository.removeById(id);

    return {
      message: this.i18n.t("banner.BANNER_DELETED_SUCCESSFULLY"),
    };
  }
}
