import { IsInt, IsNotEmpty, IsString, Min } from 'class-validator';

export class UpdateQuantityRequestDTO {
  @IsString()
  bookId: string;

  @IsInt()
  @IsNotEmpty()
  @Min(0)
  quantity: number;
}
