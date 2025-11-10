import { UsersService } from 'src/users/users.service';
import { DataSource } from 'typeorm';
import { SessionService } from 'src/sessions/sessions.service';
import { ProductService } from 'src/product/product.service';
import { ShoppingList } from './entities/shoppinglist.entity';
import { Request } from 'express';
import { ReturnDto } from 'src/dto/return.dto';
import { CreateShoppingListItemDto } from './dto/create-shoppinglist-item.dto';
export declare class ShoppingListService {
    private readonly usersService;
    private readonly dataSource;
    private readonly sessionsService;
    private readonly productService;
    constructor(usersService: UsersService, dataSource: DataSource, sessionsService: SessionService, productService: ProductService);
    getItemByDate({ date, request, }: {
        date: string;
        request: Request;
    }): Promise<ShoppingList[] | ReturnDto>;
    getItemDates({ request, }: {
        request: Request;
    }): Promise<Date[] | ReturnDto>;
    createItem({ request, data, }: {
        request: Request;
        data: CreateShoppingListItemDto;
    }): Promise<ShoppingList | ReturnDto>;
    removeItem({ id, request, body, }: {
        id: number;
        request: Request;
        body: {
            amount: number;
        };
    }): Promise<{
        message: string[];
        statusCode: number;
    }>;
}
