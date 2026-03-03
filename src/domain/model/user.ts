export class UserWithoutPassword {
  id: number;
  email: string;
  phone: string;
  full_name: string;
  avatar_url?: string;
  refresh_token?: string;
  deleted_at?: Date;
}

export class LoginUserM extends UserWithoutPassword {
  password: string;
}
