import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config();

const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'password',
  database: process.env.DB_NAME || 'booking_db',
  
  entities: [
    path.join(__dirname, 'entities/*.js'),
    path.join(__dirname, 'entities/*.ts')
  ],
  
  ...(isProduction && {
    entities: [path.join(__dirname, 'entities/*.js')]
  }),
  
  synchronize: false,
  logging: process.env.NODE_ENV !== 'production',
  
  migrations: [path.join(__dirname, 'migrations/*.js')],
  subscribers: [],
  
  extra: {
    max: 20,
    connectionTimeoutMillis: 10000,
  },
});