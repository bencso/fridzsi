import { UsersService } from 'src/users/users.service';
import { DataSource } from 'typeorm';
import { SessionService } from 'src/sessions/sessions.service';
import { ProductService } from 'src/product/product.service';
import { ShoppingList } from './entities/shoppinglist.entity';
import { Request } from 'express';
import { ReturnDataDto, ReturnDto } from 'src/dto/return.dto';
import { CreateShoppingListItemDto } from './dto/create-shoppinglist-item.dto';
import { QuantityUnitsService } from 'src/quantityUnits/quantityUnits.service';
export declare class ShoppingListService {
    private readonly usersService;
    private readonly dataSource;
    private readonly sessionsService;
    private readonly productService;
    private readonly quantityService;
    constructor(usersService: UsersService, dataSource: DataSource, sessionsService: SessionService, productService: ProductService, quantityService: QuantityUnitsService);
    getItemByDate({ date, request, }: {
        date: string;
        request: Request;
    }): Promise<ReturnDataDto | ReturnDto>;
    getItemById({ id, request, }: {
        id: string;
        request: Request;
    }): Promise<ReturnDataDto | ReturnDto>;
    getItemByCode({ code, request, }: {
        code: string;
        request: Request;
    }): Promise<ReturnDataDto | ReturnDto>;
    getItemByProductId({ id, request, }: {
        id: string;
        request: Request;
    }): Promise<ReturnDataDto | ReturnDto>;
    getItemNow({ query, request, }: {
        query: string;
        request: Request;
    }): Promise<ShoppingList[] | ReturnDto>;
    getItemDates({ request, }: {
        request: Request;
    }): Promise<Date[] | ReturnDto>;
    createItem({ request, data, }: {
        request: Request;
        data: CreateShoppingListItemDto;
    }): Promise<ShoppingList | ReturnDto>;
    removeItem({ ids, request }: {
        ids: number[];
        request: Request;
    }): Promise<{
        message: string[];
        statusCode: number;
    }>;
    editItem({ id, quantity, quantityUnitId, request, }: {
        id: number;
        quantity: number;
        quantityUnitId: number;
        request: Request;
    }): Promise<{
        message: string[];
        statusCode: number;
    }>;
}
