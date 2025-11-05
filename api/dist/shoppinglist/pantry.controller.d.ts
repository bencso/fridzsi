import { PantryService } from './pantry.service';
import { CreateShoppingListItemDto } from './dto/create-shoppinglist-item.dto';
import { Request } from 'express';
export declare class PantryController {
    private readonly pantryService;
    constructor(pantryService: PantryService);
    create(request: Request, createPantryItemDto: CreateShoppingListItemDto): Promise<{
        message: string[];
        statusCode: number;
    }>;
    getUserPantry(request: Request): any;
    getUserPantryItemByCode(request: Request, code: string): any;
    edit(request: Request, id: number, amount: number): Promise<{
        message: string[];
        statusCode: number;
    }>;
    remove(request: Request, id: number[]): Promise<{
        message: string[];
        statusCode: number;
    }>;
}
