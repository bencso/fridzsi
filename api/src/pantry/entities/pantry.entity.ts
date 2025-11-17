import { IsDate, IsInt, Min, MinDate } from 'class-validator';
import { Product } from '../product/entities/product.entity';
import { User } from '../users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'pantry' })
export class Pantry {
  @ManyToOne(() => User, {
    cascade: true,
  })
  @JoinTable()
  user: User;

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Product, {
    cascade: true,
  })
  product: Product;

  @Column({
    type: 'int',
    default: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @Column({
    type: 'date',
    default: () => "CURRENT_DATE + INTERVAL '1 week'",
  })
  @IsDate()
  @MinDate(new Date())
  expiredAt: Date;

  @CreateDateColumn()
  createdAt: Date;
}
