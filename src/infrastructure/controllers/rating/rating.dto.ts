import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsJSON, IsNumber, IsOptional } from "class-validator";
import { PaginationDto } from "src/infrastructure/common/dtos/base.dto";
import { RatingEntity } from "src/infrastructure/entities/rating.entity";

export class ListRatingDto extends PaginationDto<RatingEntity> {
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

export class TestModelRatingDto {
  @ApiProperty({ description: "Review comment" })
  comment: string;
}

export class ListRatingForAdminDto extends PaginationDto<RatingEntity> {}
