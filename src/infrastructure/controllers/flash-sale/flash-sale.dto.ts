import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
  MaxLength,
  IsArray,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

export class CreateFlashSaleItemDto {
  @ApiProperty({ description: "Product ID" })
  @IsNumber()
  product_id: number;

  @ApiProperty({ description: "Flash sale promotional price" })
  @IsNumber()
  price: number;

  @ApiProperty({ description: "Flash sale quantity allocated" })
  @IsNumber()
  quantity: number;
}

export class CreateFlashSaleDto {
  @ApiProperty({ description: "Flash sale campaign name" })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiPropertyOptional({ description: "Campaign description" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: "Start time of flash sale" })
  @IsDateString()
  start_time: string;

  @ApiProperty({ description: "End time of flash sale" })
  @IsDateString()
  end_time: string;

  @ApiPropertyOptional({ description: "Is campaign active" })
  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ type: [CreateFlashSaleItemDto], description: "List of flash sale items" })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateFlashSaleItemDto)
  items?: CreateFlashSaleItemDto[];
}

export class UpdateFlashSaleDto extends PartialType(CreateFlashSaleDto) {}
