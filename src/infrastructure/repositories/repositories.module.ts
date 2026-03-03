import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { TypeOrmConfigModule } from "../config/typeorm/typeorm.module";
import { UserEntity } from "../entities/user.entity";
import { UserRepository } from "./user.repository";

@Module({
  imports: [TypeOrmConfigModule, TypeOrmModule.forFeature([UserEntity])],
  providers: [UserRepository],
  exports: [UserRepository],
})
export class RepositoriesModule {}
