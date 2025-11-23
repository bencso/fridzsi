import { DataSource, Repository } from 'typeorm';
import { quantityTypesParams, QuantityUnits } from './entities/quantityUnits.entity';
export declare class QuantityUnitsService {
    private readonly quantityUnitsRepo;
    private readonly dataSource;
    constructor(quantityUnitsRepo: Repository<QuantityUnits>, dataSource: DataSource);
    findAll(): Promise<quantityTypesParams[] | []>;
    convertToHighest(): Promise<any>;
}
