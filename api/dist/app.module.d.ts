import { OnModuleInit } from '@nestjs/common';
import { QuantityUnits } from './quantityUnits/entities/quantityUnits.entity';
import { Repository } from 'typeorm';
export declare class AppModule implements OnModuleInit {
    private readonly repository;
    constructor(repository: Repository<QuantityUnits>);
    onModuleInit(): Promise<void>;
}
