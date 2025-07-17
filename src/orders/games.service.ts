import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class GamesClientService {
   private readonly gamesEndpoint: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.gamesEndpoint = this.configService.get<string>('GAMES_ENDPOINT', 'http://localhost:3001');
  }

  async getGameById(id: number) {
    const url = `${this.gamesEndpoint}/games/${id}`;
    const { data } = await firstValueFrom(this.httpService.get(url));
    return data;
  }
}
