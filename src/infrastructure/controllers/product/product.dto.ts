import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsJSON, IsNumber, IsOptional, IsString, MaxLength, IsEnum } from "class-validator";
import { PaginationDto } from "src/infrastructure/common/dtos/base.dto";
import { ProductEntity } from "src/infrastructure/entities/product.entity";
import { ORDER_DIRECTION } from "src/infrastructure/common/constants/common.constant";

export enum EProductSortBy {
  NAME = "name",
  PRICE = "base_price",
  CREATED_AT = "created_at",
  RATING = "rating",
}

export class GetListProductDto extends PaginationDto<ProductEntity> {
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

  category_path?: string;
}

export class ProductDto {
  @ApiProperty({ description: "Name of the product" })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: "Description of the product" })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ description: "Base price of the product" })
  @IsNumber()
  base_price: number;

  @ApiProperty({ description: "Sale price of the product" })
  @IsOptional()
  @IsNumber()
  sale_price?: number;

  @ApiProperty({ description: "Category of the product" })
  @IsOptional()
  @IsNumber()
  category_id: number;

  @ApiProperty({ description: "Warranty period of the product" })
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  warranty?: string;

  @ApiProperty({ description: "Specifications of the product" })
  @IsOptional()
  @IsJSON()
  specs?: string;

  @ApiProperty({ description: "Color options for the product" })
  @IsOptional()
  @IsJSON()
  color?: string;

  @ApiProperty({ description: "Image URLs for the product" })
  @IsOptional()
  @IsJSON()
  images?: string;
}
