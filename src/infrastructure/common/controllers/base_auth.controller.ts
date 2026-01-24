
import { ApiResponse } from "@nestjs/swagger";
import {
  InternalErrorResponseDto,
  UnauthorizeResponseDto,
} from "../dtos/error_response.dto";
import { HTTP_STATUS_CODE } from "../constants/common.constant";

@ApiResponse({
  status: HTTP_STATUS_CODE.UNAUTHORIZED,
  description: "Invalid",
  type: UnauthorizeResponseDto,
})
@ApiResponse({
  status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
  description: "Internal error",
  type: InternalErrorResponseDto,
})
export class BaseAuthController {}
