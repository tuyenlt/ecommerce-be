import { Injectable } from "@nestjs/common";
import { BaseCrudRepository } from "./base_crud.repository";
import { UserEntity } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { ETableName } from "../common/constants/db.constant";

@Injectable()
export class UserRepository extends BaseCrudRepository<UserEntity> {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {
    super(userRepository, ETableName.USER);
  }
}
