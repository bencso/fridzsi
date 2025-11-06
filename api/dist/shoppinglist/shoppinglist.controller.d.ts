import { ShoppingListService } from './shoppinglist.service';
import { Request } from 'express';
export declare class ShoppingListController {
    private readonly shoppinglistService;
    constructor(shoppinglistService: ShoppingListService);
    getItemByDate(date: string, request: Request): Promise<import("./entities/shoppinglist.entity").ShoppingList[] | import("../dto/return.dto").ReturnDto>;
    getItemDates(request: Request): Promise<import("./entities/shoppinglist.entity").ShoppingList[] | import("../dto/return.dto").ReturnDto>;
}
