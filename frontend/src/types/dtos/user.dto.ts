export interface CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  plainPassword: string;
}

export interface UserDto {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
}

export interface UserLoginDto {
  email: string;
  password: string;
}
