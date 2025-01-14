import { IsNotEmpty, IsString } from 'class-validator';

export class LoginRequestDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
