export interface IJwtServicePayload {
  user_name: string;
}

export interface IJwtService {
  checkToken(token: string): Promise<any>;
  createToken(
    payload: IJwtServicePayload,
    secret: string,
    expiresIn: string,
  ): string;
  verifyToken(token: string): any;
  verifyRefreshToken(token: string): any;
}
