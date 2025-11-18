import { IsDate, IsInt, Min, MinDate } from 'class-validator';
import { Product } from 'src/product/entities/product.entity';
import { QuantityUnits } from 'src/quantityUnits/entities/productQuantityUnits.entity';
import { User } from 'src/users/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
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

  @ManyToMany(() => Product, {
    cascade: true,
    nullable: true,
  })
  @JoinTable()
  product?: Product;

  @Column({ type: 'varchar', nullable: true })
  customProductName?: string;

  @Column({
    type: 'int',
    default: 1,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ManyToMany(() => QuantityUnits, {
    cascade: true,
    nullable: true,
  })
  @JoinTable()
  quanity_unit?: QuantityUnits;

  @Column({
    type: 'date',
    nullable: false,
  })
  @IsDate()
  @MinDate(new Date())
  day: Date;

  @CreateDateColumn()
  createdAt: Date;
}
