import { Controller, Get, Param } from '@nestjs/common';
import { QuantityUnitsService } from './quantityUnits.service';
import { quantityTypesParams } from './entities/quantityUnits.entity';

@Controller()
export class QuantityUnitsController {
  constructor(private readonly quantityUnitsService: QuantityUnitsService) {}

  @Get('/quantityTypes')
  async getUnits(): Promise<quantityTypesParams[] | []> {
    return await this.quantityUnitsService.findAll();
  }

  @Get('/quantityTypesTestById/:id')
  async getTestById(@Param('id') id: number): Promise<any> {
    return await this.quantityUnitsService.getHighest({
      id: id,
    });
  }

  @Get('/quantityTypesTest')
  async getTest(): Promise<any> {
    return await this.quantityUnitsService.getHighest({});
  }
}
