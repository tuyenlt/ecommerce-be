import { Module } from "@nestjs/common";
import { DataProcessingService } from "./data-processing.service";
import { ApiClientModule } from "../api-client/api-client.module";

@Module({
  imports: [ApiClientModule],
  providers: [DataProcessingService],
  exports: [DataProcessingService],
})
export class DataProcessingModule {}
