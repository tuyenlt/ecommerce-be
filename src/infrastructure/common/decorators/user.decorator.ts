import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { EUserRole } from "../constants/db.constant";

export type CurrentUser = {
  id: number;
  email?: string;
  full_name?: string;
  avatar_url?: string;
  role?: EUserRole;
};

export const UserContext = createParamDecorator((data: unknown, ctx: ExecutionContext) => {
  const request = ctx.switchToHttp().getRequest();
  const user: CurrentUser = {
    id: Number(request.user.id),
    email: request.user.email,
    full_name: request.user.full_name,
    avatar_url: request.user.avatar_url,
    role: request.user.role,
  };
  return user;
});
