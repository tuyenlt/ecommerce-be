import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { Observable } from "rxjs";

@Injectable()
export class RoleGuard implements CanActivate {
  constructor(private readonly allowedRoles: any) {
    if (!Array.isArray(allowedRoles)) {
      this.allowedRoles = [allowedRoles];
    }
  }

  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const user = context.switchToHttp().getRequest().user;
    console.log("User in RoleGuard:", user); // Debug log to check the user object

    if (!user) {
      return false;
    }

    const hasRole = () => this.allowedRoles.includes(user.role);
    return user && user.role && hasRole();
  }
}
