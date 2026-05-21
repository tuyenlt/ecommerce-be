import { Module } from "@nestjs/common";
import { StorageService } from "./storage.service";
import { STORAGE_DRIVER } from "./storage.constant";
import { LocalStorageDriver } from "./local/local-storage.service";

@Module({
  providers: [
    StorageService,
    {
      provide: STORAGE_DRIVER,
      useFactory: () => {
        return new LocalStorageDriver("./uploads", process.env.DOMAIN);
      },
    },
  ],
  exports: [StorageService],
})
export class StorageModule {}
