import { Product } from "@/constants/product.interface";

export type PantryType = {
  code: string;
  name: string;
  expiredAt: string[];
  quantity: number[];
  quantityUnit: string[];
  products: Product[] | [];
};
