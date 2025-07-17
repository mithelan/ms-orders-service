import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { HttpModule } from '@nestjs/axios';
import { GamesClientService } from './games.service';
import { Order } from './entities/order.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItem } from './entities/order.item.entity';

@Module({
   imports: [HttpModule,TypeOrmModule.forFeature([Order]),TypeOrmModule.forFeature([OrderItem])], 
  controllers: [OrdersController],
  providers: [OrdersService,GamesClientService],
})
export class OrdersModule {}
