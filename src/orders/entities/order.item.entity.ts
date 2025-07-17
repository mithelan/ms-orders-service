import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderItem {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Order, (order) => order.items)
  order: Order;

  @Column()
  gameId: number;

  @Column()
  gameName: string;

  @Column('decimal')
  gamePrice: number;

  @Column()
  quantity: number;
}
