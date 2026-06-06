import { DataSource } from "typeorm";
import { BaseUseCases } from "../base.usecases";
import { IContactMessageRepository } from "src/domain/repositories/contact-message-repository.interface";
import { ContactMessageEntity } from "src/infrastructure/entities/contact-message.entity";
import { EContactMessageType, EUserRole } from "src/infrastructure/common/constants/db.constant";

export class SupportChatUseCases extends BaseUseCases {
  constructor(
    private readonly contactMessageRepository: IContactMessageRepository,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async getMessages(userId: number, page?: number, limit?: number) {
    const paginated = await this.contactMessageRepository.getAllPaginated({
      where: { user_id: userId },
      order: { created_at: "DESC" },
      relations: ["user"],
      page: page || 1,
      limit: limit || 50,
    });
    paginated.data.reverse();
    return paginated;
  }

  async createMessage(userId: number, content: string, type: EContactMessageType) {
    const message = new ContactMessageEntity();
    message.user_id = userId;
    message.content = content;
    message.type = type;
    message.is_read = false;
    return await this.contactMessageRepository.create(message);
  }

  async markMessagesAsRead(userId: number, readerRole: EUserRole) {
    const targetType =
      readerRole === EUserRole.ADMIN
        ? EContactMessageType.CUSTOMER_TO_ADMIN
        : EContactMessageType.ADMIN_TO_CUSTOMER;

    await this.contactMessageRepository.update(
      {
        where: {
          user_id: userId,
          type: targetType,
          is_read: false,
        },
      },
      { is_read: true },
    );
  }

  async getConversations() {
    const rawList = await this.contactMessageRepository
      .getQueryBuilder("cm")
      .leftJoin("cm.user", "user")
      .select([
        "user.id as user_id",
        "user.full_name as user_full_name",
        "user.email as user_email",
        "user.avatar_url as user_avatar_url",
        "user.phone as user_phone",
        "cm.content as last_message_content",
        "cm.type as last_message_type",
        "cm.is_read as last_message_is_read",
        "cm.created_at as last_message_created_at",
      ])
      .addSelect(
        `(SELECT COUNT(*)::int FROM contact_messages unread WHERE unread.user_id = cm.user_id AND unread.type = 'customer_to_admin' AND unread.is_read = false)`,
        "unread_count",
      )
      .where(
        "cm.id IN (SELECT MAX(innerCm.id) FROM contact_messages innerCm GROUP BY innerCm.user_id)",
      )
      .orderBy("cm.created_at", "DESC")
      .getRawMany();

    return rawList.map((item) => ({
      user: {
        id: Number(item.user_id),
        full_name: item.user_full_name,
        email: item.user_email,
        avatar_url: item.user_avatar_url,
        phone: item.user_phone,
      },
      last_message: {
        content: item.last_message_content,
        type: item.last_message_type,
        is_read: item.last_message_is_read,
        created_at: item.last_message_created_at,
      },
      unread_count: item.unread_count || 0,
    }));
  }
}
