import { Product } from 'src/product/entities/product.entity';
import { User } from 'src/users/entities/user.entity';
export declare class Pantry {
    user: User;
    id: number;
    product: Product;
    quantity: number;
    expiredAt: Date;
    createdAt: Date;
}
