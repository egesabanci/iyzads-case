import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class GetAllBooksRequestDTO {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  store?: number;

  @IsOptional()
  @IsString()
  book?: string;
}
