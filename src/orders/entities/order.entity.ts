import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  gameId: number;

  @Column()
  gameName: string;

  @Column('decimal')
  gamePrice: number;

  @Column()
  quantity: number;

  @CreateDateColumn()
  createdAt: Date;
}
