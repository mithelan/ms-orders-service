// create-order.dto.ts
import { IsNumber, IsPositive, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
export class CreateOrderItemDto {
  @IsNumber()
  @IsPositive()
  gameId: number;

  @IsNumber()
  @IsPositive()
  quantity: number;
}

export class CreateOrderDto {
  @ValidateNested({ each: true })
  @Type(() => CreateOrderItemDto)
  items: CreateOrderItemDto[];
}
