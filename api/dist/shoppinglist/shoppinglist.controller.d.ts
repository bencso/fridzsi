import { ShoppingListService } from './shoppinglist.service';
import { Request } from 'express';
import { CreateShoppingListItemDto } from './dto/create-shoppinglist-item.dto';
export declare class ShoppingListController {
    private readonly shoppinglistService;
    constructor(shoppinglistService: ShoppingListService);
    getItemByDate(date: string, request: Request): Promise<import("./entities/shoppinglist.entity").ShoppingList[] | import("../dto/return.dto").ReturnDto>;
    getItemNow(request: Request): Promise<import("./entities/shoppinglist.entity").ShoppingList[] | import("../dto/return.dto").ReturnDto>;
    getItemNowWithQuery(query: string, request: Request): Promise<import("./entities/shoppinglist.entity").ShoppingList[] | import("../dto/return.dto").ReturnDto>;
    getItemDates(request: Request): Promise<import("../dto/return.dto").ReturnDto | Date[]>;
    createItem(data: CreateShoppingListItemDto, request: Request): Promise<import("./entities/shoppinglist.entity").ShoppingList | import("../dto/return.dto").ReturnDto>;
    removeItem(id: number, body: {
        amount: number;
    }, request: Request): Promise<{
        message: string[];
        statusCode: number;
    }>;
}
