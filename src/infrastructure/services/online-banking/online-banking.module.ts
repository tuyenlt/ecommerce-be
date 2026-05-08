import { Module } from "@nestjs/common";
import { VNPayBankingService } from "./online-banking.service";
import { LoggerService } from "src/infrastructure/logger/logger.service";

@Module({
  providers: [VNPayBankingService, LoggerService],
  exports: [VNPayBankingService],
})
export class OnlineBankingModule {}
