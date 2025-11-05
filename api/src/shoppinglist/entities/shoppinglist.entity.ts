import { IsDate, IsInt, Min, MinDate } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity({ name: 'shoppinglist' })
export class ShoppingList {
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
  @JoinTable()
  product: Product;

  @Column({
    type: 'int',
    default: 1,
  })
  @IsInt()
  @Min(1)
  amount: number;

  @Column({
    type: 'date',
    default: () => "CURRENT_DATE + INTERVAL '1 week'",
  })
  @IsDate()
  @MinDate(new Date())
  day: Date;

  @CreateDateColumn()
  createdAt: Date;
}
