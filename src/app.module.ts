import { JwtModule } from '@nestjs/jwt';
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { CacheInterceptor, CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';

import { config } from './ormconfig';
import { AppService } from './app.service';
import { AppController } from './app.controller';

import { JWTGuard } from './guards';
import { RolesGuard } from './guards/roles.guard';

import { User } from './entities/user.entity';
import { Book } from './entities/book.entity';
import { Store } from './entities/store.entity';

const imports = [
  ConfigModule,
  CacheModule.register({ isGlobal: true, store: 'memory' }),
  TypeOrmModule.forRoot({ ...config } as TypeOrmModuleOptions),
  TypeOrmModule.forFeature([User, Book, Store]),
  JwtModule.register({
    secret: process.env.JWT_SECRET,
    signOptions: { expiresIn: '1h' },
  }),
];

const controllers = [AppController];

const providers = [
  AppService,
  {
    provide: APP_GUARD,
    useClass: JWTGuard,
  },
  {
    provide: APP_GUARD,
    useClass: RolesGuard,
  },
  {
    provide: APP_INTERCEPTOR,
    useClass: CacheInterceptor,
  },
];

@Module({
  imports: [...imports],
  controllers: [...controllers],
  providers: [...providers],
})
export class AppModule {}
