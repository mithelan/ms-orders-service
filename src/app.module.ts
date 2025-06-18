import { Module, OnModuleInit, Logger } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { databaseConfig } from './database/config';
import { OrdersModule } from './orders/orders.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
    `.env.${process.env.NODE_ENV || 'development'}.local`,
    `.env.${process.env.NODE_ENV || 'development'}`,
    '.env',
  ],
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => databaseConfig(configService),
      inject: [ConfigService],
    }),
    OrdersModule,
  ],
})
export class AppModule implements OnModuleInit {
  constructor(private readonly dataSource: DataSource) {}

  async onModuleInit() {
    if (this.dataSource.isInitialized) {
      Logger.log('✅ Successfully connected to the MySQL database!', 'TypeORM-Orders');
    } else {
      Logger.error('❌ Failed to connect to the database.', 'TypeORM');
    }
  }
}
