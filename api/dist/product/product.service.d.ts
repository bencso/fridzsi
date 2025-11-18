import { DataSource } from 'typeorm';
import { ProductDto } from './dto/Product';
import { CreateProductDto } from './dto/CreateProductDto';
import { SessionService } from '../sessions/sessions.service';
import { UsersService } from '../users/users.service';
import { Request } from 'express';
import { SearchProductDto } from './dto/SearchProductDto';
export declare class ProductService {
    private readonly usersService;
    private readonly dataSource;
    private readonly sessionsService;
    constructor(usersService: UsersService, dataSource: DataSource, sessionsService: SessionService);
    getItemById(code: string): Promise<ProductDto>;
    getItemByKeyword(keyword: string): Promise<SearchProductDto[]>;
    getItemId(code: string): Promise<any>;
    create(request: Request, createProductDto: CreateProductDto): Promise<any>;
}
