import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigModule } from "../config/typeorm/typeorm.module";

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([])],
  providers: [],
  exports: [],
})
export class RepositoriesModule {}
