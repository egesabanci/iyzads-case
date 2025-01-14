import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { plainToInstance } from 'class-transformer';

import { User } from './entities/user.entity';
import { Book } from './entities/book.entity';
import { Store } from './entities/store.entity';

import { CreateUserRequestDTO, LoginRequestDTO, UserDTO } from './dto';

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

  public async getAllBooks() {
    return await this.bookRepository.find({
      relations: {
        store: true,
      },
    });
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
}
