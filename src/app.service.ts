import * as bcrypt from 'bcryptjs';
import { ILike, Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

import { User } from './entities/user.entity';
import { Book } from './entities/book.entity';
import { Store } from './entities/store.entity';

import {
  CreateUserRequestDTO,
  LoginRequestDTO,
  UserDTO,
  GetAllBooksRequestDTO,
  StoreDTO,
  UpdateQuantityRequestDTO,
  BookDTO,
  CreateStoreRequestDTO,
  CreateNewBookDTO,
} from './dto';

@Injectable()
export class AppService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Book)
    private bookRepository: Repository<Book>,
    @InjectRepository(Store)
    private storeRepository: Repository<Store>,
    private jwtService: JwtService,
  ) {}

  public async getAllStores(): Promise<StoreDTO[]> {
    const stores = await this.storeRepository.find({ relations: ['books'] });
    return plainToInstance(StoreDTO, stores);
  }

  public async getAllBooks(
    payload: GetAllBooksRequestDTO,
  ): Promise<StoreDTO[] | BookDTO[]> {
    if (payload.store) {
      const queryResponse = await this.storeRepository.find({
        where: {
          id: payload.store ? payload.store : undefined,
          books: {
            name: payload.book ? ILike(`%${payload.book}%`) : undefined,
          },
        },
        relations: ['books'],
      });

      return plainToInstance(StoreDTO, queryResponse);
    }

    const queryResponse = await this.bookRepository.find({
      where: {
        name: payload.book ? ILike(`%${payload.book}%`) : undefined,
      },
      relations: ['store'],
    });

    return plainToInstance(BookDTO, queryResponse);
  }

  public async login(payload: LoginRequestDTO): Promise<UserDTO> {
    const user = await this.userRepository.findOne({
      where: { name: payload.name },
    });

    if (!user) {
      throw new HttpException(
        `User with name '${payload.name}' was not found`,
        404,
      );
    }

    const isValidPassword = await bcrypt.compare(
      payload.password,
      user.password,
    );

    if (!isValidPassword) {
      throw new HttpException('Invalid credentials', 401);
    }

    const token = this.jwtService.sign({
      id: user.id,
      name: user.name,
      role: user.role,
    });

    return plainToInstance(UserDTO, {
      ...user,
      password: undefined,
      jwt: token,
    });
  }

  public async createUser(payload: CreateUserRequestDTO): Promise<UserDTO> {
    const existingUser = await this.userRepository.findOne({
      where: { name: payload.name },
    });

    if (existingUser) {
      throw new HttpException(
        `User with name '${payload.name}' already exists`,
        400,
      );
    }

    const hashedPassword = await bcrypt.hash(payload.password, 10);
    payload = { ...payload, password: hashedPassword };

    const user = await this.userRepository.save(plainToInstance(User, payload));
    return plainToInstance(UserDTO, {
      ...user,
      password: undefined,
      jwt: undefined,
    });
  }

  public async updateBookQuantity(
    storeId: number,
    payload: UpdateQuantityRequestDTO,
  ): Promise<BookDTO> {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
      relations: ['books'],
    });

    if (!store) {
      throw new HttpException(`Store with id '${storeId}' was not found`, 404);
    }

    const book = store.books.find((book) => book.id === payload.bookId);

    if (!book) {
      throw new HttpException(
        `Book with id '${payload.bookId}' was not found in store with id '${storeId}'`,
        404,
      );
    }

    book.stock = payload.quantity;
    await this.bookRepository.save(book);

    return plainToInstance(BookDTO, book);
  }

  public async createStore(payload: CreateStoreRequestDTO): Promise<StoreDTO> {
    const existingStore = await this.storeRepository.findOne({
      where: { name: payload.name },
    });

    if (existingStore) {
      throw new HttpException(
        `Store with name '${payload.name} is already exists`,
        400,
      );
    }

    const store = await this.storeRepository.save(
      plainToInstance(Store, payload),
    );

    return plainToInstance(StoreDTO, store);
  }

  public async createNewBook(storeId: number, payload: CreateNewBookDTO) {
    const store = await this.storeRepository.findOne({
      where: { id: storeId },
    });

    if (!store) {
      throw new HttpException(`Store with id '${storeId}' was not found`, 404);
    }

    const existingBook = await this.bookRepository.findOne({
      where: {
        name: payload.name,
        store: { id: storeId },
      },
    });

    if (existingBook) {
      throw new HttpException(
        `Book with name '${payload.name}' already exists in store with id '${storeId}'`,
        400,
      );
    }

    const book = await this.bookRepository.save(
      plainToInstance(Book, {
        ...payload,
        store,
      }),
    );

    return plainToInstance(BookDTO, book);
  }
}
