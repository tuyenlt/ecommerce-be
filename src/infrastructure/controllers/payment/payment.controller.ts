import { Body, Controller, Get, Inject, Post, Query } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { EQRType } from "src/infrastructure/common/constants/services.constant";
import { VNPayBankingService } from "src/infrastructure/services/online-banking/online-banking.service";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { OrderUsecases } from "src/usecases/order/order.usecases";
import { TestPaymentURLDto } from "./payment.dto";
import { Public } from "src/infrastructure/common/decorators/public.decorator";

@Controller("payment")
@ApiTags("Payment")
export class PaymentController {
  constructor(
    @Inject(UsecasesProxyModule.ORDER_USECASES)
    private readonly orderUseCases: UseCaseProxy<OrderUsecases>,
    private readonly onlineBankingService: VNPayBankingService,
  ) {}

  @Post("/test")
  @Public()
  async testPayment(@Body() dto: TestPaymentURLDto) {
    return await this.onlineBankingService.createOnlineBankingUrl(
      {
        amount: dto.amount,
        code: dto.code,
        order_info: "",
      },
      EQRType.ORDER_PAYMENT,
    );
  }

  @Get("/call-back")
  @Public()
  async handlePaymentCallBack(@Query() params: any) {
    return await this.orderUseCases.getInstance().handleOnlineBankingPaymentResult(params);
  }
}
