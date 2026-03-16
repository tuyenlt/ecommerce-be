import { Inject, Injectable } from "@nestjs/common";
import { STORAGE_DRIVER } from "./storage.constant";
import { IStorageDriver } from "./storage.interface";

@Injectable()
export class StorageService {
  constructor(
    @Inject(STORAGE_DRIVER)
    private driver: IStorageDriver,
  ) {}

  upload(buffer: Buffer, key: string, mimeType?: string) {
    return this.driver.upload(buffer, key, mimeType);
  }

  delete(key: string) {
    return this.driver.delete(key);
  }

  getUrl(key: string) {
    return this.driver.getUrl(key);
  }
}
