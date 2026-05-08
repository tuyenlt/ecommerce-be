import { ApiProperty } from "@nestjs/swagger";

export class TestPaymentURLDto {
  @ApiProperty({ example: 100 })
  amount: number;

  @ApiProperty({ example: "ORDER_12345" })
  code: string;
}
