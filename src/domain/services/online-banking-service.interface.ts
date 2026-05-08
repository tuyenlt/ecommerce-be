import { EQRType } from "src/infrastructure/common/constants/services.constant";

export interface IOnlineBankingPayLoad {
  amount: number;
  code: string;
  order_info: string;
  order_id?: number;
  user_id?: number;
}

export interface IOnlineBankingService {
  createOnlineBankingUrl(payload: IOnlineBankingPayLoad, type: EQRType);
}
