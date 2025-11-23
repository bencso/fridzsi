import { QuantityUnitsService } from './quantityUnits.service';
export declare class QuantityUnitsController {
    private readonly quantityUnitsService;
    constructor(quantityUnitsService: QuantityUnitsService);
    getUnits(): Promise<import("./entities/quantityUnits.entity").quantityTypesParams[] | []>;
    getTest(): Promise<any>;
}
