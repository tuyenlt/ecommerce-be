import { ApiProperty, ApiPropertyOptional, PartialType } from "@nestjs/swagger";
import { IsNumber, IsOptional, IsString, MaxLength } from "class-validator";

export class CreateCategoryDto {
  @ApiProperty({ description: "The name of the category" })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({ description: "The slug of the category" })
  @IsString()
  @MaxLength(255)
  slug: string;

  @ApiPropertyOptional({ description: "The description of the category" })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: "The image URL of the category" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  image_url?: string;

  @ApiPropertyOptional({ description: "The parent category ID" })
  @IsOptional()
  @IsNumber()
  parent_category_id?: number;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {
  @ApiPropertyOptional({ description: "The name of the category" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  name?: string;

  @ApiPropertyOptional({ description: "The slug of the category" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  slug?: string;

  @ApiPropertyOptional({ description: "The description of the category" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  description?: string;

  @ApiPropertyOptional({ description: "The image URL of the category" })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  image_url?: string;

  @ApiPropertyOptional({ description: "The parent category ID" })
  @IsOptional()
  @IsNumber()
  parent_category_id?: number;
}
