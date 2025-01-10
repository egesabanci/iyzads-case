import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { RolesGuard } from './guards/roles.guard';

const imports = [
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'test',
    entities: ['./entities/*.ts'],
    migrations: ['./migrations/*.ts'],
    synchronize: true, // should be removed in production
  }),
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
