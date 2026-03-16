import { DataSource } from "typeorm";
import { BaseUseCases } from "../base.usecases";
import { UserRepository } from "src/infrastructure/repositories/user.repository";
import { I18nService } from "nestjs-i18n";
import { UpdateUserDto } from "src/infrastructure/controllers/user/user.dto";

export class UserUseCases extends BaseUseCases {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly i18n: I18nService,
    protected readonly dataSource: DataSource,
  ) {
    super(dataSource);
  }

  async updateUser(dto: UpdateUserDto, userId: number) {
    const user = await this.findOneOrFail(userId);
    user.full_name = dto.full_name || user.full_name;
    user.phone = dto.phone || user.phone;
    await this.userRepository.update(userId, user);
  }

  private async findOneOrFail(userId: number) {
    const user = await this.userRepository.findOneByFilter({ id: userId });
    if (!user) {
      throw new Error(this.i18n.t("user.not_found"));
    }
    return user;
  }
}
