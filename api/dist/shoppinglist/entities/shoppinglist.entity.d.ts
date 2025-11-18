import { Product } from 'src/product/entities/product.entity';
import { QuantityUnits } from 'src/quantityUnits/entities/productQuantityUnits.entity';
import { User } from 'src/users/entities/user.entity';
export declare class ShoppingList {
    user: User;
    id: number;
    product?: Product;
    customProductName?: string;
    quantity: number;
    quanity_unit?: QuantityUnits;
    day: Date;
    createdAt: Date;
}
