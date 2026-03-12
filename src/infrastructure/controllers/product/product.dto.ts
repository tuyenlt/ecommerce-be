import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsJSON, IsNumber, IsOptional, IsString, MaxLength } from "class-validator";
import { BasePaginationQueryDto } from "src/infrastructure/common/dtos/base_pagination_query.dto";
import { BasePaginationResponseDto } from "src/infrastructure/common/dtos/base_pagination_response.dto";
import { ProductEntity } from "src/infrastructure/entities/product.entity";
import { DeepPartial } from "typeorm";

export class GetListProductDto extends BasePaginationQueryDto {
  @ApiPropertyOptional({ description: "Name of the product" })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ description: "Category of the product" })
  @IsOptional()
  category: string;

  @ApiPropertyOptional({ description: "Minimum price of the product" })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  minPrice: number;

  @ApiPropertyOptional({ description: "Maximum price of the product" })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  maxPrice: number;
}

export class ListProductResponseDto extends BasePaginationResponseDto {
  @ApiProperty({
    example: [
      {
        id: 1,
        name: "Product 1",
        base_price: 100,
        sale_price: 80,
        images: ["image1.jpg", "image2.jpg"],
      },
    ],
  })
  data: DeepPartial<ProductEntity>[];
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
