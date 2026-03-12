import { ApiProperty, ApiPropertyOptional, OmitType } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsJSON, IsNumber, IsOptional } from "class-validator";
import { BasePaginationQueryDto } from "src/infrastructure/common/dtos/base_pagination_query.dto";

export class ListRatingDto extends OmitType(BasePaginationQueryDto, ["keyword"]) {
  @ApiPropertyOptional({ description: "ID of the product to filter ratings" })
  @IsOptional()
  @Transform(({ value }) => Number(value))
  @IsNumber()
  productId: number;
}

export class CreateRatingDto {
  @ApiProperty({ description: "ID of the product to rate" })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  product_id: number;

  @ApiProperty({ description: "Rating score" })
  @Transform(({ value }) => Number(value))
  @IsNumber()
  rating: number;

  @ApiProperty({ description: "Review comment" })
  comment: string;

  @ApiPropertyOptional({ description: "JSON Array of image URLs" })
  @IsOptional()
  @IsJSON()
  images: string;
}
