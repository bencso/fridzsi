import { CreatePantryItemDto } from './dto/create-pantry-item.dto';
import { UsersService } from 'src/users/users.service';
import { DataSource } from 'typeorm';
import { SessionService } from 'src/sessions/sessions.service';
import { Request } from 'express';
import { ProductService } from 'src/product/product.service';
import { QuantityUnitsService } from 'src/quantityUnits/quantityUnits.service';
import { ReturnDataDto, ReturnDto } from 'src/dto/return.dto';
import { ReturnPantryDto } from './dto/return-pantry.dto';
export declare class PantryService {
    private readonly usersService;
    private readonly dataSource;
    private readonly sessionsService;
    private readonly productService;
    private readonly quantityUnitsService;
    constructor(usersService: UsersService, dataSource: DataSource, sessionsService: SessionService, productService: ProductService, quantityUnitsService: QuantityUnitsService);
    create(request: Request, createPantryItemDto: CreatePantryItemDto): Promise<ReturnDataDto | ReturnDto>;
    getUserPantry(request: Request): Promise<ReturnPantryDto | ReturnDto>;
    getUserPantryItemByCode(request: Request, code: string): Promise<ReturnPantryDto | ReturnDto>;
    getUserPantryItemById(request: Request, id: string): Promise<ReturnPantryDto | ReturnDto>;
    remove(request: Request, id: number[]): Promise<ReturnDto>;
    edit(request: Request, id: number, quantity: number, quantityType: number): Promise<ReturnDto>;
}
