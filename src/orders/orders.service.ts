import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GAMES_URL } from '../constants/games.constant';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { DataSource, Repository } from 'typeorm';
import { GamesClientService } from './games.service';

@Injectable()
export class OrdersService {
    constructor(
    @InjectRepository(Order)
    private readonly orderRepository: Repository<Order>,
    private readonly gamesClient: GamesClientService,
    private readonly dataSource: DataSource,
    private readonly httpService: HttpService
  ) {}

   async create(createOrderDto: CreateOrderDto): Promise<Order> {
    try {
      console.log("createOrderDto: ", createOrderDto);
      const game = await this.gamesClient.getGameById(createOrderDto.gameId);
      console.log("game: ", game);
  
      if (!game) {
        throw new Error('Game not found');
      }
  
      const { name, price } = game;
  
      const order = this.orderRepository.create({
        gameId: createOrderDto.gameId,
        gameName: name,
        gamePrice: price,
        quantity: createOrderDto.quantity,
      });
  
      return await this.orderRepository.save(order);
    } catch (err) {
      throw err;
    }
  }

  async findAll() {
    const url = `${GAMES_URL}`; // URL of Games Service
    const response$ = this.httpService.get(url);
    const response = await firstValueFrom(response$);
    console.log('response: ', response.data);

    return `This action returns all orders`;
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
