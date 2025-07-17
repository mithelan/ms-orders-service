import { Test, TestingModule } from '@nestjs/testing';
import { OrdersService } from './orders.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order.item.entity';
import { DataSource } from 'typeorm';
import { GamesClientService } from './games.service';
import { HttpService } from '@nestjs/axios';
import { CreateOrderDto } from './dto/create-order.dto';

describe('OrdersService', () => {
  let service: OrdersService;

  const mockOrderRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
  };

  const mockOrderItemRepository = {
    create: jest.fn(),
  };

  const mockGamesClientService = {
    getGameById: jest.fn(),
  };

beforeEach(async () => {
  const module: TestingModule = await Test.createTestingModule({
    providers: [
      OrdersService,
      { provide: getRepositoryToken(Order), useValue: mockOrderRepository },
      { provide: getRepositoryToken(OrderItem), useValue: mockOrderItemRepository },
      { provide: GamesClientService, useValue: mockGamesClientService },
      { provide: HttpService, useValue: {} },
      { provide: DataSource, useValue: {} }, 
    ],
  }).compile();

  service = module.get<OrdersService>(OrdersService);
});


  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should create an order with items', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [
          { gameId: 1, quantity: 2 },
          { gameId: 2, quantity: 1 },
        ],
      };

      const games = [
        { id: 1, name: 'Game One', price: 100 },
        { id: 2, name: 'Game Two', price: 200 },
      ];

      mockGamesClientService.getGameById
        .mockResolvedValueOnce(games[0])
        .mockResolvedValueOnce(games[1]);

      const orderItems = [
        { gameId: 1, gameName: 'Game One', gamePrice: 100, quantity: 2 },
        { gameId: 2, gameName: 'Game Two', gamePrice: 200, quantity: 1 },
      ];

      mockOrderItemRepository.create
        .mockImplementation((data) => data);

      const orderEntity = { items: orderItems };
      mockOrderRepository.create.mockReturnValue(orderEntity);
      mockOrderRepository.save.mockResolvedValue({ id: 123, ...orderEntity });

      const result = await service.create(createOrderDto);

      expect(mockGamesClientService.getGameById).toHaveBeenCalledTimes(2);
      expect(mockOrderItemRepository.create).toHaveBeenCalledTimes(2);
      expect(mockOrderRepository.create).toHaveBeenCalledWith({ items: orderItems });
      expect(mockOrderRepository.save).toHaveBeenCalledWith(orderEntity);
      expect(result).toEqual({ id: 123, items: orderItems });
    });

    it('should throw error if game not found', async () => {
      const createOrderDto: CreateOrderDto = {
        items: [{ gameId: 999, quantity: 1 }],
      };

      mockGamesClientService.getGameById.mockResolvedValue(null);

      await expect(service.create(createOrderDto)).rejects.toThrowError(
        'Game with ID 999 not found',
      );
    });
  });

  describe('findAll', () => {
    it('should return enriched orders', async () => {
      const orders = [
        {
          id: 1,
          items: [
            { gameId: 1, quantity: 2 },
            { gameId: 2, quantity: 1 },
          ],
        },
      ];

      const game1 = { id: 1, name: 'Game A', price: 300 };
      const game2 = { id: 2, name: 'Game B', price: 400 };

      mockOrderRepository.find.mockResolvedValue(orders);
      mockGamesClientService.getGameById
        .mockResolvedValueOnce(game1)
        .mockResolvedValueOnce(game2);

      const result = await service.findAll();

      expect(result[0].items[0].game).toEqual(game1);
      expect(result[0].items[1].game).toEqual(game2);
    });

    it('should handle missing game gracefully', async () => {
      const orders = [
        {
          id: 1,
          items: [{ gameId: 99, quantity: 1 }],
        },
      ];

      mockOrderRepository.find.mockResolvedValue(orders);
      mockGamesClientService.getGameById.mockRejectedValue(new Error('Not Found'));

      const result = await service.findAll();

      expect(result[0].items[0].game).toBeNull();
    });
  });
});
