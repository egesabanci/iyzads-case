import { IsString } from 'class-validator';

export class CreateStoreRequestDTO {
  @IsString()
  name: string;
}
