import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth() {
    return {status: 'OK', env: process.env.GAMES_ENDPOINT};
  }
}
