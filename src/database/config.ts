import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';

export const databaseConfig = (configService: ConfigService): TypeOrmModuleOptions => {
  return {
    type: 'mysql',
    host: configService.get<string>('HOST', 'localhost'),
    port: configService.get<number>('DB_PORT', 3306),
    username: configService.get<string>('USERNAME', 'root'),
    password: configService.get<string>('PASSWORD', 'root1234'),
    database: configService.get<string>('DATABASE', 'orders_iit_db'),
    autoLoadEntities: true,
    synchronize: true,
    
  };
}
