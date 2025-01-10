import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { RolesGuard } from './guards/roles.guard';

const imports = [
  TypeOrmModule.forRoot({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
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
