import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

export interface quantityTypesParams {
  label: string;
  en: string;
  hu: string;
}

@Entity({ name: 'quantity_units' })
export class QuantityUnits {
  @PrimaryGeneratedColumn('increment')
  id: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  label: string;

  @Column({ type: 'varchar', nullable: true })
  en: string;

  @Column({ type: 'varchar', nullable: true })
  hu: string;
}

export const quantityTypes: quantityTypesParams[] = [
  { label: 'db', en: 'piece', hu: 'darab' },
  { label: 'g', en: 'gram', hu: 'gramm' },
  { label: 'kg', en: 'kilogram', hu: 'kilogramm' },
  { label: 'dl', en: 'deciliter', hu: 'deciliter' },
  { label: 'ml', en: 'milliliter', hu: 'milliliter' },
  { label: 'l', en: 'liter', hu: 'liter' },
  { label: 'csomag', en: 'package', hu: 'csomag' },
  { label: 'üveg', en: 'bottle', hu: 'üveg' },
  { label: 'doboz', en: 'can', hu: 'doboz' },
  { label: 'zacskó', en: 'bag', hu: 'zacskó' },
  { label: 'karton', en: 'box', hu: 'karton' },
  { label: 'csokor', en: 'bunch', hu: 'csokor' },
  { label: 'szelet', en: 'slice', hu: 'szelet' },
];
