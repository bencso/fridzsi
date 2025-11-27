import { CreatePantryItemDto } from './dto/create-pantry-item.dto';
import { UsersService } from 'src/users/users.service';
import { DataSource } from 'typeorm';
import { SessionService } from 'src/sessions/sessions.service';
import { Request } from 'express';
import { ProductService } from 'src/product/product.service';
import { QuantityUnitsService } from 'src/quantityUnits/quantityUnits.service';
export declare class PantryService {
    private readonly usersService;
    private readonly dataSource;
    private readonly sessionsService;
    private readonly productService;
    private readonly quantityUnitsService;
    constructor(usersService: UsersService, dataSource: DataSource, sessionsService: SessionService, productService: ProductService, quantityUnitsService: QuantityUnitsService);
    create(request: Request, createPantryItemDto: CreatePantryItemDto): Promise<{
        message: string[];
        statusCode: number;
    }>;
    getUserPantry(request: Request): Promise<{
        message: string[];
        statusCode: number;
        products: any;
    } | {
        message: string[];
        statusCode: number;
        products?: undefined;
    }>;
    getUserPantryItemByCode(request: Request, code: string): Promise<{
        message: string[];
        statusCode: number;
        products: any[];
    } | {
        message: string[];
        statusCode: number;
        products?: undefined;
    }>;
    remove(request: Request, id: number[]): Promise<{
        message: string[];
        statusCode: number;
    }>;
    edit(request: Request, id: number, quantity: number, quantityType: number): Promise<{
        message: string[];
        statusCode: number;
    }>;
}
