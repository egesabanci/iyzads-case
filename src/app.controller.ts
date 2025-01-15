import {
  Controller,
  Get,
  Body,
  Post,
  Query,
  Param,
  Patch,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

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
  constructor(private service: AppService) {}

  @Public()
  @Post('/login')
  public async login(@Body() payload: LoginRequestDTO): Promise<UserDTO> {
    return await this.service.login(payload);
  }

  @Get('/stores')
  public async getStores(): Promise<StoreDTO[]> {
    return await this.service.getAllStores();
  }

  @Get('/books')
  public async getBooks(
    @Query('store') store?: number,
    @Query('book') book?: string,
  ) {
    return await this.service.getAllBooks(
      plainToInstance(GetAllBooksRequestDTO, { store, book }),
    );
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
