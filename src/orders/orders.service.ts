import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { HttpService } from '@nestjs/axios';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { GamesClientService } from './games.service';
import { OrderItem } from './entities/order.item.entity';

@Injectable()
export class OrdersService {
    constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly gamesClient: GamesClientService,
    @InjectRepository(OrderItem)
    private readonly orderItemRepository: Repository<OrderItem>,
    private readonly dataSource: DataSource,
    private readonly httpService: HttpService
  ) {}

async create(createOrderDto: CreateOrderDto): Promise<Order> {
  const orderItems: OrderItem[] = [];

  for (const item of createOrderDto.items) {
    const game = await this.gamesClient.getGameById(item.gameId);

    if (!game) {
      throw new Error(`Game with ID ${item.gameId} not found`);
    }

    const orderItem = this.orderItemRepository.create({
      gameId: item.gameId,
      gameName: game.name,
      gamePrice: game.price,
      quantity: item.quantity,
    });

    orderItems.push(orderItem);
  }

  const order = this.orderRepository.create({ items: orderItems });
  return await this.orderRepository.save(order);
}


async findAll(): Promise<any[]> {
  const orders = await this.orderRepository.find();

  const enrichedOrders = await Promise.all(
    orders.map(async (order) => {
      const enrichedItems = await Promise.all(
        order.items.map(async (item) => {
          try {
            const game = await this.gamesClient.getGameById(item.gameId);
            return {
              ...item,
              game, 
            };
          } catch {
            return {
              ...item,
              game: null,
            };
          }
        }),
      );

      return {
        ...order,
        items: enrichedItems,
      };
    }),
  );

  return enrichedOrders;
}



  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
