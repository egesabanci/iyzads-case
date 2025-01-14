import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Role } from '../../decorators/roles.decorator';

export class CreateUserRequestDTO {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsEnum(Role)
  role: Role;
}
