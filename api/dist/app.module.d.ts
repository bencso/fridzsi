import { OnModuleInit } from '@nestjs/common';
import { QuantityUnitsSeedService } from './quantityUnits/seedQuantityUnits.service';
export declare class AppModule implements OnModuleInit {
    private readonly quantityUnitsSeed;
    constructor(quantityUnitsSeed: QuantityUnitsSeedService);
    onModuleInit(): Promise<void>;
}
