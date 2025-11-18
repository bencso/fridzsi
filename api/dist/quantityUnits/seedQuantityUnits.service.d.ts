import { Repository } from 'typeorm';
import { QuantityUnits } from './entities/quantityUnits.entity';
export declare class QuantityUnitsSeedService {
    private readonly repository;
    constructor(repository: Repository<QuantityUnits>);
    seedQuantityUnits(): Promise<void>;
}
