import { Product } from "@/constants/product.interface";

export type PantryType = {
    code: string;
    name: string;
    expiredAt: string[];
    amount: number[];
    products: Product[] | [];
}