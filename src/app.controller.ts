import { Controller, Get, Body, Post } from '@nestjs/common';

import { AppService } from './app.service';

import { CreateUserRequestDTO, LoginRequestDTO, UserDTO } from './dto';

import { Role, Roles, Public } from './decorators';

@Controller()
export class AppController {
  constructor(private service: AppService) {}

  @Public()
  @Post('/login')
  public async login(@Body() payload: LoginRequestDTO): Promise<UserDTO> {
    return await this.service.login(payload);
  }

  @Roles(Role.ADMIN)
  @Post('/users')
  public async createUser(
    @Body() payload: CreateUserRequestDTO,
  ): Promise<UserDTO> {
    return await this.service.createUser(payload);
  }

  @Get('/books')
  public async getBooks() {
    return await this.service.getAllBooks();
  }
}
