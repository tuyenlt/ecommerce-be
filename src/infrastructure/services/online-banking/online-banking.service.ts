import { Injectable } from "@nestjs/common";
import {
  IOnlineBankingPayLoad,
  IOnlineBankingService,
} from "src/domain/services/online-banking-service.interface";
import { EQRType } from "src/infrastructure/common/constants/services.constant";
import { LoggerService } from "src/infrastructure/logger/logger.service";
import { dateFormat, HashAlgorithm, ProductCode, VNPay, VnpLocale } from "vnpay";

@Injectable()
export class VNPayBankingService implements IOnlineBankingService {
  private readonly VNPAY_HOST = process.env.VNPAY_HOST || "";
  private readonly VNP_TMNCODE = process.env.VNP_TMNCODE || "";
  private readonly VNP_HASHSECRET = process.env.VNP_HASHSECRET || "";
  private readonly VNP_IPADDR = process.env.VNP_IPADDR || "";
  private readonly VNP_RETURNURL = process.env.VNP_RETURNURL || "";

  constructor(private readonly logger: LoggerService) {}

  async createOnlineBankingUrl(payload: IOnlineBankingPayLoad, type: EQRType) {
    const vnpay = new VNPay({
      tmnCode: this.VNP_TMNCODE,
      secureSecret: this.VNP_HASHSECRET,
      testMode: true,
      vnpayHost: this.VNPAY_HOST,
      hashAlgorithm: HashAlgorithm.SHA512,
      loggerFn: (msg: string) => {
        this.logger.log("VNPAY", msg);
      },
    });

    const vnpayUrl = vnpay.buildPaymentUrl({
      vnp_Amount: payload.amount,
      vnp_TxnRef: payload.code,
      vnp_IpAddr: this.VNP_IPADDR,
      vnp_OrderInfo: `Payment for bill code: ${payload.code}, type: ${type}`,
      vnp_OrderType: ProductCode.Other,
      vnp_ReturnUrl: this.VNP_RETURNURL,
      vnp_Locale: VnpLocale.VN,
      vnp_CreateDate: dateFormat(new Date()),
      vnp_ExpireDate: dateFormat(new Date(Date.now() + 72 * 60 * 60 * 1000)),
    });

    return vnpayUrl;
  }
}
