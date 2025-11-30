import { QuantityUnitsService } from './quantityUnits.service';
import { quantityTypesParams } from './entities/quantityUnits.entity';
export declare class QuantityUnitsController {
    private readonly quantityUnitsService;
    constructor(quantityUnitsService: QuantityUnitsService);
    getUnits(): Promise<quantityTypesParams[] | []>;
    getTestById(id: number): Promise<any>;
    getTest(): Promise<any>;
}
