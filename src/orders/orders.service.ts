import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { GAMES_URL } from '../constants/games.constant';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class OrdersService {
  constructor(private readonly httpService: HttpService) {}
  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  async findAll() {
    const url = `${GAMES_URL}`; // URL of Games Service
const response$ = this.httpService.get(url);
 const response = await firstValueFrom(response$);
 console.log("response: ", response.data);

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
