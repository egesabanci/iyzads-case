import {
  Controller,
  Get,
  Body,
  Post,
  Query,
  Param,
  Patch,
  Inject,
} from '@nestjs/common';

import { plainToInstance } from 'class-transformer';
import {
  CACHE_MANAGER,
  Cache,
  CacheKey,
  CacheTTL,
} from '@nestjs/cache-manager';

import { AppService } from './app.service';

import {
  CreateUserRequestDTO,
  LoginRequestDTO,
  UserDTO,
  StoreDTO,
  GetAllBooksRequestDTO,
  BookDTO,
  UpdateQuantityRequestDTO,
  CreateNewBookDTO,
  CreateStoreRequestDTO,
} from './dto';

import { Role, Roles, Public } from './decorators';

@Controller()
export class AppController {
  constructor(
    private service: AppService,
    @Inject(CACHE_MANAGER)
    private cache: Cache,
  ) {}

  @Public()
  @Post('/login')
  public async login(@Body() payload: LoginRequestDTO): Promise<UserDTO> {
    return await this.service.login(payload);
  }

  @CacheKey('get-all-stores')
  @CacheTTL(60) // 1 minutes
  @Get('/stores')
  public async getStores(): Promise<StoreDTO[]> {
    const cached = await this.cache.get<StoreDTO[]>('stores');
    if (cached) {
      return cached;
    }

    const response = await this.service.getAllStores();

    await this.cache.set('stores', response);
    return response;
  }

  @CacheKey('get-and-filter-books')
  @CacheTTL(60) // 1 minutes
  @Get('/books')
  public async getBooks(
    @Query('store') store?: number,
    @Query('book') book?: string,
  ): Promise<StoreDTO[] | BookDTO[]> {
    const cached = await this.cache.get<StoreDTO[] | BookDTO[]>(
      `store=${store}&book=${book}`,
    );

    if (cached) {
      return cached;
    }

    const response = await this.service.getAllBooks(
      plainToInstance(GetAllBooksRequestDTO, { store, book }),
    );

    await this.cache.set(`store=${store}&book=${book}`, response);
  }

  @Roles(Role.ADMIN)
  @Post('/users')
  public async createUser(
    @Body() payload: CreateUserRequestDTO,
  ): Promise<UserDTO> {
    return await this.service.createUser(payload);
  }

  @Roles(Role.ADMIN)
  @Post('/stores')
  public async createStore(
    @Body() payload: CreateStoreRequestDTO,
  ): Promise<StoreDTO> {
    return await this.service.createStore(payload);
  }

  @Roles(Role.ADMIN)
  @Post('/stores/:id/books')
  public async createNewBook(
    @Param('id') storeId: number,
    @Body() payload: CreateNewBookDTO,
  ) {
    return await this.service.createNewBook(storeId, payload);
  }

  @Roles(Role.ADMIN, Role.MANAGER)
  @Patch('/stores/:id/books')
  public async updateBookQuantity(
    @Param('id') storeId: number,
    @Body() payload: UpdateQuantityRequestDTO,
  ): Promise<BookDTO> {
    return await this.service.updateBookQuantity(storeId, payload);
  }
}
