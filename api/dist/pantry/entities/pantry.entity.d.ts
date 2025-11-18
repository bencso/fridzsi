import { Product } from 'src/product/entities/product.entity';
import { QuantityUnits } from 'src/quantityUnits/entities/quantityUnits.entity';
import { User } from 'src/users/entities/user.entity';
export declare class Pantry {
    user: User;
    id: number;
    product: Product;
    quantity: number;
    quantity_unit: QuantityUnits;
    expiredAt: Date;
    createdAt: Date;
}
