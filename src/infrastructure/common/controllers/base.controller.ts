
import { ApiResponse } from "@nestjs/swagger";
import {
  BadRequestResponseDto,
  ForbiddenResponseDto,
  InternalErrorResponseDto,
  NotFoundResourceResponseDto,
  UnauthorizeResponseDto,
} from "../dtos/error_response.dto";
import { HTTP_STATUS_CODE } from "../constants/common.constant";
import { Response } from "express";

@ApiResponse({
  status: HTTP_STATUS_CODE.BAD_REQUEST,
  description: "Bad request",
  type: BadRequestResponseDto,
})
@ApiResponse({
  status: HTTP_STATUS_CODE.UNAUTHORIZED,
  description: "Invalid",
  type: UnauthorizeResponseDto,
})
@ApiResponse({
  status: HTTP_STATUS_CODE.FORBIDDEN,
  description: "Forbidden resource",
  type: ForbiddenResponseDto,
})
@ApiResponse({
  status: HTTP_STATUS_CODE.NOT_FOUND,
  description: "Resource not found",
  type: NotFoundResourceResponseDto,
})
@ApiResponse({
  status: HTTP_STATUS_CODE.INTERNAL_SERVER_ERROR,
  description: "Internal error",
  type: InternalErrorResponseDto,
})
export class BaseController {
  protected sendExcelResponse(res: Response, buffer: Buffer, filename: string) {
    const encodedFilename = encodeURIComponent(filename);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      `attachment; filename*=UTF-8''${encodedFilename}`,
    );
    res.setHeader("Content-Length", buffer.length);

    res.send(buffer);
  }
}
