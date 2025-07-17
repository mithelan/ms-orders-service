import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { DataSource } from 'typeorm';
import { Order } from '../entities/order.entity';
import { OrderItem } from '../entities/order.item.entity';
import { GamesClientService } from '../games.service';
import { OrdersService } from '../orders.service';
import { CreateOrderDto } from '../dto/create-order.dto';
import { HttpService } from '@nestjs/axios';

describe('OrdersService (Integration)', () => {
  let service: OrdersService;
  let dataSource: DataSource;

  const mockGamesClientService = {
    getGameById: jest.fn(),
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: '.env.test',
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync({
          useFactory: (): TypeOrmModuleOptions => ({
            type: 'mysql',
            host: process.env.DB_HOST ?? 'localhost',
            port: parseInt(process.env.DB_PORT ?? '3306', 10),
            username: process.env.DB_USERNAME ?? 'root',
            password: process.env.DB_PASSWORD ?? 'root1234',
            database: process.env.DB_NAME ?? 'orders_iit_db',
            entities: [Order, OrderItem],
            synchronize: true,
            dropSchema: true,
          }),
        }),
        TypeOrmModule.forFeature([Order, OrderItem]),
      ],
      providers: [
        OrdersService,
        {
          provide: GamesClientService,
          useValue: mockGamesClientService,
        },
         { provide: HttpService, useValue: {} },
              { provide: DataSource, useValue: {} }, 
      ],
    }).compile();

    service = module.get<OrdersService>(OrdersService);
    dataSource = module.get<DataSource>(DataSource);
  });

  afterEach(async () => {
await dataSource.getRepository(OrderItem).createQueryBuilder().delete().where('1=1').execute();
await dataSource.getRepository(Order).createQueryBuilder().delete().where('1=1').execute();

    jest.clearAllMocks();
  });

  afterAll(async () => {
    await dataSource.destroy();
  });

  it('should create an order and persist it', async () => {
    const dto: CreateOrderDto = {
      items: [
        { gameId: 1, quantity: 2 },
        { gameId: 2, quantity: 1 },
      ],
    };

    const games = [
      { id: 1, name: 'Zelda', price: 500 },
      { id: 2, name: 'Halo', price: 300 },
    ];

    mockGamesClientService.getGameById
      .mockResolvedValueOnce(games[0])
      .mockResolvedValueOnce(games[1]);

    const result = await service.create(dto);

    expect(result.id).toBeDefined();
    expect(result.items).toHaveLength(2);

    const orderRepo = dataSource.getRepository(Order);
    const saved = await orderRepo.find({ relations: ['items'] });

    expect(saved.length).toBe(1);
    expect(saved[0].items[0].gameName).toBe('Zelda');
  });

  it('should fetch all orders with enriched game info', async () => {
    const dto: CreateOrderDto = {
      items: [{ gameId: 3, quantity: 1 }],
    };

    mockGamesClientService.getGameById.mockResolvedValueOnce({
      id: 3,
      name: 'Mario',
      price: 400,
    });

    await service.create(dto);

    mockGamesClientService.getGameById.mockResolvedValueOnce({
      id: 3,
      name: 'Mario',
      price: 400,
    });

    const orders = await service.findAll();

    expect(orders.length).toBe(1);
    expect(orders[0].items[0].game.name).toBe('Mario');
  });
});
