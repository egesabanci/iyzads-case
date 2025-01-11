import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { config } from './ormconfig';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { RolesGuard } from './guards/roles.guard';

import { User } from './entities/user.entity';
import { Book } from './entities/book.entity';
import { Store } from './entities/store.entity';

const imports = [
  TypeOrmModule.forRoot({ ...config } as TypeOrmModuleOptions),
  TypeOrmModule.forFeature([User, Book, Store]),
];

const controllers = [AppController];

const providers = [
  AppService,
  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
];

@Module({
  imports: [...imports],
  controllers: [...controllers],
  providers: [...providers],
})
export class AppModule {}
