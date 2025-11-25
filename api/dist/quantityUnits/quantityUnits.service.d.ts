import { DataSource, Repository } from 'typeorm';
import { quantityTypesParams, QuantityUnits } from './entities/quantityUnits.entity';
import { Request } from 'express';
import { SessionService } from 'src/sessions/sessions.service';
import { UsersService } from 'src/users/users.service';
import { ReturnDataDto } from 'src/dto/return.dto';
export declare class QuantityUnitsService {
    private readonly quantityUnitsRepo;
    private readonly dataSource;
    private readonly sessionsService;
    private readonly usersService;
    constructor(quantityUnitsRepo: Repository<QuantityUnits>, dataSource: DataSource, sessionsService: SessionService, usersService: UsersService);
    findAll(): Promise<quantityTypesParams[] | []>;
    getHighest({ id }: {
        id?: number;
    }): Promise<any>;
    convertToHighest({ request, productName, }: {
        request: Request;
        productName?: string;
    }): Promise<ReturnDataDto>;
}
