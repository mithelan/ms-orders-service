import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { HttpModule, HttpService } from '@nestjs/axios';
import { GamesClientService } from './games.service';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
   imports: [HttpModule,TypeOrmModule.forFeature([Order])], 
  controllers: [OrdersController],
  providers: [OrdersService,GamesClientService],
})
export class OrdersModule {}
