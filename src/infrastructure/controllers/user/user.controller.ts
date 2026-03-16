import { Body, Controller, Inject, Patch } from "@nestjs/common";
import { ApiBearerAuth, ApiOperation, ApiTags } from "@nestjs/swagger";
import { UsecasesProxyModule } from "src/infrastructure/usecases-proxy/modules/usecases-proxy.module";
import { UseCaseProxy } from "src/infrastructure/usecases-proxy/usecases-proxy";
import { UserUseCases } from "src/usecases/user/user.usecases";
import { UpdateUserDto } from "./user.dto";
import { CurrentUser, UserContext } from "src/infrastructure/common/decorators/user.decorator";
import { I18nService } from "nestjs-i18n";

@Controller("users")
@ApiBearerAuth()
@ApiTags("users")
export class UserController {
  constructor(
    @Inject(UsecasesProxyModule.USER_USECASES)
    private readonly userUseCases: UseCaseProxy<UserUseCases>,
    private readonly i18n: I18nService,
  ) {}

  @Patch()
  @ApiOperation({ description: "Update a user" })
  async updateUser(@Body() dto: UpdateUserDto, @UserContext() user: CurrentUser) {
    await this.userUseCases.getInstance().updateUser(dto, user.id);
    return { message: this.i18n.t("common.UPDATE_SUCCESS") };
  }
}
