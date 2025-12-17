import { ShoppingListService } from './shoppinglist.service';
import { Request } from 'express';
import { CreateShoppingListItemDto } from './dto/create-shoppinglist-item.dto';
export declare class ShoppingListController {
    private readonly shoppinglistService;
    constructor(shoppinglistService: ShoppingListService);
    getItemByDate(date: string, request: Request): Promise<import("../dto/return.dto").ReturnDto | import("../dto/return.dto").ReturnDataDto>;
    getItemByCode(code: string, request: Request): Promise<import("../dto/return.dto").ReturnDto | import("../dto/return.dto").ReturnDataDto>;
    getItemById(id: string, request: Request): Promise<import("../dto/return.dto").ReturnDto | import("../dto/return.dto").ReturnDataDto>;
    getItemNow(request: Request): Promise<import("../dto/return.dto").ReturnDto | import("./entities/shoppinglist.entity").ShoppingList[]>;
    getItemNowWithQuery(query: string, request: Request): Promise<import("../dto/return.dto").ReturnDto | import("./entities/shoppinglist.entity").ShoppingList[]>;
    getItemDates(request: Request): Promise<import("../dto/return.dto").ReturnDto | Date[]>;
    createItem(data: CreateShoppingListItemDto, request: Request): Promise<import("../dto/return.dto").ReturnDto | import("./entities/shoppinglist.entity").ShoppingList>;
    editItem(id: number, data: {
        quantity: number;
        quantityUnitId: number;
    }, request: Request): Promise<{
        message: string[];
        statusCode: number;
    }>;
    removeItem(ids: number[], request: Request): Promise<{
        message: string[];
        statusCode: number;
    }>;
}
