export class UserWithoutPassword {
  id: number;
  user_name: string;
  refresh_token?: string;
  deleted_at?: Date;
}

export class LoginUserM extends UserWithoutPassword {
  password: string;
}
