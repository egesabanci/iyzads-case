import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { User } from './entities/user.entity';
import { Book } from './entities/book.entity';
import { Store } from './entities/store.entity';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
  ) {}

  public async getAllBooks() {
    return await this.bookRepository.find({
      relations: {
        store: true,
      },
    });
  }
}
