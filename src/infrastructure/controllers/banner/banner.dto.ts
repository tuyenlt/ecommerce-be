import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsDateString,
  MaxLength,
} from "class-validator";

export class CreateBannerDto {
  @ApiProperty({ description: "Banner title" })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: "Banner description" })
  @IsString()
  description: string;

  @ApiProperty({ type: "string", format: "binary", description: "Banner image file" })
  image: any;

  @ApiPropertyOptional({ description: "Redirect URL when banner is clicked" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  redirect_url?: string;

  @ApiPropertyOptional({ description: "Sort order (default: 0)" })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  sort_order?: number;

  @ApiPropertyOptional({ description: "Is banner active" })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === "string") return value.toLowerCase() === "true";
    return value;
  })
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ description: "Banner start date" })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ description: "Banner end date" })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}

export class UpdateBannerDto extends PartialType(CreateBannerDto) {
  @ApiPropertyOptional({ description: "Banner title" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  title?: string;

  @ApiPropertyOptional({ description: "Banner description" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ type: "string", format: "binary", description: "Banner image file" })
  @IsOptional()
  image?: any;

  @ApiPropertyOptional({ description: "Redirect URL when banner is clicked" })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  redirect_url?: string;

  @ApiPropertyOptional({ description: "Sort order" })
  @IsOptional()
  @Transform(({ value }) => (value ? Number(value) : undefined))
  @IsNumber()
  sort_order?: number;

  @ApiPropertyOptional({ description: "Is banner active" })
  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === "string") return value.toLowerCase() === "true";
    return value;
  })
  @IsBoolean()
  is_active?: boolean;

  @ApiPropertyOptional({ description: "Banner start date" })
  @IsOptional()
  @IsDateString()
  start_date?: string;

  @ApiPropertyOptional({ description: "Banner end date" })
  @IsOptional()
  @IsDateString()
  end_date?: string;
}
