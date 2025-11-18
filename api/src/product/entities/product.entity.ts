import { IsInt, IsNumber, IsUrl, Min, MinLength } from 'class-validator';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { QuantityUnits } from '../../quantityUnits/entities/quantityUnits.entity';

@Entity({ name: 'product' })
export class Product {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({ type: 'text', nullable: true, unique: true })
  @MinLength(1)
  code: string;

  @Column({ type: 'text', nullable: true })
  @MinLength(5)
  product_name: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  brands: string;

  @Column({
    type: 'integer',
    nullable: true,
  })
  @IsInt()
  @Min(1)
  quantity: number;

  @ManyToOne(() => QuantityUnits, {
    cascade: true,
  })
  product_quantity_unit: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  categories: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  @IsNumber()
  @Min(1)
  serving_size: string;

  @Column({ type: 'float', nullable: true })
  @IsNumber()
  energy_kcal_100g: number;

  @Column({ type: 'float', nullable: true })
  @IsNumber()
  fat_100g: number;

  @Column({ type: 'float', nullable: true })
  @IsNumber()
  saturated_fat_100g: number;

  @Column({ type: 'float', nullable: true })
  @IsNumber()
  carbohydrates_100g: number;

  @Column({ type: 'float', nullable: true })
  @IsNumber()
  sugars_100g: number;

  @Column({ type: 'float', nullable: true })
  @IsNumber()
  fiber_100g: number;

  @Column({ type: 'float', nullable: true })
  @IsNumber()
  proteins_100g: number;

  @Column({ type: 'float', nullable: true })
  @IsNumber()
  salt_100g: number;

  @Column({ type: 'varchar', nullable: true })
  @IsUrl()
  image_url: string;

  @Column({ type: 'text', nullable: true })
  ingredients_text: string;
}
