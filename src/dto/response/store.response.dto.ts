import { BookDTO } from './book.response.dto';

export class StoreDTO {
  id: number;

  name: string;

  books: BookDTO[];
}
