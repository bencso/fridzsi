import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

export interface quantityTypesParams {
  label: string;
  en: string;
  hu: string;
  baseUnit: string | null;
  multiplyToBase: number;
  biggerUnit: string | null;
  divideToBigger: number;
  category?: string | null;
}

@Entity({ name: 'quantity_units' })
export class QuantityUnits {
  @PrimaryGeneratedColumn('increment')
  @JoinColumn({ name: 'quantityUnitId' })
  id: string;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  label: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'varchar', nullable: true })
  en: string;

  @Column({ type: 'varchar', nullable: true })
  hu: string;

  // A kisebb mértékegység
  @Column({ type: 'varchar', nullable: true })
  baseUnit: string | null;

  // Mennyivel kell szorozni hogy a kisebbet
  @Column({ type: 'float', nullable: true })
  multiplyToBase: number;

  // Nála nagyobb egység
  @Column({ type: 'varchar', nullable: true })
  biggerUnit: string | null;

  @Column({ type: 'float', nullable: true })
  divideToBigger: number;
}
export const quantityTypes: quantityTypesParams[] = [
  {
    category: 'mass',
    label: 'g',
    en: 'gram',
    hu: 'gramm',
    baseUnit: null,
    multiplyToBase: 1,
    biggerUnit: 'dkg',
    divideToBigger: 10,
  },
  {
    category: 'mass',
    label: 'dkg',
    en: 'decagram',
    hu: 'dekagramm',
    baseUnit: 'g',
    multiplyToBase: 10,
    biggerUnit: 'kg',
    divideToBigger: 100,
  },
  {
    category: 'mass',
    label: 'kg',
    en: 'kilogram',
    hu: 'kilogramm',
    baseUnit: 'g',
    multiplyToBase: 1000,
    biggerUnit: null,
    divideToBigger: null,
  },

  {
    category: 'volume',
    label: 'ml',
    en: 'milliliter',
    hu: 'milliliter',
    baseUnit: null,
    multiplyToBase: 1,
    biggerUnit: 'cl',
    divideToBigger: 10,
  },
  {
    category: 'volume',
    label: 'cl',
    en: 'centiliter',
    hu: 'centiliter',
    baseUnit: 'ml',
    multiplyToBase: 10,
    biggerUnit: 'dl',
    divideToBigger: 10,
  },
  {
    category: 'volume',
    label: 'dl',
    en: 'deciliter',
    hu: 'deciliter',
    baseUnit: 'ml',
    multiplyToBase: 100,
    biggerUnit: 'l',
    divideToBigger: 10,
  },
  {
    category: 'volume',
    label: 'l',
    en: 'liter',
    hu: 'liter',
    baseUnit: 'ml',
    multiplyToBase: 1000,
    biggerUnit: null,
    divideToBigger: null,
  },
  {
    category: 'utensil',
    label: 'kávéskanál',
    en: 'coffee spoon',
    hu: 'kávéskanál',
    baseUnit: 'ml',
    multiplyToBase: 2.5,
    biggerUnit: 'tk',
    divideToBigger: 2,
  },
  {
    category: 'utensil',
    label: 'tk',
    en: 'teaspoon',
    hu: 'teáskanál',
    baseUnit: 'ml',
    multiplyToBase: 5,
    biggerUnit: 'ek',
    divideToBigger: 3,
  },
  {
    category: 'utensil',
    label: 'ek',
    en: 'tablespoon',
    hu: 'evőkanál',
    baseUnit: 'ml',
    multiplyToBase: 15,
    biggerUnit: 'csésze',
    divideToBigger: 16,
  },
  {
    category: 'utensil',
    label: 'csipet',
    en: 'pinch',
    hu: 'csipet',
    baseUnit: 'ml',
    multiplyToBase: 0.5,
    biggerUnit: 'kávéskanál',
    divideToBigger: 5,
  },
  {
    category: 'utensil',
    label: 'csésze',
    en: 'cup',
    hu: 'csésze',
    baseUnit: 'ml',
    multiplyToBase: 240,
    biggerUnit: null,
    divideToBigger: null,
  },
];
