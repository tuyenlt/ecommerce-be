import { Injectable } from "@nestjs/common";
import { BaseCrudRepository } from "./base_crud.repository";
import { ContactMessageEntity } from "../entities/contact-message.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { IContactMessageRepository } from "src/domain/repositories/contact-message-repository.interface";

@Injectable()
export class ContactMessageRepository
  extends BaseCrudRepository<ContactMessageEntity>
  implements IContactMessageRepository
{
  constructor(
    @InjectRepository(ContactMessageEntity)
    private readonly contactMessageRepository: Repository<ContactMessageEntity>,
  ) {
    super(contactMessageRepository);
  }
}
