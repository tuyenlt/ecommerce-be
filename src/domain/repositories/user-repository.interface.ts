import { UserEntity } from "src/infrastructure/entities/user.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface IUserRepository extends IBaseRepository<UserEntity> {}
