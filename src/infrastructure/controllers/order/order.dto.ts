import { ApiProperty } from "@nestjs/swagger";
import { IsArray, IsNotEmpty, IsNumber } from "class-validator";
import { EPaymentMethod } from "src/infrastructure/common/constants/db.constant";
import { PaginationDto } from "src/infrastructure/common/dtos/base.dto";
import { OrderEntity } from "src/infrastructure/entities/order.entity";

export class CreateOrderDto {
  @ApiProperty({ description: "The IDs of the products to order", example: [1, 2, 3] })
  @IsArray()
  @IsNotEmpty()
  @IsNumber({}, { each: true })
  cart_items_ids: number[];

  @ApiProperty({
    description: "The shipping address for the order",
    example: "123 Main St, City, Country",
  })
  address: string;

  @ApiProperty({ description: "The phone number for the order", example: "+1234567890" })
  phone: string;

  @ApiProperty({
    description:
      "The payment method for the order, can be one of the following: " +
      Object.values(EPaymentMethod).join(", "),
    example: EPaymentMethod.ONLINE_BANKING,
  })
  payment_method: EPaymentMethod;
}

export class OrderPaginationDto extends PaginationDto<OrderEntity> {}
