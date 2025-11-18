import { IsDate, IsInt, Min, MinDate } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';
import { QuantityUnits } from 'src/quantityUnits/entities/productQuantityUnits.entity';
import { User } from 'src/users/entities/user.entity';
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

  @ManyToOne(() => QuantityUnits, {
    cascade: true,
  })
  quantity_unit: QuantityUnits;

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
