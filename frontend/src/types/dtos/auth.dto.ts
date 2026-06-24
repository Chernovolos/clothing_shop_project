import type { UserDto } from "@/types/dtos/user.dto.ts";

export interface AuthResponseDto {
  accessToken: string;
  tokenType: 'Bearer',
  user: UserDto
}