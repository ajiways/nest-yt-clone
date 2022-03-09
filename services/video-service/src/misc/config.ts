import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';
config();

const configService = new ConfigService();

export const PG_HOST = configService.get<string>('PG_HOST');
export const PG_USER = configService.get<string>('PG_USER');
export const PG_PASSWORD = configService.get<string>('PG_PASSWORD');
export const PG_DATABASE = configService.get<string>('PG_DATABASE');
export const PG_PORT = configService.get<number>('PG_PORT');
export const APP_PORT = configService.get<number>('APP_PORT');
export const KAFKA_HOST = configService.get<string>('KAFKA_HOST');
export const KAFKA_PORT = configService.get<number>('KAFKA_PORT');
export const GROUPID = configService.get<string>('GROUPID');
