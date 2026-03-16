import { Injectable } from "@nestjs/common";
import { promises as fs } from "fs";
import * as path from "path";
import { IStorageDriver } from "../storage.interface";

@Injectable()
export class LocalStorageDriver implements IStorageDriver {
  constructor(
    private readonly basePath: string,
    private readonly publicUrlBase: string,
  ) {}

  async upload(file: Buffer, key: string): Promise<string> {
    const filePath = path.join(this.basePath, key);

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, file);

    return this.getUrl(key);
  }

  async delete(key: string): Promise<void> {
    const filePath = path.join(this.basePath, key);
    await fs.unlink(filePath);
  }

  getUrl(key: string): string {
    return `${this.publicUrlBase}/uploads/${key}`;
  }
}
