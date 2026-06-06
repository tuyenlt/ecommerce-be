import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNumber, IsOptional, IsString, MaxLength, IsEnum } from "class-validator";
import { PaginationDto } from "src/infrastructure/common/dtos/base.dto";
import { ProductEntity } from "src/infrastructure/entities/product.entity";
import { ORDER_DIRECTION } from "src/infrastructure/common/constants/common.constant";

export enum EProductSortBy {
  NAME = "name",
  PRICE = "base_price",
  CREATED_AT = "created_at",
  RATING = "avg_rating",
  PURCHASE_COUNT = "purchased",
}

export class GetListProductDto extends OmitType(PaginationDto<ProductEntity>, [
  "search",
  "filter",
]) {
  @ApiPropertyOptional({ description: "Name of the product" })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiPropertyOptional({ description: "Category ID of the product" })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  category_id?: number;

  @ApiPropertyOptional({ description: "Minimum price of the product" })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  minPrice?: number;

  @ApiPropertyOptional({ description: "Maximum price of the product" })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  maxPrice?: number;

  @ApiPropertyOptional({
    description: "Sort by field (name, price, createdAt, rating)",
    enum: EProductSortBy,
    default: "created_at",
  })
  @IsOptional()
  @IsEnum(EProductSortBy)
  sortBy?: EProductSortBy = EProductSortBy.CREATED_AT;

  @ApiPropertyOptional({
    description: "Sort order (ASC or DESC)",
    enum: ORDER_DIRECTION,
    default: "DESC",
  })
  @IsOptional()
  @IsEnum(ORDER_DIRECTION)
  sortOrder?: ORDER_DIRECTION = ORDER_DIRECTION.DESC;

  @ApiPropertyOptional({ description: "Filter by on sale status" })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === "string") return value.toLowerCase() === "true";
    return value;
  })
  onSale?: boolean;

  @ApiPropertyOptional({ description: "Filter by active flash sale status" })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === "string") return value.toLowerCase() === "true";
    return value;
  })
  onFlashSale?: boolean;

  category_path?: string;
}

export class ProductDto {
  @ApiProperty({ description: "Name of the product" })
  @IsString()
  @MaxLength(255)
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  name?: string;

  @ApiProperty({ description: "Description of the product" })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  description?: string;

  @ApiProperty({ description: "Base price of the product" })
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  base_price?: number;

  @ApiProperty({ description: "Sale price of the product" })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  sale_price?: number;

  @ApiProperty({ description: "Category of the product" })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  category_id: number;

  @ApiProperty({ description: "Warranty period of the product" })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  @Transform(({ value }) => (typeof value === "string" ? value.trim() : value))
  warranty?: string;

  @ApiProperty({ description: "Specifications of the product" })
  @IsOptional()
  specs?: string;

  @ApiProperty({ description: "Color options for the product" })
  @IsOptional()
  color?: string;

  @ApiProperty({ description: "Stock quantity of the product" })
  @IsOptional()
  stock: number;

  @ApiPropertyOptional({ description: "Image URLs for the product" })
  @IsOptional()
  @IsString()
  images?: string;

  @ApiPropertyOptional({ description: "Image files uploaded" })
  @IsOptional()
  images_files?: Express.Multer.File[];
}
