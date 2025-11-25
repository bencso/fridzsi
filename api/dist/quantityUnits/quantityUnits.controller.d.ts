import { QuantityUnitsService } from './quantityUnits.service';
import { Request } from 'express';
export declare class QuantityUnitsController {
    private readonly quantityUnitsService;
    constructor(quantityUnitsService: QuantityUnitsService);
    getUnits(): Promise<import("./entities/quantityUnits.entity").quantityTypesParams[] | []>;
    getTestById(id: number): Promise<any>;
    getTest(): Promise<any>;
    getTestUser(request: Request, productName?: string): Promise<any>;
}
