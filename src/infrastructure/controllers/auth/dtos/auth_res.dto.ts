import { ApiProperty } from "@nestjs/swagger";
import { TokenPayload } from "src/domain/model/auth";

export class AuthResponseDto {
  @ApiProperty({
    example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    description: "JWT Access Token",
  })
  accessToken: string;
}

export class UserPayloadResponseDto implements TokenPayload {
  @ApiProperty({
    example: 1,
    description: "User ID",
  })
  id: number;

  @ApiProperty({
    example: "user@example.com",
    description: "User email",
  })
  email: string;

  @ApiProperty({
    example: "John Doe",
    description: "User full name",
  })
  full_name: string;

  @ApiProperty({
    example: "https://example.com/avatar.jpg",
    description: "User avatar URL",
  })
  avatar_url?: string;

  @ApiProperty({
    example: 1,
    description: "User role",
  })
  role: number;
}
