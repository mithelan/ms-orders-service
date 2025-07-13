import { ConfigService } from '@nestjs/config';

export const gamesClientConfig = (configService: ConfigService) => {
  return {
    gamesEndpoint: configService.get<string>('GAMES_ENDPOINT'),
  };
};
