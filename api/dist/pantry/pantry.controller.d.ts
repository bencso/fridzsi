import { PantryService } from './pantry.service';
import { CreatePantryItemDto } from './dto/create-pantry-item.dto';
import { Request } from 'express';
export declare class PantryController {
    private readonly pantryService;
    constructor(pantryService: PantryService);
    create(request: Request, createPantryItemDto: CreatePantryItemDto): Promise<import("../dto/return.dto").ReturnDto | import("../dto/return.dto").ReturnDataDto>;
    getUserPantry(request: Request): any;
    getUserPantryItemByCode(request: Request, code: string): any;
    getUserPantryItemById(request: Request, id: string): any;
    edit(request: Request, id: number, quantity: number, quantityType: number): Promise<import("../dto/return.dto").ReturnDto>;
    remove(request: Request, id: number[]): Promise<import("../dto/return.dto").ReturnDto>;
}
