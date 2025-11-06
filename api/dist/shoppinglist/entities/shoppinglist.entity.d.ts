import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
export declare class ShoppingList {
    user: User;
    id: number;
    product?: Product;
    customProductName?: string;
    amount: number;
    day: Date;
    createdAt: Date;
}
