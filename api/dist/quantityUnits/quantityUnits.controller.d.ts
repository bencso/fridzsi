import { quantityTypesParams } from './entities/quantityUnits.entity';
import { DataSource } from 'typeorm';
export declare class QuantityUnitsController {
    private readonly dataSource;
    constructor(dataSource: DataSource);
    getUnits(): Promise<quantityTypesParams[]>;
}
