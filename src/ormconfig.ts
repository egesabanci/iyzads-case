import { DataSource, DataSourceOptions } from 'typeorm';

export const config = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/entities/*.entity{.ts,.js}'],
  // migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: true, // should not be used in production - change to false
};

export const AppDataSource = new DataSource({ ...config } as DataSourceOptions);
