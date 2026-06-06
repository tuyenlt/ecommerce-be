import { ContactMessageEntity } from "src/infrastructure/entities/contact-message.entity";
import { IBaseRepository } from "./base-repository.interface";

export interface IContactMessageRepository extends IBaseRepository<ContactMessageEntity> {}
